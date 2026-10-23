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
const report = { api: "isolated fixture, no school database or cloud writes", checks: [], viewports: [] };
let next, chrome, ws, failSaves = false, uploads = 0, uploadRequest = false;
let frontBase;
const json = (data, status = 200) => new Response(JSON.stringify({ success: status < 400, data, ...(status >= 400 ? { message: "Fixture save failed" } : {}) }), { status, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": frontBase || "*", "Access-Control-Allow-Credentials": "true", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "GET,POST,OPTIONS" } });
const image = await readFile(join(root, "public/imgs/home/kid1.jpg"));
async function respond(path, method, body = "") {
  if (method === "OPTIONS") return json(null);
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
const send = (method, params = {}) => new Promise((resolve, reject) => { const key = ++id; pending.set(key, { resolve, reject }); ws.send(JSON.stringify({ id: key, method, params })); });
async function evaluate(expression) { const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true }); if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails)); return result.result.value; }
async function waitFor(expression, label, timeout = 20000) { const until = Date.now() + timeout; while (Date.now() < until) { if (await evaluate(expression)) return; await Bun.sleep(100); } throw Error(`Timeout: ${label}: ${await evaluate("document.body.innerText.slice(-800)")}`); }
async function navigate(path) { await send("Page.navigate", { url: frontBase + path }); await waitFor("document.readyState==='complete'", "document"); }
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
  await navigate("/admin/about"); await ready("About hero");
  await fill("About hero", 'input[placeholder="Where little minds learn, play & shine!"]', "Our editable About page");
  await fill("Our story", 'input[placeholder="A happy beginning for every little learner."]', "Unsaved story draft");
  await evaluate(`(()=>{const input=(${formExpr("About hero")}).querySelector('input[type=file]');const transfer=new DataTransfer();transfer.items.add(new File([Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jPQAAAABJRU5ErkJggg=='),c=>c.charCodeAt(0))],'campus.png',{type:'image/png'}));input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  await waitFor(`(${formExpr("About hero")}).textContent.includes('Uploading photo')`, "upload in progress");
  assert.equal(await evaluate(`(${formExpr("About hero")}).querySelector('button.btn-primary').disabled`), true);
  await waitFor(`!!(${formExpr("About hero")}).querySelector('img[src*="fixture-photo-"]')`, "uploaded preview");
  assert.ok(uploadRequest, "Image upload uses multipart file field and original filename");
  await fill("About hero", `input[placeholder=${JSON.stringify(PAGE_SECTIONS.about[0].photos[0].alt)}]`, "Our uploaded school photo");
  await click("About hero", "Save section");
  await waitFor(`(${formExpr("About hero")}).querySelector('button.btn-primary').disabled && !(${formExpr("About hero")}).textContent.includes('Saving')`, "save complete");
  assert.equal(settings.get("public.page.about.hero").text.heading, "Our editable About page");
  assert.ok(settings.get("public.page.about.hero").images.main.url.includes("fixture-photo-1.jpg"));
  assert.equal(await evaluate(`(${formExpr("Our story")}).querySelector('input').value`), "Unsaved story draft");
  await navigate("/admin/about"); await ready("About hero");
  assert.equal(await evaluate(`(${formExpr("About hero")}).querySelector('input').value`), "Our editable About page");
  const publicHtml = await (await fetch(frontBase + "/about")).text();
  assert.ok(publicHtml.includes("Our editable About page") && publicHtml.includes('alt="Our uploaded school photo"'));
  failSaves = true;
  await fill("About hero", 'input[placeholder="Where little minds learn, play & shine!"]', "Retain this after save failure");
  await click("About hero", "Save section");
  await waitFor("document.body.innerText.includes('Fixture save failed')", "save failure feedback");
  assert.equal(await evaluate(`(${formExpr("About hero")}).querySelector('input').value`), "Retain this after save failure");
  assert.equal(settings.get("public.page.about.hero").text.heading, "Our editable About page");
  failSaves = false;
  await click("About hero", "Restore defaults"); await click("About hero", "Save section");
  await waitFor(`(${formExpr("About hero")}).querySelector('button.btn-primary').disabled && !(${formExpr("About hero")}).textContent.includes('Saving')`, "restore defaults save");
  assert.deepEqual(settings.get("public.page.about.hero"), { text: {}, images: {} });
  report.checks.push("Multipart upload, save lock during upload, publish, reload, public rendering, sibling draft preservation, save failure and restore defaults");
  await navigate("/admin/photos"); await ready("Home page");
  await evaluate(`(()=>{const input=(${formExpr("Home page")}).querySelector('input[type=file]');const transfer=new DataTransfer();transfer.items.add(new File([Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jPQAAAABJRU5ErkJggg=='),c=>c.charCodeAt(0))],'campus.png',{type:'image/png'}));input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  await waitFor(`!!(${formExpr("Home page")}).querySelector('img[src*="fixture-photo-2"]')`, "website photo upload preview");
  await fill("Home page", 'input[placeholder="Children listening together during a classroom circle activity"]', "Updated website hero photo");
  await click("Home page", "Save section");
  await waitFor(`(${formExpr("Home page")}).querySelector('button.btn-primary').disabled && !(${formExpr("Home page")}).textContent.includes('Saving')`, "website photo saved");
  assert.ok(settings.get("public.website.photos.home").images["home-hero"].url.includes("fixture-photo-2"));
  const updatedHome = await (await fetch(frontBase + "/")).text();
  assert.ok(updatedHome.includes('alt="Updated website hero photo"'));
  assert.ok(updatedHome.includes('src="'+fixture.url.origin+'/fixture-photo-2.jpg"'));
  await navigate("/admin/photos"); await ready("Home page");
  assert.ok(await evaluate(`!!(${formExpr("Home page")}).querySelector('img[src*="fixture-photo-2"]')`));
  await navigate("/admin/learning-approach"); await ready("Learning approach");
  report.checks.push("Website-wide photo upload, settings persistence, public image replacement and Learning Approach editor without a schema migration");

  // Every registered field and image must have a public rendering consumer.
  for (const page of ["home", "about"]) {
    for (const section of PAGE_SECTIONS[page]) settings.set(contentKey(page, section.id), {
      text: Object.fromEntries(section.fields.map(field => [field.key, `fixture-${page}-${section.id}-${field.key}`])),
      images: Object.fromEntries(section.photos.map(photo => [photo.key, { url: `${fixture.url.origin}/fixture-photo-${page}-${section.id}-${photo.key}.jpg`, alt: `fixture-alt-${page}-${section.id}-${photo.key}` }])),
    });
    const path = page === "home" ? "/" : "/about";
    const html = await (await fetch(frontBase + path)).text();
    for (const section of PAGE_SECTIONS[page]) {
      for (const field of section.fields) assert.ok(html.includes(`fixture-${page}-${section.id}-${field.key}`), `Public consumer: ${page}/${section.id}/${field.key}`);
      for (const photo of section.photos) assert.ok(html.includes(`alt="fixture-alt-${page}-${section.id}-${photo.key}"`), `Photo consumer: ${page}/${section.id}/${photo.key}`);
    }
    report.checks.push(`All ${page} section text and image slots render from public CMS settings`);
  }
  for (const width of [1440, 390]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
    for (const path of ["/admin/home", "/admin/about", "/admin/photos"]) {
      await navigate(path); await ready(path.endsWith("home") ? "Hero (default slide)" : path.endsWith("photos") ? "Home page" : "About hero");
      const layout = await evaluate("({width:innerWidth,pageWidth:document.documentElement.scrollWidth})");
      assert.ok(layout.pageWidth <= width + 1, `${path} fits ${width}px viewport`);
      report.viewports.push({ path, ...layout });
      await screenshot(`${path.endsWith("home") ? "home" : "about"}-${width}`);
    }
  }
  settings.clear();
  for (const width of [1440, 390]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
    for (const path of ["/", "/about", "/programs", "/learning-approach", "/activities", "/facilities", "/gallery", "/events", "/admissions", "/contact"]) {
      await navigate(path);
      await waitFor("!!document.querySelector('h1')", "public page heading");
      await Bun.sleep(200);
      const layout = await evaluate("({width:innerWidth,pageWidth:document.documentElement.scrollWidth,photos:document.querySelectorAll('img').length})");
      assert.ok(layout.pageWidth <= width+1, path+" fits "+width);
      report.viewports.push({path,...layout});
      if(path === "/" || path === "/gallery") {
        await Bun.sleep(1000);
        const name = (path === "/" ? "school-home-" : "school-gallery-")+width;
        const shot = await send("Page.captureScreenshot", {format:"png"});
        await writeFile(join(root,"docs",name+".png"),Buffer.from(shot.data,"base64"));
      }
    }
  }
  const galleryHtml = await (await fetch(frontBase+"/gallery")).text();
  for(const photo of JSON.parse(await readFile(join(root,"src/data/school-photos.json"),"utf8"))) assert.ok(galleryHtml.includes(photo.src),"Gallery includes "+photo.id);
  report.checks.push("All 60 supplied photos appear in the default gallery; ten public pages and three CMS pages fit desktop and mobile screens");
  assert.deepEqual(errors, [], "No browser runtime exceptions");
  report.status = "passed";
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  report.status = "failed"; report.error = error.message; process.exitCode = 1; console.error(error);
  if (ws) await screenshot("failure").catch(() => {});
} finally {
  await writeFile(join(root, "docs/page-content-browser-verification.json"), JSON.stringify(report, null, 2));
  console.log("Browser artifacts: " + temp);
  if (ws) { await send("Browser.close").catch(() => {}); ws.close(); }
  if (chrome && chrome.exitCode === null) chrome.kill();
  if (next && next.exitCode === null) next.kill();
  fixture.stop(true);
}


