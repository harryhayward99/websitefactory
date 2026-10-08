import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {catalogue,loadSite,validateSite,renderSite,assessSite,shouldLaunchBuild,materialiseLibraryImages,generatePreview,instructionsVersion,defaultLandingImage,withDefaultLandingImage,defaultPortraitImage,withDefaultPortrait,defaultServiceImage,withDefaultServiceImage,withDefaultPersonImages,withDefaultReviewPortraits,withDefaultAboutImage,root} from './factory.mjs';
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
  assert.match(result.assets.images[0].path,/^\/factory-assets\/clients\/fictional-clinic\/[a-f0-9]{16}-pixel.png$/);
  assert.equal(result.assets.images[0].illustrative,true);
  assert.ok((await fs.readFile(path.join(tmp,'client',path.basename(result.assets.images[0].path)))).equals(pixel));
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
test('care-modern follows the brand colour and has no cart',async()=>{
  const site=await loadSite('fictional-well');
  const html=await renderSite(site,{allowDraft:true});
  assert.match(html,/noindex/);assert.match(html,/FICTIONAL DEMO/);
  assert.match(html,/#2f6fed/i);assert.match(html,/Northshore Example Care/);
  assert.match(html,/id="services"/);assert.match(html,/id="about"/);assert.match(html,/id="contact"/);assert.match(html,/id="prices"/);
  assert.match(html,/href="#meet-team"/);
  assert.match(html,/Get to know the specialists/);
  assert.match(html,/class="about-next" href="#meet-team"><svg/);
  assert.match(html,/> Contact<\/p>\s*<h1>Northshore Example Care\.<\/h1>/);
  assert.doesNotMatch(html,/<h1>Contact Northshore Example Care\.<\/h1>/);
  assert.match(html,/> Prices<\/p>/);
  assert.match(html,/> Services<\/p>/);
  assert.match(html,/> Reviews<\/p>/);
  assert.doesNotMatch(html,/Meet our team below/);
  assert.match(html,/Meet the Team/);
  assert.match(html,/<h1>Northshore Example Care<\/h1>/);
  assert.match(html,/id="meet-team"/);
  assert.doesNotMatch(html,/If you want to meet the team, read below/);
  assert.match(html,/First appointment/);assert.match(html,/fee-gem"><strong>£90<\/strong>/);assert.match(html,/class="button solid fee-book" href="#contact">Book Now<\/a>/);assert.match(html,/class="fee-fold"/);assert.match(html,/<summary><span>Physiotherapy<\/span><strong>£60<\/strong><\/summary>/);
  assert.doesNotMatch(html,/Option 3/);
  assert.match(html,/maps\.google\.com\/maps\?q=/);assert.match(html,/Jordan Example/);
  assert.match(html,/<h2>Why Northshore Example Care\?<\/h2>/);
  assert.match(html,/\.rail,\.rail:hover,\.rail-reviews,\.rail-reviews:hover,\.rail-years,\.rail-years:hover\{width:auto;height:100%;min-height:80px/);
  assert.match(html,/class="hours-live" data-hours="Monday to Friday, 8:00–18:00"/);
  assert.match(html,/<h2>Parking<\/h2><p>Parking on site is available\. No extra directions are listed\.<\/p>/);
  assert.ok('Parking on site is available. No extra directions are listed.'.split(/\s+/).length <= 15);
  assert.match(html,/\.info-grid\{display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\);gap:16px;width:min\(100%,760px\);margin:28px auto 22px\}/);
  assert.match(html,/class="hours-live-tag">Live</);
  assert.match(html,/open \? \(line\.dataset\.open \|\| 'Open now'\) : \(line\.dataset\.closed \|\| 'Closed now'\)/);
  assert.match(html,/data-open="Reception is open" data-closed="Reception is closed"/);
  assert.match(html,/grid-template-columns:minmax\(180px,\.42fr\) minmax\(0,1\.58fr\)/);
  assert.match(html,/team-fall/);
  assert.match(html,/name="listed-offers"/);
  assert.match(html,/@media \(max-width:800px\)/);assert.match(html,/@media \(max-width:560px\)/);
  assert.match(html,/not a verified member of staff/i);
  assert.doesNotMatch(html,/add to bag|shop now|checkout|shopping cart|\bcart\b/i);
  const recoloured=structuredClone(site);recoloured.brand.accent='#b42318';
  const red=await renderSite(recoloured,{allowDraft:true});
  assert.match(red,/#b42318/i);assert.doesNotMatch(red,/#2f6fed/i);
  const green=structuredClone(site);green.brand.accent='#1f7a3a';
  const tinted=await renderSite(green,{allowDraft:true});
  assert.match(tinted,/--pale:#d7e7dc/i);
  assert.match(tinted,/>Book Now</);
  assert.match(tinted,/Leave a Google review\. Please\.\.\./);
  assert.match(tinted,/id="reviews"/);
  const crowded=structuredClone(site);
  crowded.business.services=Array.from({length:9},(_,index)=>({value:`Listed service ${index+1}`,sourceId:'fictional'}));
  const capped=await renderSite(crowded,{allowDraft:true});
  assert.match(capped,/Listed service 8/);
  assert.doesNotMatch(capped,/Listed service 9/);
});
test('care-modern is the default for clinic sectors and a dentist keeps dental services',async()=>{
  const modern=templates.find(template=>template.id==='care-modern');
  const preferred=templates.filter(template=>template.preferred);
  assert.equal(modern.status,'approved');
  assert.equal(preferred.length,1);
  assert.equal(preferred[0].id,'care-modern');
  assert.deepEqual(modern.sectors,['dental','physiotherapy','chiropractic','veterinary','general']);
  const site=await loadSite('fictional-dental');
  const html=await renderSite(site,{allowDraft:true});
  assert.match(html,/FICTIONAL DEMO/);
  assert.match(html,/Harbour Example Dental/);
  assert.match(html,/<span class="footer-pill">Harbour Example Dental<\/span>/);
  assert.doesNotMatch(html,/<img class="footer-logo"/);
  for (const name of ['Cosmetic','Oral Hygiene','Emergency','Family','DenPlan']) assert.match(html,new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.match(html,/New patient visit/);
  assert.doesNotMatch(html,/Doctor of Chiropractic/);
  assert.doesNotMatch(html,/Physiotherapy|Movement assessment|Sports rehabilitation|Exercise rehabilitation|How you move/);
  assert.match(html,/does not confirm a membership/);
});
test('a real clinic preview uses published facts and omits sample results',async()=>{
  const site=await loadSite('broad-oaks-health-clinic');
  const version=await instructionsVersion();
  assert.equal(site.approvedInstructionsVersion,version);
  const html=await renderSite(site,{instructionsVersion:version});
  assert.match(html,/CONCEPT WEBSITE/);
  assert.doesNotMatch(html,/FICTIONAL DEMO/);
  assert.match(html,/Broad Oaks Health Clinic/);
  assert.match(html,/<a class="footer-brand" href="#home"><span class="footer-pill"><img class="footer-logo" src="\/factory-assets\/clients\/broad-oaks-health-clinic\/logo.png" alt="Broad Oaks Health Clinic"><\/span><\/a>/);
  const heroLede = html.match(/<div class="hero-aside">\s*<p class="lede">([^<]*)<\/p>/);
  assert.ok(heroLede);
  assert.ok(heroLede[1].trim().split(/\s+/).length <= 50);
  assert.match(heroLede[1],/Therapy\. It is on the corner/);
  assert.match(heroLede[1],/bus stop outside\./);
  assert.doesNotMatch(heroLede[1],/Physiofirst/);
  assert.match(html,/Physiofirst/);
  assert.match(html,/<a class="hero-card" href="#services">/);
  assert.match(html,/<a class="hero-card" href="tel:01217053509">/);
  assert.match(html,/<a class="hero-card" href="#contact">[\s\S]*?<strong>394 Warwick Road, Solihull, West Midlands, B91 1BB<\/strong><em>Location<\/em>/);
  assert.match(html,/\.hero-cards\{[^}]*top:0;[^}]*grid-template-columns:minmax\(0,1fr\)/);
  assert.match(html,/\.hero-card:nth-child\(3\)\{grid-column:auto;grid-row:auto\}/);
  assert.match(html,/\.hero-media img\{object-position:center 62%;transform:none\}/);
  assert.match(html,/Gaynor Kunneke as an osteopath/);
  assert.match(html,/setInterval\(tick, 5000\)/);
  assert.match(html,/0121 705 3509/);
  assert.match(html,/394 Warwick Road/);
  assert.match(html,/IDD Therapy/);
  assert.match(html,/Mark Webb/);
  assert.match(html,/Ozan Altay/);
  assert.match(html,/<h3>Opening &amp; closing times<\/h3>\s*<p>Appointments from 9:00\. Evening and Saturday times depend on practitioner availability\.<\/p>/);
  assert.match(html,/2000\+/);
  assert.match(html,/Illustrative figure — not a verified result/);
  assert.match(html,/\.rail\{[^}]*height:210px/);
  assert.match(html,/\.rail-reviews\{height:270px\}/);
  assert.match(html,/\.rail-years\{height:340px\}/);
  assert.match(html,/class="about-link about-book" href="#contact">Book appointment<span class="about-orb"/);
  assert.match(html,/\.about-book:hover \.about-orb\{transform:none;/);
  assert.match(html,/putting me at ease/);
  const unreviewed = structuredClone(site);
  unreviewed.reviews = [];
  const unreviewedHtml = await renderSite(unreviewed, { instructionsVersion: version });
  assert.match(unreviewedHtml, /Google reviews for this clinic are still being checked/);
  assert.doesNotMatch(unreviewedHtml, /A sample note/);
  assert.match(html,/Google review · 16 January 2025/);
  assert.match(html,/<strong>Hannah<\/strong><span class="stars" aria-label="5 stars">★★★★★<\/span>/);
  assert.match(html,/Nothing here is from a live account/);
  assert.doesNotMatch(html,/<h2>Parking<\/h2>/);
  assert.doesNotMatch(html,/id="prices"/);
  assert.doesNotMatch(html,/not a published fee/);
  const priced = structuredClone(site);
  priced.fees = {
    visits: [{ title: 'Initial visit', fee: '£65', includes: ['A consultation'], time: 'Duration: 40 minutes.', sourceId: 'homepage' }],
    services: [{ name: 'Osteopathy', fee: '£48', note: 'Listed on the fees page.', sourceId: 'homepage' }]
  };
  const pricedHtml = await renderSite(priced, { instructionsVersion: version });
  assert.match(pricedHtml, /id="prices"/);
  assert.match(pricedHtml, /From the published website/);
  assert.match(pricedHtml, /Initial visit/);
  assert.match(pricedHtml, /fee-gem"><strong>£65<\/strong>/);
  assert.match(pricedHtml, /<summary><span>Osteopathy<\/span><strong>£48<\/strong><\/summary>/);
  assert.match(pricedHtml, /class="button solid fee-book" href="#contact">Book Now<\/a>/);
  assert.doesNotMatch(pricedHtml, /not a published fee/);
  assert.doesNotMatch(pricedHtml, /£90/);
  assert.doesNotMatch(html,/not a verified review/);
  assert.match(html,/Names taken from the official website/);
  const pictured=structuredClone(site);
  pictured.assets.images=[{path:'/factory-assets/clients/broad-oaks-health-clinic/landing-treatment.png',alt:'Illustrative clinic treatment. Not a photograph of this clinic’s staff or premises.',sourceUrl:'owned:Harry',rights:'owned',illustrative:true,placement:'landing'}];
  const picturedHtml=await renderSite(pictured,{instructionsVersion:version});
  assert.match(picturedHtml,/<figure class="hero-media"><img src="\/factory-assets\/clients\/broad-oaks-health-clinic\/landing-treatment.png"/);
  assert.doesNotMatch(picturedHtml,/class="thumb"><img/);
  assert.doesNotMatch(picturedHtml,/class="meet-photo"><img/);
  const withPortrait=structuredClone(site);
  withPortrait.assets.images=[
    {path:'/factory-assets/clients/broad-oaks-health-clinic/landing-treatment.png',alt:'Illustrative clinic treatment. Not a photograph of this clinic’s staff or premises.',sourceUrl:'owned:Harry',rights:'owned',illustrative:true,placement:'landing'},
    {path:'/factory-assets/clients/broad-oaks-health-clinic/portrait-placeholder.png',alt:'Illustrative portrait. Not a photograph of this clinic’s staff.',sourceUrl:'owned:Harry',rights:'owned',illustrative:true,placement:'portrait'}
  ];
  const portraitHtml=await renderSite(withPortrait,{instructionsVersion:version});
  assert.equal((portraitHtml.match(/class="meet-photo"><img src="\/factory-assets\/clients\/broad-oaks-health-clinic\/portrait-placeholder.png"/g)||[]).length,site.people.length);
  assert.match(portraitHtml,/Illustrative portrait — not a photograph of this person/);
  assert.match(portraitHtml,/<figure class="hero-media"><img src="\/factory-assets\/clients\/broad-oaks-health-clinic\/landing-treatment.png"/);
  assert.doesNotMatch(portraitHtml,/class="hero-media"><img src="\/factory-assets\/clients\/broad-oaks-health-clinic\/portrait-placeholder.png"/);
  assert.doesNotMatch(portraitHtml,/class="thumb"><img/);
  const withService=structuredClone(withPortrait);
  withService.assets.images=[...withPortrait.assets.images,{path:'/factory-assets/clients/broad-oaks-health-clinic/service-tile.png',alt:'Illustrative treatment. Not a photograph of this clinic’s staff or premises.',sourceUrl:'owned:Harry',rights:'owned',illustrative:true,placement:'service'}];
  const serviceHtml=await renderSite(withService,{instructionsVersion:version});
  assert.match(serviceHtml,/<figure class="tile-media"><img src="\/factory-assets\/clients\/broad-oaks-health-clinic\/service-tile.png"/);
  assert.doesNotMatch(serviceHtml,/class="tile-media frame"/);
  assert.match(serviceHtml,/<figure class="hero-media"><img src="\/factory-assets\/clients\/broad-oaks-health-clinic\/landing-treatment.png"/);
  assert.match(serviceHtml,/class="meet-photo"><img src="\/factory-assets\/clients\/broad-oaks-health-clinic\/portrait-placeholder.png"/);
  assert.doesNotMatch(serviceHtml,/class="hero-media"><img src="\/factory-assets\/clients\/broad-oaks-health-clinic\/service-tile.png"/);
  assert.doesNotMatch(serviceHtml,/class="meet-photo"><img src="\/factory-assets\/clients\/broad-oaks-health-clinic\/service-tile.png"/);
});
test('physiotherapy and chiropractic default to the landing treatment photograph',async()=>{
  assert.equal(defaultLandingImage('physiotherapy'),'physio-landing-treatment');
  assert.equal(defaultLandingImage('chiropractic'),'care-landing-treatment');
  assert.equal(defaultLandingImage('general'),'care-landing-treatment');
  assert.equal(defaultLandingImage('dental'),'dental-landing-treatment');
  assert.equal(defaultLandingImage('veterinary'),'veterinary-landing-treatment');
  const empty=structuredClone(example);empty.sector='chiropractic';empty.assets.librarySelections=[];empty.assets.images=[];
  assert.deepEqual(withDefaultLandingImage(empty).assets.librarySelections,['care-landing-treatment']);
  const dental=structuredClone(example);dental.sector='dental';dental.assets.librarySelections=[];dental.assets.images=[];
  assert.deepEqual(withDefaultLandingImage(dental).assets.librarySelections,['dental-landing-treatment']);
  const chosen=structuredClone(example);chosen.assets.librarySelections=['other'];chosen.assets.images=[];
  assert.deepEqual(withDefaultLandingImage(chosen).assets.librarySelections,['other','physio-landing-treatment']);
  const manifest=JSON.parse(await fs.readFile(path.join(root,'images','manifest.json'),'utf8'));
  for (const id of ['physio-landing-treatment','care-landing-treatment','chiro-landing-treatment','dental-landing-treatment','veterinary-landing-treatment']) {
    const entry=manifest.assets.find(asset=>asset.id===id);
    assert.equal(entry.status,'approved');
    assert.equal(entry.illustrative,true);
    assert.ok(entry.tags.includes('landing'));
    await fs.access(path.join(root,entry.file));
  }
  const well=await loadSite('fictional-well');
  assert.deepEqual(well.assets.librarySelections,['physio-landing-treatment','care-portrait-placeholder','care-service-tile']);
  const pinned=structuredClone(well);
  pinned.assets.images=[{path:'/factory-assets/clients/fictional-well/landing-treatment.png',alt:'Illustrative clinic treatment. Not a photograph of this clinic’s staff or premises.',sourceUrl:'owned:Harry',rights:'owned',illustrative:true,libraryId:'physio-landing-treatment',placement:'landing'}];
  const pinnedHtml=await renderSite(pinned,{allowDraft:true});
  assert.match(pinnedHtml,/<figure class="hero-media"><img class="anchor-top-right" src="\/factory-assets\/clients\/fictional-well\/landing-treatment.png"/);
  assert.match(pinnedHtml,/\.hero-media img\.anchor-top-right\{object-fit:cover;object-position:right bottom;top:auto;right:0;left:auto;bottom:0;width:800px;height:calc\(800px \* 2 \/ 3\)\}/);
  assert.match(pinnedHtml,/\.hero-media img\.anchor-top-right\{object-fit:cover;top:-18%;right:0;left:0;width:100%;height:130%;transform:none\}/);
});
test('medical care sites use the shared portrait placeholder unless one is already chosen',async()=>{
  assert.equal(defaultPortraitImage('dental'),'care-portrait-placeholder');
  assert.equal(defaultPortraitImage('physiotherapy'),'care-portrait-placeholder');
  assert.equal(defaultPortraitImage('chiropractic'),'care-portrait-placeholder');
  assert.equal(defaultPortraitImage('veterinary'),'care-portrait-placeholder');
  assert.equal(defaultPortraitImage('barber'),'');
  const dental=structuredClone(example);dental.sector='dental';dental.assets.librarySelections=[];dental.assets.images=[];
  assert.deepEqual(withDefaultPortrait(dental).assets.librarySelections,['care-portrait-placeholder']);
  const landed=structuredClone(example);landed.assets.librarySelections=['physio-landing-treatment'];landed.assets.images=[];
  assert.deepEqual(withDefaultPortrait(landed).assets.librarySelections,['physio-landing-treatment','care-portrait-placeholder']);
  const opted=structuredClone(example);opted.assets.defaultPortrait=false;opted.assets.librarySelections=[];
  assert.deepEqual(withDefaultPortrait(opted).assets.librarySelections,[]);
  const barber=structuredClone(example);barber.sector='barber';barber.assets.librarySelections=[];
  assert.deepEqual(withDefaultPortrait(barber).assets.librarySelections,[]);
  const manifest=JSON.parse(await fs.readFile(path.join(root,'images','manifest.json'),'utf8'));
  const entry=manifest.assets.find(asset=>asset.id==='care-portrait-placeholder');
  assert.equal(entry.category,'general');
  assert.equal(entry.status,'approved');
  assert.equal(entry.illustrative,true);
  assert.ok(entry.tags.includes('portrait'));
  await fs.access(path.join(root,entry.file));
});
test('Riley Example uses the supplied treatment photograph on demo cards',async()=>{
  const demo=await loadSite('fictional-well');
  const selected=withDefaultPersonImages(demo);
  assert.ok(selected.assets.librarySelections.includes('care-riley-example'));
  assert.ok(selected.assets.librarySelections.includes('care-jordan-example'));
  assert.ok(selected.assets.librarySelections.includes('care-sam-example'));
  const real=await loadSite('broad-oaks-health-clinic');
  assert.equal(withDefaultPersonImages(real).assets.librarySelections.includes('care-riley-example'),true);
  assert.equal(withDefaultPersonImages(real).assets.librarySelections.includes('care-jordan-example'),true);
  assert.equal(withDefaultPersonImages(real).assets.librarySelections.includes('care-sam-example'),true);
  const dentist=structuredClone(real);dentist.sector='dental';dentist.demo=false;dentist.assets.librarySelections=[];
  assert.equal(withDefaultPersonImages(dentist).assets.librarySelections.includes('care-jordan-example'),false);
  const manifest=JSON.parse(await fs.readFile(path.join(root,'images','manifest.json'),'utf8'));
  const entry=manifest.assets.find(asset=>asset.id==='care-riley-example');
  assert.equal(entry.category,'general');
  assert.equal(entry.status,'approved');
  assert.equal(entry.illustrative,true);
  await fs.access(path.join(root,entry.file));
  const jordan=manifest.assets.find(asset=>asset.id==='care-jordan-example');
  assert.equal(jordan.category,'general');
  assert.equal(jordan.status,'approved');
  assert.equal(jordan.illustrative,true);
  await fs.access(path.join(root,jordan.file));
  const sam=manifest.assets.find(asset=>asset.id==='care-sam-example');
  assert.equal(sam.category,'general');
  assert.equal(sam.status,'approved');
  assert.equal(sam.illustrative,true);
  await fs.access(path.join(root,sam.file));
  const site=structuredClone(demo);
  site.assets.images=[
    {path:'/factory-assets/clients/fictional-well/jordan-example.png',alt:'Illustrative treatment. Not a photograph of Jordan Example or of this clinic’s staff.',sourceUrl:'owned:Harry',rights:'owned',illustrative:true,libraryId:'care-jordan-example',placement:'person'},
    {path:'/factory-assets/clients/fictional-well/sam-example.png',alt:'Illustrative treatment. Not a photograph of Sam Example or of this clinic’s staff.',sourceUrl:'owned:Harry',rights:'owned',illustrative:true,libraryId:'care-sam-example',placement:'person'},
    {path:'/factory-assets/clients/fictional-well/riley-example.png',alt:'Illustrative treatment. Not a photograph of Riley Example or of this clinic’s staff.',sourceUrl:'owned:Harry',rights:'owned',illustrative:true,libraryId:'care-riley-example',placement:'person'}
  ];
  const html=await renderSite(site,{allowDraft:true,instructionsVersion:await instructionsVersion()});
  assert.match(html,/<figure class="meet-photo"><img class="anchor-start" src="\/factory-assets\/clients\/fictional-well\/jordan-example.png"[\s\S]{0,500}<h3>Jordan Example<\/h3>/);
  assert.match(html,/<figure class="thumb"><img src="\/factory-assets\/clients\/fictional-well\/jordan-example.png"[\s\S]{0,400}<h2>Jordan Example<\/h2>/);
  assert.match(html,/<figure class="meet-photo"><img class="anchor-start" src="\/factory-assets\/clients\/fictional-well\/sam-example.png"[\s\S]{0,500}<h3>Sam Example<\/h3>/);
  assert.match(html,/<figure class="thumb"><img src="\/factory-assets\/clients\/fictional-well\/sam-example.png"[\s\S]{0,400}<h2>Sam Example<\/h2>/);
  assert.match(html,/<figure class="meet-photo"><img class="anchor-start" src="\/factory-assets\/clients\/fictional-well\/riley-example.png"[\s\S]{0,500}<h3>Riley Example<\/h3>/);
  assert.match(html,/\.meet-photo img\.anchor-start\{object-position:left top\}/);
  assert.match(html,/<figure class="thumb"><img src="\/factory-assets\/clients\/fictional-well\/riley-example.png"[\s\S]{0,400}<h2>Riley Example<\/h2>/);
  assert.doesNotMatch(html,/riley-example\.png[\s\S]{0,400}<h3>Jordan Example<\/h3>/);
  assert.doesNotMatch(html,/jordan-example\.png[\s\S]{0,400}<h3>Riley Example<\/h3>/);
});
test('demo review cards use three illustrative treatment photographs',async()=>{
  const manifest=JSON.parse(await fs.readFile(path.join(root,'images','manifest.json'),'utf8'));
  for (const id of ['care-review-arm','care-review-ball','care-review-shoulder']) {
    const entry=manifest.assets.find(asset=>asset.id===id);
    assert.equal(entry.category,'general');
    assert.equal(entry.status,'approved');
    assert.equal(entry.illustrative,true);
    await fs.access(path.join(root,entry.file));
  }
  const stored=await loadSite('fictional-well');
  const prepared=withDefaultReviewPortraits(stored);
  assert.ok(prepared.assets.librarySelections.includes('care-review-arm'));
  assert.ok(prepared.assets.librarySelections.includes('care-review-ball'));
  assert.ok(prepared.assets.librarySelections.includes('care-review-shoulder'));
  const real=structuredClone(stored);real.demo=false;
  assert.equal(withDefaultReviewPortraits(real).assets.librarySelections.includes('care-review-arm'),true);
  assert.equal(withDefaultAboutImage(real).assets.librarySelections.includes('care-about-exterior'),true);
  const dentist=structuredClone(stored);dentist.demo=false;dentist.sector='dental';dentist.assets.librarySelections=[];
  assert.equal(withDefaultReviewPortraits(dentist).assets.librarySelections.includes('care-review-arm'),false);
  assert.equal(withDefaultAboutImage(dentist).assets.librarySelections.includes('care-about-exterior'),false);
  const site=structuredClone(stored);
  site.assets.images=[
    {path:'/factory-assets/clients/fictional-well/book-portrait.png',alt:'Illustrative portrait. Not a photograph of this clinic’s staff.',sourceUrl:'owned:Harry',rights:'owned',illustrative:true,libraryId:'care-book-portrait',placement:'booking'},
    {path:'/factory-assets/clients/fictional-well/review-arm.png',alt:'Illustrative treatment. Not a photograph of a reviewer or of this clinic’s staff.',sourceUrl:'owned:Harry',rights:'owned',illustrative:true,libraryId:'care-review-arm'},
    {path:'/factory-assets/clients/fictional-well/review-ball.png',alt:'Illustrative treatment. Not a photograph of a reviewer or of this clinic’s staff.',sourceUrl:'owned:Harry',rights:'owned',illustrative:true,libraryId:'care-review-ball'},
    {path:'/factory-assets/clients/fictional-well/review-shoulder.png',alt:'Illustrative treatment. Not a photograph of a reviewer or of this clinic’s staff.',sourceUrl:'owned:Harry',rights:'owned',illustrative:true,libraryId:'care-review-shoulder'}
  ];
  const html=await renderSite(site,{allowDraft:true});
  const photos=html.match(/<div class="review-photos">([\s\S]*?)<\/div>/);
  assert.ok(photos);
  assert.match(photos[1],/review-arm\.png[\s\S]*review-ball\.png[\s\S]*review-shoulder\.png/);
  assert.doesNotMatch(photos[1],/book-portrait/);
  assert.match(html,/<figure class="book-portrait"><img src="\/factory-assets\/clients\/fictional-well\/book-portrait.png"/);
});
test('a chiropractic concept uses the Northshore photographs',async()=>{
  const site=await loadSite('back-and-neck-clinic');
  site.assets.images=[
    {path:'/factory-assets/clients/back-and-neck-clinic/landing-treatment.png',alt:'Illustrative clinic treatment. Not a photograph of this clinic’s staff or premises.',sourceUrl:'owned:Harry',rights:'owned',illustrative:true,libraryId:'care-landing-treatment',placement:'landing'},
    {path:'/factory-assets/clients/back-and-neck-clinic/jordan-example.png',alt:'Illustrative treatment. Not a photograph of Jordan Example or of this clinic’s staff.',sourceUrl:'owned:Harry',rights:'owned',illustrative:true,libraryId:'care-jordan-example',placement:'person'},
    {path:'/factory-assets/clients/back-and-neck-clinic/review-arm.png',alt:'Illustrative treatment. Not a photograph of a reviewer or of this clinic’s staff.',sourceUrl:'owned:Harry',rights:'owned',illustrative:true,libraryId:'care-review-arm'},
    {path:'/factory-assets/clients/back-and-neck-clinic/review-ball.png',alt:'Illustrative treatment. Not a photograph of a reviewer or of this clinic’s staff.',sourceUrl:'owned:Harry',rights:'owned',illustrative:true,libraryId:'care-review-ball'},
    {path:'/factory-assets/clients/back-and-neck-clinic/review-shoulder.png',alt:'Illustrative treatment. Not a photograph of a reviewer or of this clinic’s staff.',sourceUrl:'owned:Harry',rights:'owned',illustrative:true,libraryId:'care-review-shoulder'},
    {path:'/factory-assets/clients/back-and-neck-clinic/about-exterior.png',alt:'Illustrative clinic exterior. Not a photograph of this clinic’s premises.',sourceUrl:'owned:Harry',rights:'owned',illustrative:true,libraryId:'care-about-exterior',placement:'about'},
    {path:'/factory-assets/clients/back-and-neck-clinic/service-tile.png',alt:'Illustrative treatment. Not a photograph of this clinic’s staff or premises.',sourceUrl:'owned:Harry',rights:'owned',illustrative:true,libraryId:'care-service-tile',placement:'service'},
    {path:'/factory-assets/clients/back-and-neck-clinic/service-tile-2.png',alt:'Illustrative treatment. Not a photograph of this clinic’s staff or premises.',sourceUrl:'owned:Harry',rights:'owned',illustrative:true,libraryId:'care-service-tile-2',placement:'service'}
  ];
  const html=await renderSite(site,{instructionsVersion:await instructionsVersion()});
  assert.match(html,/<figure class="hero-media"><img class="anchor-top-right" src="\/factory-assets\/clients\/back-and-neck-clinic\/landing-treatment.png"/);
  assert.match(html,/<figure class="meet-photo"><img class="anchor-start" src="\/factory-assets\/clients\/back-and-neck-clinic\/jordan-example.png"[\s\S]{0,800}<h3>Richard Ridings<\/h3>/);
  assert.match(html,/<figure class="about-photo"><img src="\/factory-assets\/clients\/back-and-neck-clinic\/about-exterior.png"/);
  const photos=html.match(/<div class="review-photos">([\s\S]*?)<\/div>/);
  assert.ok(photos);
  assert.match(photos[1],/review-arm\.png[\s\S]*review-ball\.png[\s\S]*review-shoulder\.png/);
  assert.doesNotMatch(photos[1],/Richard Ridings/);
  const panels=[...html.matchAll(/<div class="accordion-panel"><figure class="tile-media"><img src="([^"]+)"/g)].map(match=>match[1]);
  assert.equal(panels[0],'/factory-assets/clients/back-and-neck-clinic/service-tile.png');
  assert.equal(panels[1],'/factory-assets/clients/back-and-neck-clinic/service-tile-2.png');
  assert.equal(panels[2],'/factory-assets/clients/back-and-neck-clinic/review-shoulder.png');
});
test('care sites use the shared service photograph unless one is already chosen',async()=>{
  assert.equal(defaultServiceImage('dental'),'care-service-tile');
  assert.equal(defaultServiceImage('physiotherapy'),'care-service-tile');
  assert.equal(defaultServiceImage('chiropractic'),'care-service-tile');
  assert.equal(defaultServiceImage('veterinary'),'care-service-tile');
  assert.equal(defaultServiceImage('barber'),'');
  const dental=structuredClone(example);dental.sector='dental';dental.assets.librarySelections=['care-portrait-placeholder'];dental.assets.images=[];
  assert.deepEqual(withDefaultServiceImage(dental).assets.librarySelections,['care-portrait-placeholder','care-service-tile']);
  const opted=structuredClone(example);opted.assets.defaultServiceImage=false;opted.assets.librarySelections=[];
  assert.deepEqual(withDefaultServiceImage(opted).assets.librarySelections,[]);
  const chosen=structuredClone(example);chosen.assets.images=[{placement:'service'}];chosen.assets.librarySelections=[];
  assert.deepEqual(withDefaultServiceImage(chosen).assets.librarySelections,[]);
  const manifest=JSON.parse(await fs.readFile(path.join(root,'images','manifest.json'),'utf8'));
  const entry=manifest.assets.find(asset=>asset.id==='care-service-tile');
  assert.equal(entry.category,'general');
  assert.equal(entry.status,'approved');
  assert.equal(entry.illustrative,true);
  assert.ok(entry.tags.includes('service'));
  await fs.access(path.join(root,entry.file));
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

test('unchanged HTML still receives fresh status and content hash',async()=>{
  const tmp=await fs.mkdtemp(path.join(os.tmpdir(),'parley-status-'));
  const options={outputFile:path.join(tmp,'preview/index.html'),directories:{previewDir:path.join(tmp,'preview'),jobsDir:path.join(tmp,'jobs')}};
  await generatePreview(example,{...options,instructionsVersion:'old-version'});
  const second=await generatePreview(example,{...options,instructionsVersion:'new-version'});
  const status=JSON.parse(await fs.readFile(path.join(tmp,'preview/status.json'),'utf8'));
  assert.equal(second.code,'PREVIEW_READY');assert.equal(status.instructionsVersion,'new-version');assert.match(status.contentHash,/^[a-f0-9]{64}$/);
  await fs.rm(path.join(tmp,'preview/status.json'));
  await generatePreview(example,{...options,instructionsVersion:'new-version'});
  assert.equal(JSON.parse(await fs.readFile(path.join(tmp,'preview/status.json'),'utf8')).instructionsVersion,'new-version');
});
test('invalid rebuild cannot overwrite assets used by the existing preview',async()=>{
  const tmp=await fs.mkdtemp(path.join(os.tmpdir(),'parley-stage-'));
  const sourceRoot=path.join(tmp,'images'),clientDir=path.join(tmp,'client');
  await fs.mkdir(path.join(sourceRoot,'general'),{recursive:true});await fs.mkdir(clientDir);
  await fs.writeFile(path.join(sourceRoot,'general','pixel.png'),pixel);await fs.writeFile(path.join(clientDir,'pixel.png'),'original asset');
  const site=structuredClone(example);site.assets.librarySelections=['pixel'];site.contentReviewed=false;
  const manifest=[{id:'pixel',category:'general',file:'images/general/pixel.png',alt:'Illustrative room',sourceUrl:'https://example.com/licence',rights:'owned',status:'approved'}];
  const result=await generatePreview(site,{outputFile:path.join(tmp,'index.html'),skipStatus:true,manifestAssets:manifest,assetPaths:{sourceRoot,clientDir}});
  assert.equal(result.code,'RESEARCH_INCOMPLETE');assert.equal(await fs.readFile(path.join(clientDir,'pixel.png'),'utf8'),'original asset');
});
