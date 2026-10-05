import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require('playwright');
const publicRoot=path.resolve('public'), slug=process.argv[2];
if(!/^[a-z0-9][a-z0-9-]{0,100}$/.test(slug||''))throw Error('Supply one valid prospect slug.');
const dir=path.join(publicRoot,'preview',slug), pagePath='/preview/'+slug+'/index.html';
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const html=await fs.readFile(path.join(dir,'index.html'));
const status=JSON.parse(await fs.readFile(path.join(dir,'status.json'),'utf8'));
if(status.status!=='PREVIEW_READY'||status.slug!==slug||status.contentHash!==hash(html))throw Error('Preview is not validated.');
const browser=await chromium.launch({headless:true});
try {
 const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1,javaScriptEnabled:false,serviceWorkers:'block'});
 const origin='https://factory-preview.invalid';
 await context.route('**/*',async route=>{
  const url=new URL(route.request().url());
  if(url.origin!==origin)return route.abort();
  let pathname;try{pathname=decodeURIComponent(url.pathname);}catch{return route.abort();}
  const file=path.resolve(publicRoot,'.'+pathname);
  if(!file.startsWith(publicRoot+path.sep))return route.abort();
  try {
   const real=await fs.realpath(file);
   if(!real.startsWith(publicRoot+path.sep))return route.abort();
   const content=await fs.readFile(real),ext=path.extname(file);
   const types={'.html':'text/html','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2'};
   await route.fulfill({status:200,contentType:types[ext]||'application/octet-stream',body:content});
  }catch{await route.fulfill({status:404,body:'Missing local asset'});}
 });
 const page=await context.newPage();
 await page.goto(origin+pagePath,{waitUntil:'load',timeout:30000});
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all(Array.from(document.images).map(i=>i.decode().catch(()=>{})));});
 const broken=await page.evaluate(()=>Array.from(document.images).filter(i=>i.getBoundingClientRect().top<1000 && (!i.complete||!i.naturalWidth)).length);
 if(broken)throw Error('Visible images are missing; screenshot not published.');
 if(!/Concept by Parley Systems/i.test(await page.locator('body').innerText()))throw Error('Concept label missing.');
 const image=await page.screenshot({type:'jpeg',quality:85,fullPage:false,animations:'disabled'});
 if(image.length<1000||image.length>2000000)throw Error('Screenshot outside email size bounds.');
 if(hash(await fs.readFile(path.join(dir,'index.html')))!==status.contentHash)throw Error('Page changed during capture.');
 const manifest={schemaVersion:1,slug,contentHash:status.contentHash,imagePath:'/preview/'+slug+'/landing.jpg',imageHash:hash(image),viewport:{width:1440,height:1000},capturedAt:new Date().toISOString()};
 await fs.writeFile(path.join(dir,'landing.jpg'),image);
 await fs.writeFile(path.join(dir,'screenshot.json'),JSON.stringify(manifest,null,2)+'\n');
 console.log('SCREENSHOT_READY '+slug);
} finally {await browser.close();}
