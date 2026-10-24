// Runs Chrome against the real Next.js proxy, using synthetic local API sessions.
// bun tests/auth-proxy-browser.mjs [--production]
// Production mode requires a build whose API upstream is an unused localhost port.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

const root = process.cwd(), production = process.argv.includes('--production');
let upstream = new URL('http://127.0.0.1:0/api/v1');
if (production) {
  const manifest = JSON.parse(await readFile(join(root, '.next/routes-manifest.json'), 'utf8'));
  const rules = Array.isArray(manifest.rewrites) ? manifest.rewrites : Object.values(manifest.rewrites).flat();
  upstream = new URL(rules.find(rule => rule.source === '/api/v1/:path*').destination.replace('/:path*', ''));
  assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(upstream.hostname), 'Only a local fixture upstream is allowed');
  assert.ok(upstream.port, 'Production test requires an explicit local fixture port');
}
const user = { id: 'proxy-fixture', name: 'Proxy Fixture Admin', email: 'proxy@example.test', role: 'ADMIN' };
let access = '', refresh = '', active = false, refreshes = 0, next, chrome, ws;
const apiCalls = [], browserApiCalls = [], exceptions = [], pending = new Map();
let sequence = 0, logs = '';
const json = (data, status = 200, cookies = []) => {
  const headers = new Headers({ 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  for (const cookie of cookies) headers.append('Set-Cookie', cookie);
  return new Response(JSON.stringify({ success: status < 400, data, ...(status >= 400 ? { message: 'Fixture authentication required' } : {}) }), { status, headers });
};
const sessionCookies = () => [
  `__Host-lm_access_token=${access}; Path=/; HttpOnly; Secure; SameSite=Lax`,
  `__Host-lm_refresh_token=${refresh}; Path=/; HttpOnly; Secure; SameSite=Lax`,
];
const fixture = Bun.serve({ hostname: upstream.hostname.replace(/[[\]]/g, ''), port: Number(upstream.port), async fetch(request) {
  const path = new URL(request.url).pathname, cookie = request.headers.get('cookie') || '';
  apiCalls.push({ path, method: request.method });
  if (path === '/api/v1/auth/login') {
    const body = await request.json();
    assert.equal(body.email, user.email); assert.equal(body.password, 'Fixture-only-123');
    access = randomUUID(); refresh = randomUUID(); active = true;
    return json(user, 200, sessionCookies());
  }
  if (path === '/api/v1/auth/refresh') {
    if (!active || !cookie.includes(`__Host-lm_refresh_token=${refresh}`)) return json(null, 401);
    access = randomUUID(); refresh = randomUUID(); refreshes++;
    return json(user, 200, sessionCookies());
  }
  if (path === '/api/v1/auth/logout') {
    active = false;
    return json(null, 200, sessionCookies().map(value => value.replace(/=[^;]*/, '=') + '; Max-Age=0'));
  }
  if (path === '/api/v1/auth/me') return active && cookie.includes(`__Host-lm_access_token=${access}`) ? json(user) : json(null, 401);
  if (path === '/api/v1/branding') return json({ logoUrl: null });
  if (path === '/api/v1/cms/public/settings') return json({});
  if (path.includes('/cms/public/')) return json([]);
  if (!active || !cookie.includes(`__Host-lm_access_token=${access}`)) return json(null, 401);
  if (path === '/api/v1/crm/dashboard') return json({ metrics: {}, monthly: [], bySource: [], byProgram: [], byStage: [], counsellors: [], conversionRate: 0, conversionDefinition: 'Local fixture' });
  if (path === '/api/v1/reports/dashboard') return json({ collectedThisMonth: '0', outstandingFees: '0', pendingFees: 0, events: 0 });
  return json([]);
} });

async function freePort() {
  const server = createServer(); server.listen(0, '127.0.0.1'); await once(server, 'listening');
  const port = server.address().port; server.close(); await once(server, 'close'); return port;
}
const frontPort = await freePort(), chromePort = await freePort(), base = `http://localhost:${frontPort}`;
const profile = await mkdtemp(join(tmpdir(), 'mahilam-auth-proxy-'));
function send(method, params = {}) {
  return new Promise((resolve, reject) => { const id = ++sequence; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); });
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
async function waitFor(check, label, timeout = 60000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) { if (await check()) return; await Bun.sleep(100); }
  throw new Error(`Timed out: ${label}\n${logs.slice(-1500)}`);
}
async function dashboard() {
  await waitFor(async () => await evaluate("location.pathname === '/crm' && !!document.querySelector('[aria-label=\"Sign out\"]') && document.body.innerText.includes('Total enquiries')"), 'CRM remains signed in');
}
try {
  next = spawn(process.execPath, ['--bun', join(root, 'node_modules/next/dist/bin/next'), production ? 'start' : 'dev', ...(!production ? ['--webpack'] : []), '--hostname', 'localhost', '--port', String(frontPort)], {
    windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, NODE_ENV: production ? 'production' : 'development', API_URL_INTERNAL: `${fixture.url.origin}/api/v1`, NEXT_PUBLIC_API_URL: 'https://unused-backend.example.test/api/v1', NEXT_TELEMETRY_DISABLED: '1' },
  });
  for (const stream of [next.stdout, next.stderr]) stream.on('data', chunk => { logs += chunk; });
  await waitFor(async () => { try { return (await fetch(base + '/icon.svg')).ok; } catch { return false; } }, 'Next.js server starts');
  console.log('Production proxy server ready.');
  chrome = spawn(process.env.CRM_CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', `--remote-debugging-port=${chromePort}`, `--user-data-dir=${profile}`, 'about:blank',
  ], { windowsHide: true, stdio: 'ignore' });
  let target;
  await waitFor(async () => { try { target = (await (await fetch(`http://127.0.0.1:${chromePort}/json`)).json()).find(value => value.type === 'page'); return !!target; } catch { return false; } }, 'Chrome starts');
  ws = new WebSocket(target.webSocketDebuggerUrl); await once(ws, 'open');
  ws.addEventListener('message', event => {
    const message = JSON.parse(String(event.data));
    if (message.id) { const call = pending.get(message.id); pending.delete(message.id); message.error ? call?.reject(new Error(JSON.stringify(message.error))) : call?.resolve(message.result); }
    if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.text);
    if (message.method === 'Network.requestWillBeSent' && new URL(message.params.request.url).pathname.startsWith('/api/v1/')) browserApiCalls.push(message.params.request.url);
  });
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
  await send('Page.navigate', { url: base + '/login?reason=expired' });
  // SSR inputs exist before React attaches the form handler. Wait for hydration
  // so requestSubmit exercises the application rather than a native page submit.
  await waitFor(async () => await evaluate("(() => { const form = document.querySelector('input[type=password]')?.form; return document.readyState === 'complete' && !!form && Object.keys(form).some(key => key.startsWith('__reactProps$') && typeof form[key]?.onSubmit === 'function'); })()"), 'Hydrated login form');
  console.log('Browser login form ready.');
  for (const [type, value] of [['email', user.email], ['password', 'Fixture-only-123']]) {
    await evaluate(`(() => { const input = document.querySelector('input[type=${type}]'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, ${JSON.stringify(value)}); input.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  }
  await evaluate("document.querySelector('input[type=password]').form.requestSubmit()");
  await dashboard();
  console.log('Browser entered the CRM.');
  const { cookies } = await send('Network.getCookies', { urls: [base] });
  const session = cookies.filter(cookie => cookie.name.startsWith('__Host-lm_'));
  assert.equal(session.length, 2, 'Both upstream cookies reach the browser');
  assert.ok(session.every(cookie => cookie.domain === 'localhost' && cookie.secure && cookie.httpOnly && cookie.sameSite === 'Lax'), 'Cookies remain secure, HTTP-only and first-party');
  assert.ok(!(await evaluate('document.cookie')).includes('lm_access_token'), 'JavaScript cannot read the session');
  await send('Page.reload'); await dashboard();
  access = 'expired-fixture-access';
  await send('Page.reload');
  await waitFor(async () => refreshes === 1, 'Expired access session refreshes through proxy');
  await dashboard();
  await evaluate("document.querySelector('[aria-label=\"Sign out\"]').click()");
  await waitFor(async () => await evaluate("location.pathname === '/login' && !!document.querySelector('input[type=password]')"), 'Logout returns to login');
  assert.equal((await send('Network.getCookies', { urls: [base] })).cookies.filter(cookie => cookie.name.startsWith('__Host-lm_')).length, 0, 'Logout clears both cookies');
  assert.ok(browserApiCalls.length > 0 && browserApiCalls.every(url => new URL(url).origin === base), 'All browser API traffic stays on the frontend origin');
  assert.ok(apiCalls.some(call => call.path === '/api/v1/auth/login'), 'Login reaches the real Next.js rewrite upstream');
  assert.equal(exceptions.length, 0, 'No browser JavaScript exceptions');
  console.log(`PASS (${production ? 'production' : 'development'}): real Next.js proxy login, secure first-party cookies, CRM navigation, reload, refresh and logout. No school database or live credentials used.`);
} catch (error) {
  console.error(JSON.stringify({ apiCalls, browserApiCalls, exceptions }));
  if (ws?.readyState === WebSocket.OPEN) {
    console.error(await evaluate("JSON.stringify({path:location.pathname,body:document.body.innerText.slice(-1800)})").catch(() => 'Browser unavailable'));
    const result = await send('Network.getCookies', { urls: [base] }).catch(() => ({ cookies: [] }));
    console.error('Session cookie flags:', result.cookies.map(({name,domain,secure,httpOnly,sameSite}) => ({name,domain,secure,httpOnly,sameSite})));
  }
  throw error;
} finally {
  if (ws?.readyState === WebSocket.OPEN) { await send('Browser.close').catch(() => {}); ws.close(); }
  if (chrome && chrome.exitCode === null) chrome.kill();
  if (next && next.exitCode === null) next.kill();
  fixture.stop(true);
}
