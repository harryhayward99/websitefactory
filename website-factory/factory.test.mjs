import test from 'node:test';
import assert from 'node:assert/strict';
import {catalogue,loadSite,validateSite,renderSite} from './factory.mjs';
const templates = await catalogue();
const example = await loadSite('fictional-clinic');
test('fictional draft renders escaped HTML with concept/noindex labels',async()=>{
  const site=structuredClone(example);site.business.name.value='<script>alert(1)</script>';
  const html=await renderSite(site,{allowDraft:true});
  assert.match(html,/noindex/);assert.match(html,/FICTIONAL DEMO/);
  assert.ok(!html.includes('<script>'));assert.match(html,/&lt;script&gt;/);
});
test('real prospect cannot bypass template approval using allowDraft',()=>{
  const site=structuredClone(example);site.demo=false;
  site.sources=[{id:'fictional',url:'https://example.com',checkedAt:'2026-10-02'}];
  assert.throws(()=>validateSite(site,templates,{allowDraft:true}),/approved template/);
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
