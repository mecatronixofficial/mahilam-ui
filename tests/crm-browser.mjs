import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";
import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

const frontend=process.cwd(), backend=process.env.CRM_BACKEND_ROOT || resolve(frontend,"../../Server/mahilam-server");
const db=new URL(process.env.CRM_BROWSER_DATABASE_URL || "http://missing.invalid");
assert.ok(["localhost","127.0.0.1","[::1]"].includes(db.hostname),"Explicit local disposable database required");
assert.match(db.pathname,/^\/mahilam_crm_test_[a-zA-Z0-9_]+$/);
process.env.DATABASE_URL=db.href; process.env.NODE_ENV="development";
process.env.JWT_ACCESS_SECRET=randomUUID()+randomUUID();process.env.JWT_REFRESH_SECRET=randomUUID()+randomUUID();
Object.assign(process.env,{DISABLE_CRON:"true",RATE_LIMIT_MAX:"10000",RESEND_API_KEY:"",WHATSAPP_ACCESS_TOKEN:"",R2_ACCESS_KEY_ID:"",R2_SECRET_ACCESS_KEY:""});
const imp=p=>import(pathToFileURL(join(backend,p)).href);
await imp("node_modules/reflect-metadata/Reflect.js");
const {PrismaClient}=await imp("dist/generated/prisma/client.js");
const {PrismaPg}=await imp("node_modules/@prisma/adapter-pg/dist/index.mjs");
const bcrypt=(await imp("node_modules/bcrypt/bcrypt.js")).default;
const prisma=new PrismaClient({adapter:new PrismaPg({connectionString:db.href})});
const report={checkedAt:new Date().toISOString(),database:"disposable-local-postgresql",api:"real NestJS with Prisma",browser:"Chrome headless CDP",checks:[],viewports:[],apiFailures:[],exceptions:[]};
const temp=join(process.env.TEMP || "/tmp","mahilam-crm-browser-"+randomUUID());
await mkdir(temp,{recursive:true});
async function port(){const s=createServer();s.listen(0,"127.0.0.1");await once(s,"listening");const p=s.address().port;s.close();await once(s,"close");return p;}
const frontPort=await port(), chromePort=await port(), apiPort=await port();
const base="http://127.0.0.1:"+frontPort, localApi="http://127.0.0.1:"+apiPort;
process.env.FRONTEND_URL=base;
let app,next,chrome,ws;let id=0;const pending=new Map(),cookies=new Map();let failStages=false,failTasks=false;
const send=(method,params={})=>new Promise((resolve,reject)=>{const key=++id;pending.set(key,{resolve,reject});ws.send(JSON.stringify({id:key,method,params}));});
async function evaluate(expression){const r=await send("Runtime.evaluate",{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
async function waitFor(expression,label,timeout=20000){const end=Date.now()+timeout;while(Date.now()<end){try{if(await evaluate(expression))return;}catch{}await Bun.sleep(100);}throw Error("Browser timeout: "+label+"; "+await evaluate("document.body.innerText.slice(-700)"));}
async function navigate(path){await send("Page.navigate",{url:base+path});await waitFor("document.readyState==='complete'","document");await Bun.sleep(750);}
async function click(text){await evaluate("(()=>{const e=[...document.querySelectorAll('button')].find(e=>e.textContent.trim()==="+JSON.stringify(text)+");if(!e)throw Error('Missing button '+ "+JSON.stringify(text)+");e.click()})()");}
async function fill(selector,value){await evaluate("(()=>{const e=document.querySelector("+JSON.stringify(selector)+");if(!e)throw Error('Missing field');Object.getOwnPropertyDescriptor(e instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:e instanceof HTMLSelectElement?HTMLSelectElement.prototype:HTMLInputElement.prototype,'value').set.call(e,"+JSON.stringify(value)+");e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));})()");}
async function labelFill(label,value){const selector=await evaluate("(()=>{const l=[...document.querySelectorAll('[role=dialog] label')].find(e=>e.textContent.trim().startsWith("+JSON.stringify(label)+"));const e=l?.querySelector('input,select,textarea');if(!e)throw Error('Missing label');e.setAttribute('data-crm-test-field','active');return '[data-crm-test-field=active]'})()");await fill(selector,value);await evaluate("document.querySelector('[data-crm-test-field=active]').removeAttribute('data-crm-test-field')");}
async function shot(name){const r=await send("Page.captureScreenshot",{format:"png"});await writeFile(join(temp,name+".png"),Buffer.from(r.data,"base64"));}
async function login(email,password){cookies.clear();await navigate("/login?reason=expired");await waitFor("!!document.querySelector('input[type=email]')","login fields");await fill("input[type=email]",email);await fill("input[type=password]",password);await evaluate("document.querySelector('input[type=password]').form.requestSubmit()");}
async function layout(path,width){await send("Emulation.setDeviceMetricsOverride",{width,height:900,deviceScaleFactor:1,mobile:width<768});await navigate(path);await waitFor("!!document.querySelector('main') && !document.body.innerText.includes('Checking your session')","workspace");await Bun.sleep(500);const data=await evaluate("({width:innerWidth,pageWidth:document.documentElement.scrollWidth,heading:document.querySelector('h1')?.textContent,errors:[...document.querySelectorAll('[role=alert]')].map(e=>e.textContent)})");report.viewports.push({path,...data,width});if(data.pageWidth>width+1) { console.log("Overflow: "+path+" at "+width+": "+data.pageWidth); console.log(await evaluate("JSON.stringify([...document.querySelectorAll('main *')].filter(e=>e.scrollWidth>e.clientWidth+2&&getComputedStyle(e).overflowX==='visible').slice(0,18).map(e=>({tag:e.tagName,cls:typeof e.className==='string'?e.className:'svg',width:e.clientWidth,scroll:e.scrollWidth,text:e.innerText?.slice(0,70)})))")); await shot("overflow-"+width); }assert.ok(!data.errors.some(x=>/server had|couldn.t load|can.t reach/i.test(x)),path+" API error");}
try{
 await prisma.$connect();
 assert.ok(await prisma.academicYear.count(),"Use a migrated synthetic integration database");
 const childName="Browser Integration Child "+randomUUID().slice(0,8),taskTitle="Browser persisted task "+randomUUID().slice(0,8);
 const password="Browser-local-"+randomUUID()+"!9",passwordHash=await bcrypt.hash(password,12);
 const users={};
 for(const role of ["ADMIN","COUNSELLOR","ACCOUNTANT","TEACHER","CMS_EDITOR"]){users[role]=await prisma.user.create({data:{name:"Browser "+role,email:randomUUID()+"@example.test",role,passwordHash}});}
 const year=await prisma.academicYear.findFirst({where:{current:true}});
 await prisma.student.updateMany({data:{status:"ACTIVE",archivedAt:null}});
 await prisma.program.upsert({where:{slug:"browser-pre-kg"},create:{name:"Pre-KG",slug:"browser-pre-kg",active:true},update:{active:true}});
 const {Logger}=await imp("node_modules/@nestjs/common/index.js");Logger.overrideLogger(["error"]);
 const {createApp}=await imp("dist/app.factory.js");app=await createApp();await app.listen(apiPort,"127.0.0.1");
 next=spawn(process.execPath,["--bun",join(frontend,"node_modules/next/dist/bin/next"),"start","--hostname","127.0.0.1","--port",String(frontPort)],{cwd:frontend,windowsHide:true,stdio:"ignore",env:{...process.env,NODE_ENV:"production"}});
 for(let i=0;i<100;i++){try{if((await fetch(base+"/icon.svg")).ok)break;}catch{}await Bun.sleep(100);}
 const chromePath=process.env.CRM_CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
 chrome=spawn(chromePath,["--headless=new","--disable-gpu","--no-first-run","--no-default-browser-check","--remote-debugging-port="+chromePort,"--user-data-dir="+join(temp,"profile"),"about:blank"],{windowsHide:true,stdio:"ignore"});
 let targets;for(let i=0;i<80;i++){try{targets=await(await fetch("http://127.0.0.1:"+chromePort+"/json/list")).json();if(targets.length)break;}catch{}await Bun.sleep(100);}
 const target=targets.find(t=>t.type==="page");ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
 ws.onmessage=async event=>{const m=JSON.parse(event.data);if(m.id){const p=pending.get(m.id);if(p){pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}return;}
  if(m.method==="Runtime.exceptionThrown")report.exceptions.push(m.params.exceptionDetails.text);
  if(m.method!=="Fetch.requestPaused")return;
  const {request,requestId}=m.params;
  try{
   const incoming=new URL(request.url),path=incoming.pathname+incoming.search;
   if(!incoming.pathname.includes("/api/v1/")){await send("Fetch.continueRequest",{requestId});return;}
   let status=200,body=Buffer.alloc(0),headers=[{name:"Access-Control-Allow-Origin",value:base},{name:"Access-Control-Allow-Credentials",value:"true"},{name:"Access-Control-Allow-Headers",value:"content-type"},{name:"Access-Control-Allow-Methods",value:"GET,POST,PATCH,DELETE,PUT,OPTIONS"}];
   if(request.method!=="OPTIONS"){
    if(failStages && request.method==="PATCH" && /\/enquiries\/[^/]+\/stage/.test(path) || failTasks && path.startsWith("/api/v1/crm/tasks")){status=503;body=Buffer.from(JSON.stringify({message:"Intentional browser network failure"}));headers.push({name:"Content-Type",value:"application/json"});}
    else{
     const requestHeaders={};for(const[k,v]of Object.entries(request.headers)){if(["content-type","accept"].includes(k.toLowerCase()))requestHeaders[k]=v;}
     if(cookies.size)requestHeaders.Cookie=[...cookies].map(([k,v])=>k+"="+v).join("; ");
     const response=await fetch(localApi+path,{method:request.method,headers:requestHeaders,body:["GET","HEAD"].includes(request.method)?undefined:request.postData,redirect:"manual"});
     status=response.status;body=Buffer.from(await response.arrayBuffer());
     for(const entry of response.headers.getSetCookie()){const pair=entry.split(";")[0],at=pair.indexOf("=");cookies.set(pair.slice(0,at),pair.slice(at+1));}
     const contentType=response.headers.get("content-type");if(contentType)headers.push({name:"Content-Type",value:contentType});
     if(status>=400 && !path.includes("/auth/"))report.apiFailures.push({path,method:request.method,status,body:body.toString().slice(0,250)});
    }
   }
   await send("Fetch.fulfillRequest",{requestId,responseCode:status,responseHeaders:headers,body:body.toString("base64")});
  }catch(error){if(!error.message.includes("Invalid InterceptionId"))report.apiFailures.push({path:request.url,error:error.message});await send("Fetch.failRequest",{requestId,errorReason:"Failed"}).catch(()=>{});}
 };
 await send("Page.enable");await send("Runtime.enable");await send("Fetch.enable",{patterns:[{urlPattern:"*://*/api/v1/*",requestStage:"Request"}]});
 await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true});
 await navigate("/admissions");await waitFor("!!document.querySelector('#parentName')","public form");
 await fill("#parentName","Browser Integration Parent");await fill("#studentName",childName);await fill("#phone","9876501234");
 await evaluate("(()=>{const f=document.querySelector('#parentName').form;f.querySelector('input[type=checkbox]').click();f.requestSubmit()})()");
 await waitFor("document.body.innerText.includes('Thank you!')","public enquiry success");
 const lead=await prisma.enquiry.findFirst({where:{studentName:childName}});
 assert.ok(lead);assert.equal(lead.purpose,"ADMISSION");assert.equal(lead.status,"NEW_ENQUIRY");
 await prisma.enquiry.update({where:{id:lead.id},data:{assignedStaffId:users.COUNSELLOR.id,academicYearId:year.id}});
 report.checks.push("Public admission form saves an admission enquiry through real HTTP and PostgreSQL");
 await login(users.ADMIN.email,"wrong-password");
 await waitFor("document.body.innerText.includes('don\\'t match')","invalid login feedback");
 await fill("input[type=password]",password);await evaluate("document.querySelector('input[type=password]').form.requestSubmit()");
 await waitFor("location.pathname==='/crm' && document.body.innerText.includes('Total enquiries')","admin dashboard");
 report.checks.push("Invalid and successful login use actual password hashing, cookies and database sessions");
 if(!process.env.CRM_BROWSER_PUBLIC_ONLY) for(const width of [390,768,1440])for(const path of ["/crm","/crm/enquiries","/crm/pipeline","/crm/follow-ups","/crm/visits","/crm/admissions","/crm/students","/crm/guardians","/crm/academics","/crm/attendance","/crm/fees","/crm/tasks","/crm/communications","/crm/templates","/crm/reports","/crm/staff","/crm/settings","/crm/enquiries/"+lead.id].filter(path=>!process.env.CRM_BROWSER_DASHBOARD_ONLY || path==="/crm"))await layout(path,width);
 if(!process.env.CRM_BROWSER_DASHBOARD_ONLY) for(const width of [390,768,1440])for(const path of ["/","/about","/programs","/admissions","/contact"].filter(path=>!process.env.CRM_BROWSER_DASHBOARD_ONLY || path==="/crm"))await layout(path,width);
 const overflows=report.viewports.filter(v=>v.pageWidth>v.width+1);assert.equal(overflows.length,0,"Page overflow: "+JSON.stringify(overflows));
 if(process.env.CRM_BROWSER_PUBLIC_ONLY) { report.status="passed"; console.log("Public responsive checks passed"); }
 else {
 await layout("/crm",390);await shot("crm-mobile");await layout("/crm",1440);await shot("crm-desktop");
 await navigate("/crm/tasks");await click("New task");await labelFill("Title",taskTitle);await labelFill("Due at","2026-10-25T10:00");await labelFill("Linked enquiry",lead.id);await click("Save task");
 await waitFor("!document.querySelector('[role=dialog]') && document.body.innerText.includes('Browser persisted task')","task persistence");
 assert.equal(await prisma.crmTask.count({where:{title:taskTitle}}),1);
 await send("Page.reload");await waitFor("document.body.innerText.includes('Browser persisted task')","saved task after refresh");
 report.checks.push("Task create form persists real data and survives page refresh");
 await navigate("/crm/pipeline");const stageSelector='select[aria-label="Move '+childName+' to stage"]';await waitFor("!!document.querySelector("+JSON.stringify(stageSelector)+")","pipeline lead");
 failStages=true;await fill(stageSelector,"CONTACTED");await Bun.sleep(1400);
 assert.equal(await evaluate("document.querySelector("+JSON.stringify(stageSelector)+").value"),"NEW_ENQUIRY");
 assert.equal((await prisma.enquiry.findUnique({where:{id:lead.id}})).status,"NEW_ENQUIRY");
 failStages=false;await fill(stageSelector,"CONTACTED");await waitFor("document.querySelector("+JSON.stringify(stageSelector)+")?.value==='CONTACTED'","stage success");
 await send("Page.reload");await waitFor("document.querySelector("+JSON.stringify(stageSelector)+")?.value==='CONTACTED'","saved pipeline after refresh");
 assert.equal((await prisma.enquiry.findUnique({where:{id:lead.id}})).status,"CONTACTED");
 report.checks.push("Pipeline failed-request rollback and successful stage persistence after browser refresh");
 await navigate("/crm/follow-ups");await click("New follow-up");await labelFill("Enquiry",lead.id);await labelFill("Assigned staff",users.COUNSELLOR.id);
 assert.ok(await evaluate("document.querySelector('[role=dialog] input[type=datetime-local]').value"),"Configured follow-up default applied");
 await click("Save follow-up");await waitFor("!document.querySelector('[role=dialog]')","follow-up saved");
 assert.equal(await prisma.followUpTask.count({where:{enquiryId:lead.id}}),1);
 report.checks.push("Follow-up form applies configured default and saves assigned due date");
 for(const[role,start]of [["COUNSELLOR","/crm"],["ACCOUNTANT","/crm/fees"],["TEACHER","/crm/attendance"],["CMS_EDITOR","/admin"]]){
  await login(users[role].email,password);await waitFor("location.pathname==="+JSON.stringify(start)+" && !!document.querySelector('main')",role+" landing");await Bun.sleep(500);
  const endpoint=role==="CMS_EDITOR"?"/crm/dashboard":"/crm/settings";
  const status=await evaluate("fetch("+JSON.stringify("/api/v1"+endpoint)+",{credentials:'include'}).then(r=>r.status)");
  assert.equal(status,403,role+" forbidden API");
  if(role==="COUNSELLOR"){assert.equal(await evaluate("!!document.querySelector('aside a[href=\"/crm/fees\"]')"),false);}
 }
 report.checks.push("Counsellor, accountant, teacher and CMS editor login routing, navigation and forbidden API checks");
 assert.equal(report.exceptions.length,0,"No browser JavaScript exceptions");
 report.status="passed";console.log("CRM browser verification passed: "+report.viewports.length+" route/viewport checks");
 }
}catch(error){report.status="failed";report.error=error.message;if(ws)await shot("crm-failure").catch(()=>{});console.error(error);process.exitCode=1;}
finally{
 await mkdir(join(frontend,"docs"),{recursive:true});await writeFile(join(frontend,"docs/crm-browser-verification-2026-10-22.json"),JSON.stringify(report,null,2));console.log("Browser artifacts: "+temp);
 if(ws){await send("Browser.close").catch(()=>{});ws.close();}if(chrome && chrome.exitCode===null)chrome.kill();if(next && next.exitCode===null)next.kill();if(app)await app.close();await prisma.$disconnect();
}
