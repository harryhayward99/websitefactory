import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {catalogue,loadSite,validateSite,renderSite,assessSite,shouldLaunchBuild,materialiseLibraryImages,generatePreview,instructionsVersion} from './factory.mjs';
const templates = await catalogue();
const example = await loadSite('fictional-clinic');
const pixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==','base64');
test('fictional draft renders escaped HTML with concept/noindex labels',async()=>{
  const site=structuredClone(example);site.business.name.value='<script>alert(1)</script>';
  const html=await renderSite(site,{allowDraft:true});
  assert.match(html,/noindex/);assert.match(html,/FICTIONAL DEMO/);
  assert.ok(!html.includes('<script>'));assert.match(html,/&lt;script&gt;/);
});
test('real prospect cannot bypass template approval using allowDraft',()=>{
  const draft=structuredClone(templates);draft[0].status='draft';
  const site=structuredClone(example);site.demo=false;
  site.sources=[{id:'fictional',url:'https://example.com',checkedAt:'2026-10-02'}];
  assert.throws(()=>validateSite(site,draft,{allowDraft:true}),/approved template/);
});
test('an approved clinic starter can preview a real prospect',async()=>{
  const site=structuredClone(example);site.demo=false;site.slug='example-practice';
  site.sources=[{id:'fictional',url:'https://example.com',checkedAt:'2026-10-02'}];
  site.approvedInstructionsVersion=await instructionsVersion();
  const tmp=await fs.mkdtemp(path.join(os.tmpdir(),'parley-pipeline-'));
  const result=await generatePreview(site,{outputFile:path.join(tmp,'index.html'),skipStatus:true,regenerate:true,instructionsVersion:site.approvedInstructionsVersion});
  assert.equal(result.code,'PREVIEW_READY');
  const html=await fs.readFile(path.join(tmp,'index.html'),'utf8');
  assert.match(html,/noindex/);assert.match(html,/Meadow Example Clinic/);
});
test('unknown template versions and path traversal are rejected',()=>{
  const site=structuredClone(example);site.template.version='9.0.0';
  assert.throws(()=>validateSite(site,templates,{allowDraft:true}),/missing or ambiguous/);
  site.slug='../secret';assert.throws(()=>validateSite(site,templates,{allowDraft:true}),/slug/);
});
test('unattributed business facts are rejected',()=>{
  const site=structuredClone(example);site.business.name.sourceId='unknown';
  assert.throws(()=>validateSite(site,templates,{allowDraft:true}),/sourceId/);
});
test('external or uncleared images cannot enter output',()=>{
  const site=structuredClone(example);site.assets.images=[{path:'https://example.com/image.jpg',alt:'test',sourceUrl:'https://example.com',rights:'owned'}];
  assert.throws(()=>validateSite(site,templates,{allowDraft:true}),/local raster/);
  site.assets.images[0].path='/factory-assets/test.jpg';site.assets.images[0].rights='unknown';
  assert.throws(()=>validateSite(site,templates,{allowDraft:true}),/Uncleared/);
});
test('illustrative copy is labelled next to the content',async()=>{
  const site=structuredClone(example);site.exampleSections=[{title:'Example section',body:'Suggested content for discussion.'}];
  assert.match(await renderSite(site,{allowDraft:true}),/ILLUSTRATIVE CONTENT — NOT A VERIFIED BUSINESS CLAIM/);
});
test('starter responds on a narrow viewport and labels bank images',async()=>{
  const site=structuredClone(example);
  site.assets.images=[{path:'/factory-assets/clients/fictional-clinic/room.webp',alt:'Illustrative room',sourceUrl:'https://source-record.example/licence',rights:'owned',illustrative:true}];
  site.sources.push({id:'hidden',url:'https://source-record.example/about',checkedAt:'2026-10-02'});
  const html=await renderSite(site,{allowDraft:true});
  assert.match(html,/@media \(max-width:800px\)/);
  assert.match(html,/Illustrative image/);
  assert.equal(html.includes('https://source-record.example/about'),false);
  assert.match(html,/Skip to content/);
});
test('barber prospect on the clinic starter needs template review',()=>{
  const site=structuredClone(example);site.sector='barber';
  assert.equal(assessSite(site,templates,{allowDraft:true}).code,'NEEDS_TEMPLATE_REVIEW');
});
test('stale build instructions need fresh approval',()=>{
  const approved=structuredClone(templates);approved[0].status='approved';
  const site=structuredClone(example);site.demo=false;
  site.sources=[{id:'fictional',url:'https://example.com',checkedAt:'2026-10-02'}];
  site.approvedInstructionsVersion='stale-version';
  assert.equal(assessSite(site,approved,{instructionsVersion:'current-version'}).code,'NEEDS_FRESH_APPROVAL');
});
test('private prospect fields are rejected',()=>{
  const site=structuredClone(example);site.business.email='person@example.com';
  assert.throws(()=>validateSite(site,templates,{allowDraft:true}),/Private fields/);
});
test('an existing job is not launched again',()=>{
  assert.equal(shouldLaunchBuild(null).launch,true);
  assert.equal(shouldLaunchBuild({state:'PREVIEW_READY'}).launch,false);
  assert.equal(shouldLaunchBuild({state:'ERROR'}).launch,false);
});
test('approved library images are copied into the client folder',async()=>{
  const tmp=await fs.mkdtemp(path.join(os.tmpdir(),'parley-images-'));
  const sourceRoot=path.join(tmp,'images');
  await fs.mkdir(path.join(sourceRoot,'general'),{recursive:true});
  await fs.writeFile(path.join(sourceRoot,'general','pixel.png'),pixel);
  const site=structuredClone(example);
  site.assets.librarySelections=['pixel'];
  const manifest=[{id:'pixel',category:'general',file:'images/general/pixel.png',alt:'Illustrative room',sourceUrl:'https://example.com/licence',rights:'owned',status:'approved',illustrative:true}];
  const result=await materialiseLibraryImages(site,manifest,{sourceRoot,clientDir:path.join(tmp,'client')});
  assert.equal(result.assets.images[0].path,'/factory-assets/clients/fictional-clinic/pixel.png');
  assert.equal(result.assets.images[0].illustrative,true);
  assert.ok((await fs.readFile(path.join(tmp,'client','pixel.png'))).equals(pixel));
  manifest[0].status='draft';
  await assert.rejects(()=>materialiseLibraryImages(site,manifest,{sourceRoot,clientDir:path.join(tmp,'client')}));
});
test('a later build updates the same preview address',async()=>{
  const tmp=await fs.mkdtemp(path.join(os.tmpdir(),'parley-preview-'));
  const outputFile=path.join(tmp,'index.html');
  const first=await generatePreview(example,{outputFile,skipStatus:true});
  assert.equal(first.code,'PREVIEW_READY');
  assert.equal(first.previewPath,'/preview/fictional-clinic/index.html');
  const revised=structuredClone(example);
  revised.copy.headline='Updated headline for the same address.';
  const second=await generatePreview(revised,{outputFile,skipStatus:true});
  assert.equal(second.code,'PREVIEW_READY');
  assert.equal(second.previewPath,first.previewPath);
  const html=await fs.readFile(outputFile,'utf8');
  assert.match(html,/Updated headline for the same address/);
});
test('a failed rebuild leaves the current page in place',async()=>{
  const tmp=await fs.mkdtemp(path.join(os.tmpdir(),'parley-preview-'));
  const outputFile=path.join(tmp,'index.html');
  await generatePreview(example,{outputFile,skipStatus:true});
  const broken=structuredClone(example);broken.contentReviewed=false;
  const result=await generatePreview(broken,{outputFile,skipStatus:true});
  assert.equal(result.code,'RESEARCH_INCOMPLETE');
  assert.equal(result.previewPath,'/preview/fictional-clinic/index.html');
  assert.match(await fs.readFile(outputFile,'utf8'),/Meadow Example Clinic/);
});
test('integration contract matches the hosting config and computed instructions version',async()=>{
  const integration=JSON.parse(await fs.readFile(new URL('./integration.json',import.meta.url),'utf8'));
  const vercel=JSON.parse(await fs.readFile(new URL('../vercel.json',import.meta.url),'utf8'));
  assert.equal(integration.instructionsVersion,await instructionsVersion());
  assert.equal(integration.emailDrafting.enabled,false);
  assert.equal(integration.budget.monthlyToolsLimit,200);
  assert.equal(integration.budget.currency,'GBP');
  assert.equal(vercel.buildCommand,integration.hosting.buildCommand);
  assert.equal(vercel.outputDirectory,integration.hosting.outputDirectory);
  assert.equal(integration.cursorApi.generation,'v1');
});
