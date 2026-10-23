import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";
import { join } from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { PAGE_SECTIONS, contentKey } from "../src/lib/page-content.ts";

const root = process.cwd();
const temp = join(process.env.TEMP || "/tmp", `mahilam-content-${randomUUID()}`);
await mkdir(temp, { recursive: true });
const settings = new Map();
const errors = [];
const report = { api: "local fixture only; no school database or cloud writes", checks: [], cases: [], findings: [] };
let next, chrome, ws, failSaves = false, uploads = 0, uploadRequest = false;
let frontBase, currentRoute;
const json = (data, status = 200) => new Response(JSON.stringify({ success: status < 400, data, ...(status >= 400 ? { message: "Fixture save failed" } : {}) }), { status, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": frontBase || "*", "Access-Control-Allow-Credentials": "true", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "GET,POST,OPTIONS" } });
const image = await readFile(join(root, "public/imgs/home/kid1.jpg"));
async function respond(path, method, body = "") {
  if (method === "OPTIONS") return json(null);
  if (path === "/api/v1/auth/me" && currentRoute === "/login") return json(null, 401);
  if (path === "/api/v1/auth/me") return json({ id: "fixture-admin", name: "Fixture Editor", email: "cms@example.test", role: "ADMIN" });
  if (path === "/api/v1/cms/settings" && method === "POST") {
    if (failSaves) return json(null, 500);
    const row = JSON.parse(body);
    settings.set(row.key, row.value);
    return json(row);
  }
  if (path === "/api/v1/cms/settings") return json([...settings].map(([key, value]) => ({ key, value })));
  if (path === "/api/v1/cms/public/settings") return json(Object.fromEntries(settings));
  if (path === "/api/v1/integrations/uploads/image") {
    uploadRequest = body.includes('name="file"') && body.includes("campus.png");
    await Bun.sleep(900);
    return json({ url: `${fixture.url.origin}/fixture-photo-${++uploads}.jpg` });
  }
  if (path === "/api/v1/cms/public/testimonials") return json([{ id: "review", parentName: "Fixture Parent", testimonial: "A cheerful school for our child.", rating: 5 }]);
  if (path === "/api/v1/cms/public/home") return json({ announcements: [] });
  if (path === "/api/v1/branding") return json(null);
  return json([]);
}
const fixture = Bun.serve({ hostname: "127.0.0.1", port: 0, async fetch(request) {
  const path = new URL(request.url).pathname;
  if (path.startsWith("/fixture-photo-")) return new Response(image, { headers: { "Content-Type": "image/jpeg" } });
  return respond(path, request.method, request.method === "POST" ? await request.text() : "");
} });
async function port() { const server = createServer(); server.listen(0, "127.0.0.1"); await once(server, "listening"); const port = server.address().port; server.close(); await once(server, "close"); return port; }
const frontPort = await port(), chromePort = await port();
frontBase = `http://127.0.0.1:${frontPort}`;
const pending = new Map(); let id = 0;
const send = (method, params = {}) => new Promise((resolve, reject) => { const key=++id; const timer=setTimeout(()=>{pending.delete(key);reject(Error("CDP timeout: "+method));},15000); pending.set(key,{resolve:(v)=>{clearTimeout(timer);resolve(v);},reject:(e)=>{clearTimeout(timer);reject(e);}});ws.send(JSON.stringify({id:key,method,params})); });
async function evaluate(expression) { const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true }); if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails)); return result.result.value; }
async function waitFor(expression, label, timeout = 20000) { const until = Date.now() + timeout; while (Date.now() < until) { if (await evaluate(expression)) return; await Bun.sleep(100); } throw Error(`Timeout: ${label}: ${await evaluate("document.body.innerText.slice(-800)")}`); }
async function navigate(path) { currentRoute=path; await send("Page.navigate", { url: frontBase + path }); await waitFor(`location.pathname===${JSON.stringify(path)} && document.readyState!=='loading'`, "document"); await evaluate("Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,2000))]).then(()=>true)"); }
const formExpr = title => `[...document.querySelectorAll('form')].find(f=>f.querySelector('h2')?.textContent===${JSON.stringify(title)})`;
async function fill(title, selector, value) { await evaluate(`(()=>{const input=(${formExpr(title)}).querySelector(${JSON.stringify(selector)}); if(!input) throw Error("Missing field "+${JSON.stringify(title + ": " + selector)}); Object.getOwnPropertyDescriptor(input instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype,'value').set.call(input,${JSON.stringify(value)});input.dispatchEvent(new Event('input',{bubbles:true}));})()`); }
async function click(title, text) { await evaluate(`([...(${formExpr(title)}).querySelectorAll('button')].find(b=>b.textContent.trim()===${JSON.stringify(text)})).click()`); }
async function ready(title) { await waitFor(`!!(${formExpr(title)})`, title); }
async function screenshot(name) { const result = await send("Page.captureScreenshot", { format: "png" }); await writeFile(join(temp, name + ".png"), Buffer.from(result.data, "base64")); }
try {
  next = spawn(process.execPath, ["--bun", join(root, "node_modules/next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", String(frontPort)], { windowsHide: true, stdio: "ignore", env: { ...process.env, NODE_ENV: "production", API_URL_INTERNAL: `${fixture.url.origin}/api/v1` } });
  let started = false;
  for (let attempt = 0; attempt < 100; attempt++) { try { if ((await fetch(frontBase + "/icon.svg")).ok) { started = true; break; } } catch {} await Bun.sleep(100); }
  assert.ok(started, "Production server starts");
  chrome = spawn(process.env.CRM_CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", ["--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", `--remote-debugging-port=${chromePort}`, `--user-data-dir=${join(temp, "profile")}`, "about:blank"], { windowsHide: true, stdio: "ignore" });
  let targets;
  for (let attempt = 0; attempt < 100; attempt++) { try { targets = await (await fetch(`http://127.0.0.1:${chromePort}/json`)).json(); if (targets.some(t => t.type === "page")) break; } catch {} await Bun.sleep(100); }
  ws = new WebSocket(targets.find(t => t.type === "page").webSocketDebuggerUrl);
  await once(ws, "open");
  ws.addEventListener("message", async event => {
    const message = JSON.parse(String(event.data));
    if (message.id) { const call = pending.get(message.id); pending.delete(message.id); if (message.error) call?.reject(Error(JSON.stringify(message.error))); else call?.resolve(message.result); }
    if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails.text);
    if (message.method === "Fetch.requestPaused") {
      const { requestId, request } = message.params;
      try {
        const path = new URL(request.url).pathname;
        if (!path.startsWith("/api/v1/")) { await send("Fetch.continueRequest", { requestId }); return; }
        const response = await respond(path, request.method, request.postData || "");
        await send("Fetch.fulfillRequest", { requestId, responseCode: response.status, responseHeaders: [...response.headers].map(([name, value]) => ({ name, value })), body: Buffer.from(await response.text()).toString("base64") });
      } catch (error) { errors.push(error.message); await send("Fetch.failRequest", { requestId, errorReason: "Failed" }); }
    }
  });
  await send("Page.enable"); await send("Runtime.enable");
  await send("Fetch.enable", { patterns: [{ urlPattern: "*://*/api/v1/*" }] });

  await send("Emulation.setEmulatedMedia", { features: [{name:"prefers-reduced-motion",value:"reduce"}] });
  const publicRoutes=["/","/about","/programs","/learning-approach","/activities","/facilities","/gallery","/events","/admissions","/contact","/faq","/blog","/preschool-in-tiruppur","/privacy-policy","/login"];
  const cmsRoutes=["/admin/home","/admin/about","/admin/photos","/admin/learning-approach"];
  const widths=(process.env.RESPONSIVE_WIDTHS||"320,360,375,390,414,600,640,768,820,912,1024,1280,1440,1536,1920,2560").split(",").map(Number);
  const snapshot=String.raw`(()=>{
    const width=innerWidth;
    const visible=e=>e.checkVisibility({checkOpacity:true,checkVisibilityCSS:true}) && !e.closest('[aria-hidden="true"],[inert],.sr-only') && e.getBoundingClientRect().width>0;
    const describe=e=>({tag:e.tagName,text:(e.innerText||e.getAttribute('aria-label')||e.name||'').slice(0,85),class:typeof e.className==='string'?e.className.slice(0,200):''});
    const scrollContainer=e=>{for(let p=e.parentElement;p&&p!==document.body;p=p.parentElement){const s=getComputedStyle(p);if(/auto|scroll/.test(s.overflowX)&&p.scrollWidth>p.clientWidth+2)return true;}return false;};
    const offscreen=[...document.querySelectorAll('main h1,main h2,main h3,main p,main label,main summary,main button,main a,main input:not([type=hidden]),main select,main textarea,header a,header button,footer input,footer button')].filter(visible).filter(e=>!scrollContainer(e)).filter(e=>{const r=e.getBoundingClientRect();return r.right>width+2||r.left < -2;}).map(describe).slice(0,18);
    // Transformed decorative icons and cropped photographs can extend scrollWidth.
    // Only flag text that actually crosses its control's content box.
    const overflowingText=e=>{
      if(e.matches('input,select,textarea'))return true;
      const box=e.getBoundingClientRect(),walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);
      while(walker.nextNode()){
        const node=walker.currentNode;
        if(!node.textContent.trim()||node.parentElement.closest('[aria-hidden="true"],svg,.shrink-0'))continue;
        const range=document.createRange();range.selectNodeContents(node);
        if([...range.getClientRects()].some(r=>r.left<box.left-2||r.right>box.right+2))return true;
      }
      return false;
    };
    const clipped=[...document.querySelectorAll('h1,h2,h3,button,summary,.input')].filter(visible).filter(e=>!e.classList.contains('truncate')&&!e.closest('.truncate')).filter(e=>e.scrollWidth>e.clientWidth+3&&getComputedStyle(e).overflowX!=='auto'&&overflowingText(e)).map(e=>({...describe(e),width:e.clientWidth,scroll:e.scrollWidth})).slice(0,14);
    const inputs=[...document.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=file]),select,textarea')].filter(visible).map(e=>({font:Number.parseFloat(getComputedStyle(e).fontSize),...describe(e)}));
    return {width,pageWidth:document.documentElement.scrollWidth,offscreen,clipped,inputFonts:[...new Set(inputs.map(e=>e.font))],heading:document.querySelector('h1')?.textContent};
  })()`;
  for(const width of process.env.RESPONSIVE_INTERACTIONS_ONLY ? [] : widths){
    const height=width<600?844:width<1024?1024:900;
    await send("Emulation.setDeviceMetricsOverride",{width,height,deviceScaleFactor:1,mobile:width<1024});
    await send("Emulation.setTouchEmulationEnabled",{enabled:width<1024});
    for(const route of [...publicRoutes,...cmsRoutes]){
      await navigate(route);
      if(route.startsWith('/admin')) await ready(route.endsWith('home')?'Hero (default slide)':route.endsWith('about')?'About hero':route.endsWith('learning-approach')?'Learning approach':'Home page');
      else if(route==='/login')await waitFor("!!document.querySelector('input[type=email]')",'login form');
      else await waitFor("Object.keys(document.querySelector('header a')||{}).some(k=>k.startsWith('__reactProps$'))",'hydrated public layout');
      const samples=[];
      for(const position of [0,.5,1]){
        await evaluate(`window.scrollTo(0,(document.documentElement.scrollHeight-innerHeight)*${position})`);
        await Bun.sleep(35);
        samples.push(await evaluate(snapshot));
      }
      const issues=new Map();
      for(const result of samples){
        if(result.pageWidth>width+1)issues.set('page-overflow',{type:'page-overflow',pageWidth:result.pageWidth});
        for(const problem of result.offscreen)issues.set('offscreen:'+problem.tag+problem.text,{type:'offscreen',...problem});
        for(const problem of result.clipped)issues.set('clipped:'+problem.tag+problem.text,{type:'clipped',...problem});
      }
      const result={route,width,height,heading:samples[0].heading,inputFonts:samples[0].inputFonts,issues:[...issues.values()]};
      report.cases.push(result);
      await writeFile(join(root,'docs/responsive-verification.json'),JSON.stringify(report,null,2));
      if(result.issues.length){report.findings.push(result);console.log('Finding '+width+' '+route+': '+JSON.stringify(result.issues));}
    }
    console.log('Checked '+width+'px: '+publicRoutes.length+' public and '+cmsRoutes.length+' CMS pages');
  }
  const check=(label,details,passed)=>{report.checks.push({label,...details,passed});if(!passed)report.findings.push({label,...details});console.log((passed?'Passed ':'Finding ')+label+' '+JSON.stringify(details));};
  for(const [width,height] of [[320,568],[390,844],[844,390],[768,1024],[1024,768],[1280,720]]){
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<1280});
    await send('Emulation.setTouchEmulationEnabled',{enabled:width<1280});
    await navigate('/login');
    await waitFor("!!document.querySelector('input[type=email]')",'login form');
    const login=await evaluate(`(()=>{window.scrollTo(0,0);const top=document.querySelector('main section > div.relative.z-10').getBoundingClientRect().top;const b=document.querySelector('button[type=submit]');b.scrollIntoView({block:'center'});const r=b.getBoundingClientRect();return {top,submitTop:r.top,submitBottom:r.bottom,scrollHeight:document.documentElement.scrollHeight,overflow:document.documentElement.scrollWidth>innerWidth+1};})()`);
    check('Login reachable',{width,height,...login},login.top>=0&&login.submitTop>=0&&login.submitBottom<=height&&!login.overflow);
    if(width<1280){
      await navigate('/');
      await waitFor("Object.keys(document.querySelector('button[aria-label=\"Open menu\"]')||{}).some(k=>k.startsWith('__reactProps$'))",'hydrated menu opener');
      await evaluate("document.querySelector('button[aria-label=\"Open menu\"]').click()");
      await waitFor("document.querySelector('#kids-drawer')?.getAttribute('inert')===null",'open drawer');
      const menu=await evaluate(`(()=>{const d=document.querySelector('#kids-drawer'),n=d.querySelector('nav'),r=n.getBoundingClientRect();n.scrollTop=n.scrollHeight;const a=n.querySelector('li:last-child a').getBoundingClientRect();return {navHeight:r.height,lastLinkTop:a.top,lastLinkBottom:a.bottom,navBottom:r.bottom,locked:document.documentElement.style.overflow==='hidden'};})()`);
      check('Menu scrollable',{width,height,...menu},menu.navHeight>=140&&menu.lastLinkBottom<=menu.navBottom+1&&menu.lastLinkTop>=0&&menu.locked);
      await screenshot(`responsive-menu-${width}-${height}`);
      await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});
      await waitFor("document.querySelector('#kids-drawer').hasAttribute('inert')",'drawer closes');
      check('Menu Escape restores focus',{width,height},await evaluate("document.activeElement?.getAttribute('aria-label')==='Open menu' && document.documentElement.style.overflow!=='hidden'"));
    }
    for(const route of ['/gallery','/activities']){
      await navigate(route);
      await waitFor("Object.keys(document.querySelector('button[aria-label^=\"Open photo:\"]')||{}).some(k=>k.startsWith('__reactProps$'))",'hydrated photo opener');
      await evaluate("document.querySelector('button[aria-label^=\"Open photo:\"]').click()");
      await waitFor("!!document.querySelector('[role=dialog][aria-label$=\"photo viewer\" i]')",'photo dialog');
      await waitFor("document.querySelector('[role=dialog][aria-label$=\"photo viewer\" i] img')?.naturalWidth>0",'viewer image loaded');
      const viewer=await evaluate(`(()=>{const d=document.querySelector('[role=dialog][aria-label$="photo viewer" i]'),f=d.querySelector('figure'),c=f.querySelector('figcaption'),i=f.querySelector('img');const a=f.getBoundingClientRect(),b=c.getBoundingClientRect(),p=i.getBoundingClientRect();return {left:a.left,right:a.right,top:a.top,bottom:a.bottom,captionTop:b.top,captionBottom:b.bottom,imageBottom:p.bottom};})()`);
      check('Photo viewer fits',{route,width,height,...viewer},viewer.left>=0&&viewer.right<=width&&viewer.top>=0&&viewer.bottom<=height&&viewer.captionBottom<=height&&viewer.captionTop>=viewer.imageBottom-1);
      if(route==='/gallery')await screenshot(`responsive-viewer-${width}-${height}`);
      await send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight'});
      await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});
      await waitFor("!document.querySelector('[role=dialog][aria-label$=\"photo viewer\" i]')",'viewer closes');
    }
    await navigate('/admin/photos');
    await ready('Home page');
    const fonts=await evaluate("[...document.querySelectorAll('main .input')].filter(e=>e.checkVisibility()).map(e=>parseFloat(getComputedStyle(e).fontSize))");
    check('CMS touch fields readable',{width,height,fonts:[...new Set(fonts)]},width>=1280||fonts.every(font=>font>=16));
    if(width<1024){
      await evaluate("document.querySelector('button[aria-label=\"Open navigation\"]').click()");
      await waitFor("[...document.querySelectorAll('aside')].some(e=>e.checkVisibility())",'CMS drawer');
      const drawer=await evaluate(`(()=>{const d=[...document.querySelectorAll('aside')].find(e=>e.checkVisibility()),n=d.querySelector('nav');n.scrollTop=n.scrollHeight;const r=n.getBoundingClientRect(),a=n.querySelector('a:last-child').getBoundingClientRect();return {left:d.getBoundingClientRect().left,right:d.getBoundingClientRect().right,navHeight:r.height,lastBottom:a.bottom,navBottom:r.bottom};})()`);
      check('CMS navigation fits',{width,height,...drawer},drawer.left>=0&&drawer.right<=width&&drawer.navHeight>=140&&drawer.lastBottom<=drawer.navBottom+1);
      await evaluate("[...document.querySelectorAll('button[aria-label=\"Close navigation\"]')].at(-1).click()");
    }
  }
  report.screenshots=temp;
  report.status=report.findings.length||errors.length?'findings':'passed';
  report.runtimeErrors=errors;
  if(report.status!=='passed')process.exitCode=1;
  console.log(JSON.stringify({status:report.status,cases:report.cases.length,findings:report.findings.length,runtimeErrors:errors.length}));
}catch(error){report.status='failed';report.error=error.message;process.exitCode=1;console.error(error);}
finally{
  await writeFile(join(root,'docs/responsive-verification.json'),JSON.stringify(report,null,2));
  if(ws){await send('Browser.close').catch(()=>{});ws.close();}if(chrome&&chrome.exitCode===null)chrome.kill();if(next&&next.exitCode===null)next.kill();fixture.stop(true);
}
