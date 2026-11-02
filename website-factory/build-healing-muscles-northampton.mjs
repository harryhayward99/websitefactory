import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = 'healing-muscles-northampton';
const A = `/factory-assets/clients/${slug}`;
const srcHtml = path.join(root, 'public/preview/muncila-chiropractic/index.html');
const outDir = path.join(root, 'public/preview', slug);
const assetDir = path.join(root, 'public/factory-assets/clients', slug);
const muncilaAssets = path.join(root, 'public/factory-assets/clients/muncila-chiropractic');

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(assetDir, { recursive: true });

for (const name of [
  'physio-landing.png',
  'service-tile.png',
  'service-tile-2.png',
  'review-shoulder.png',
  'review-arm.png',
  'about-exterior.png',
]) {
  const from = path.join(muncilaAssets, name);
  if (fs.existsSync(from)) fs.copyFileSync(from, path.join(assetDir, name));
}

const bookSvg = `<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><rect x="2.2" y="3.2" width="11.6" height="10.6" rx="1.4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M2.2 6.4h11.6M5.2 2v2.6M10.8 2v2.6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`;
const tel = '07856268245';
const telNice = '07856 268245';
const bookHref = 'https://api.leadconnectorhq.com/booking/parley-demo-clinic/bp/healing-muscles-northampton-demo';
const bookAttrs = `href="${bookHref}" target="_blank" rel="noopener noreferrer"`;
const freshaUrl = 'https://www.fresha.com/en-GB/a/healing-muscles-northampton-upton-187-west-street-fqajbbpb';
const mapQuery = encodeURIComponent('187 West Street, Upton, Northampton');
const googleReview = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
const accent = '#61534A';
const pale = '#ebe6e2';
const heroGrey = '#e8e8e8';

const meetSlides = `<article class="meet-slide is-on"><figure class="meet-photo"><img class="anchor-face" src="${A}/portrait-kylie.jpg" alt="Kylie Mellors, founder and senior therapist at Healing Muscles Northampton, holding the NL Awards Best Wellness or Spa trophy and certificate."></figure><div class="meet-card"><h3>Kylie Mellors</h3><p class="meet-role">Founder &amp; Senior Therapist</p><p>Kylie founded Healing Muscles Northampton to offer tailored massage in a calm, welcoming space. Treatments are shaped around your lifestyle and where you need extra care — from bespoke deep tissue and sports work to pregnancy wellness and targeted releases.</p><a class="button meet-book" ${bookAttrs}>${bookSvg} Book appointment</a></div></article>`;

const peopleCards = `<article class="person is-current"><figure class="thumb"><img class="anchor-face" src="${A}/portrait-kylie.jpg" alt="Kylie Mellors, founder and senior therapist at Healing Muscles Northampton."></figure><div class="person-card"><h2>Kylie Mellors</h2><p class="role">Founder &amp; Senior Therapist</p><p>Kylie is the founder and senior therapist at Healing Muscles Northampton. Clients praise her warm welcome, careful assessment of lifestyle and problem areas, and treatments that leave them relaxed and moving more freely. The practice is adults only, with parking available and wheelchair access noted on Fresha.</p></div></article>`;

const reviewsBlock = `<div class="review-board" data-active="0"><div class="review-list" role="tablist" aria-label="Fresha reviews"><button class="review-pick" type="button" role="tab" aria-selected="true"><strong>Emma R</strong><span class="stars" aria-label="5 stars">★★★★★</span></button><button class="review-pick" type="button" role="tab" aria-selected="false"><strong>Kori T</strong><span class="stars" aria-label="5 stars">★★★★★</span></button><button class="review-pick" type="button" role="tab" aria-selected="false"><strong>Ruby H</strong><span class="stars" aria-label="5 stars">★★★★★</span></button><button class="review-pick" type="button" role="tab" aria-selected="false"><strong>Hollie K</strong><span class="stars" aria-label="5 stars">★★★★★</span></button></div><div class="review-photos"><figure class="review-photo"><img src="${A}/review-shoulder.png" alt="Illustrative treatment photograph. Not a photograph of Healing Muscles Northampton staff or premises."></figure><figure class="review-photo" aria-hidden="true"><img src="${A}/review-arm.png" alt="Illustrative treatment photograph. Not a photograph of Healing Muscles Northampton staff or premises."></figure><figure class="review-photo" aria-hidden="true"><img src="${A}/service-tile.png" alt="Illustrative treatment photograph. Not a photograph of Healing Muscles Northampton staff or premises."></figure><figure class="review-photo" aria-hidden="true"><img src="${A}/physio-landing.png" alt="Illustrative treatment photograph. Not a photograph of Healing Muscles Northampton staff or premises."></figure></div><div class="review-quotes"><article class="review-quote"><p class="flag">Fresha review · Bespoke Deep Tissue Massage · with Kylie</p><h3>Emma R</h3><p class="review-stars"><span class="stars" aria-label="5 stars">★★★★★</span></p><p>Amazing treatment, highly recommend thanks so much.</p></article><article class="review-quote" aria-hidden="true"><p class="flag">Fresha review · Mother-to-Be Back Massage · with Kylie</p><h3>Kori T</h3><p class="review-stars"><span class="stars" aria-label="5 stars">★★★★★</span></p><p>Lovely relaxing massage, would definitely recommend. Kylie is a very warm and welcoming person and made me feel very at ease for my first visit with her.</p></article><article class="review-quote" aria-hidden="true"><p class="flag">Fresha review · Bespoke Deep Tissue Massage · with Kylie</p><h3>Ruby H</h3><p class="review-stars"><span class="stars" aria-label="5 stars">★★★★★</span></p><p>Kylie is amazing, she’s very welcoming and gets to know you and your lifestyle to assess where you may need extra care before even starting your treatment. It’s always a very relaxing environment and experience. As I have a very physical job I go to Kylie once a month to try and stay in the best health possible and take care of my muscles.</p></article><article class="review-quote" aria-hidden="true"><p class="flag">Fresha review · Bespoke Deep Tissue Massage · with Kylie</p><h3>Hollie K</h3><p class="review-stars"><span class="stars" aria-label="5 stars">★★★★★</span></p><p>Today was my first experience and it was absolutely beautiful. The space is so warm, welcoming and cosy, and the whole experience was just perfect. I felt so relaxed and honestly didn’t want it to end! I’ll definitely be back.</p></article></div><div class="review-nav"><button class="meet-arrow review-prev" type="button" aria-label="Previous review"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 3.2 5.2 8 10 12.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button class="meet-arrow review-next" type="button" aria-label="Next review"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 3.2 10.8 8 6 12.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div></div>`;

let html = fs.readFileSync(srcHtml, 'utf8');

html = html
  .replaceAll('/factory-assets/clients/muncila-chiropractic/', `${A}/`)
  .replaceAll(
    'https://api.leadconnectorhq.com/booking/parley-demo-clinic/bp/muncila-chiropractic-demo',
    bookHref
  )
  .replaceAll('01295 258872', telNice)
  .replaceAll('01295258872', tel)
  .replaceAll("First Floor, 33–34 Parson's Street, Banbury, OX16 5NA", '187 West Street, Upton, Northampton')
  .replaceAll("33–34 Parson's Street, OX16 5NA", '187 West Street, Upton')
  .replaceAll("First Floor, 33-34 Parson's Street, Banbury, OX16 5NA", '187 West Street, Upton, Northampton')
  .replaceAll('Restore Chiropractic', 'Healing Muscles Northampton')
  .replaceAll('Restore', 'Healing Muscles')
  .replaceAll('muncilachiropractic.com', 'fresha.com')
  .replaceAll('Banbury', 'Northampton')
  .replaceAll('chiropractor', 'massage therapist')
  .replaceAll('Chiropractor', 'Massage therapist')
  .replaceAll('chiropractic', 'massage')
  .replaceAll('Chiropractic', 'Massage');

html = html.replace(
  /<meta name="description" content="[^"]*">/,
  `<meta name="description" content="Healing Muscles Northampton — tailored massage with Kylie Mellors at 187 West Street, Upton. Book online or call ${telNice}.">`
);
html = html.replace(
  /<title>[^<]*<\/title>/,
  '<title>Healing Muscles Northampton | Massage in Upton</title>'
);
html = html.replace(
  /:root\{color-scheme:light;--accent:[^;]+;--on:#ffffff;--pale:[^}]+\}/,
  `:root{color-scheme:light;--accent:${accent};--on:#ffffff;--pale:${pale}}`
);

// Hero figure: light grey base; keep pale theme gradient on ::after
html = html.replace(
  '.hero-media,.wide-media,.side-media,.tile-media,.frame{margin:0;position:relative;overflow:hidden;border-radius:10px;background:var(--pale)}',
  `.hero-media,.wide-media,.side-media,.tile-media,.frame{margin:0;position:relative;overflow:hidden;border-radius:10px;background:var(--pale)}.hero-media{background:${heroGrey}}`
);
html = html.replace(
  '.hero-media{height:400px;border-radius:28px}',
  `.hero-media{height:400px;border-radius:28px;background:${heroGrey}}`
);
// Collage sits better contained so grey shows around black-framed artwork
html = html.replace(
  '.hero-media img.fit-facade{left:25%;width:75%;right:auto;top:auto;bottom:0;height:100%;object-fit:cover;object-position:center bottom;transform:none}',
  '.hero-media img.fit-facade{left:0;width:100%;right:auto;top:0;bottom:0;height:100%;object-fit:contain;object-position:center center;transform:none}'
);
html = html.replace(
  '  .hero-media img.fit-facade{left:0;width:100%;right:auto;top:auto;bottom:25%;height:100%;transform:none;object-fit:cover;object-position:center center}',
  '  .hero-media img.fit-facade{left:0;width:100%;right:auto;top:0;bottom:0;height:100%;transform:none;object-fit:contain;object-position:center center}'
);

html = html.replace(
  /<a class="brand" href="#home"><img class="logo"[^>]*><\/a>/,
  `<a class="brand" href="#home"><img class="logo" src="${A}/logo.png" alt="Healing Muscles Northampton" width="220" height="68"></a>`
);
html = html.replace(
  /stroke="#5BC4BE"/g,
  `stroke="${accent}"`
);
html = html.replace(
  /<h1>Healing Muscles<span class="title-skip"> in <\/span>Northampton<span class="title-stop"><\/span><\/h1>/,
  '<h1>Healing Muscles<span class="title-skip"> in </span>Northampton<span class="title-stop"></span></h1>'
);
html = html.replace(
  /<p class="lede">Family-run massage care in the heart of Northampton\.<br>Award-winning care with Marc Muncila\.<\/p>/,
  '<p class="lede">Tailored massage in a calm, welcoming space in Upton.<br>Founded by therapist Kylie Mellors.</p>'
);
// Title may still say Restore-derived text if replace order differed
html = html.replace(
  /<p class="lede">[^<]*Marc[^<]*<\/p>/,
  '<p class="lede">Tailored massage in a calm, welcoming space in Upton.<br>Founded by therapist Kylie Mellors.</p>'
);
html = html.replace(
  /<p class="lede">Family-run[^<]*<\/p>/,
  '<p class="lede">Tailored massage in a calm, welcoming space in Upton.<br>Founded by therapist Kylie Mellors.</p>'
);

html = html.replace(
  /src="[^"]*chiro-landing\.jpg"[^>]*>/,
  `src="${A}/hero-collage.png" alt="Massage treatment collage for Healing Muscles Northampton.">`
);
html = html.replace(
  /alt="Illustrative treatment photograph\. Not a photograph of Healing Muscles Northampton staff or premises\."><\/figure>\s*<div class="hero-cards">/,
  `alt="Massage treatment collage for Healing Muscles Northampton."></figure>\n<div class="hero-cards">`
);

html = html.replace(
  /<div class="hero-cards">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<section class="wrap statement promo-statement mist"/,
  `<div class="hero-cards"><a class="hero-card" href="#new-patient"><span class="hero-face"><span class="mini" aria-hidden="true"></span><span class="hero-copy"><strong>New client treatment</strong><em>From £80 · 1 hour</em></span><span class="hero-go" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span></a><a class="hero-card" href="tel:${tel}"><span class="hero-face"><span class="mini" aria-hidden="true"></span><span class="hero-copy"><strong>${telNice}</strong><em>Phone</em></span><span class="hero-go" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span></a><a class="hero-card" href="#contact"><span class="hero-face"><span class="mini" aria-hidden="true"></span><span class="hero-copy"><strong>187 West Street, Upton, Northampton</strong><em>Location</em></span><span class="hero-go" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span></a></div>
</div>
</div>
<section class="wrap statement promo-statement mist"`
);

html = html.replace(
  /<span class="promo-lede-full">[\s\S]*?<\/span><span class="promo-lede-short">[\s\S]*?<\/span>/,
  '<span class="promo-lede-full">New client assessment &amp; treatment is £80 for one hour on Fresha. Other treatments are listed when you book. Adults only.</span><span class="promo-lede-short">New client £80 · Book online.</span>'
);

html = html.replace(
  /<button class="rail rail-consult"[\s\S]*?<\/button>\s*<button class="rail rail-whitening"[\s\S]*?<\/button>\s*<button class="rail rail-denplan"[\s\S]*?<\/button>/,
  `<button class="rail rail-consult" type="button" role="tab" data-stat="consult" aria-pressed="true"><span class="rail-label">New client</span><span class="rail-price">£80</span></button>
<button class="rail rail-whitening" type="button" role="tab" data-stat="whitening" aria-pressed="false"><span class="rail-label">Massage menu</span><span class="rail-price">Book</span></button>
<button class="rail rail-denplan" type="button" role="tab" data-stat="denplan" aria-pressed="false"><span class="rail-label">Open evenings</span><span class="rail-price">Mon–Fri</span></button>`
);

html = html.replace(
  /<div class="stat-show show-whitening">[\s\S]*?<\/div>\s*<div class="stat-show show-consult">[\s\S]*?<\/div>\s*<div class="stat-show show-denplan">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/,
  `<div class="stat-show show-whitening">
<div class="offer-copy">
<h3>Massage menu</h3>
<p class="stat-num">Book</p>
<ul>
<li>Bespoke deep tissue &amp; sports massage</li>
<li>Targeted treatments &amp; TMJ / upper body release</li>
<li>Full list on Fresha when you book</li>
</ul>
<a class="button" ${bookAttrs}>Book</a>
</div>
<div class="offer-side">
<figure class="offer-visual"><img src="${A}/physio-landing.png" alt="Illustrative treatment photograph. Not a photograph of Healing Muscles Northampton staff or premises."></figure>
</div>
</div>
<div class="stat-show show-consult">
<div class="offer-copy">
<h3>New client assessment &amp; treatment</h3>
<p class="stat-num">£80</p>
<ul>
<li>1 hour on Fresha</li>
<li>Tailored to your needs</li>
<li>Adults only</li>
</ul>
<a class="button" ${bookAttrs}>Book</a>
</div>
<div class="offer-side">
<figure class="offer-visual"><img src="${A}/hero-collage.png" alt="Massage treatment collage for Healing Muscles Northampton."></figure>
</div>
</div>
<div class="stat-show show-denplan">
<div class="offer-copy">
<h3>Evening appointments</h3>
<p class="stat-num">Mon–Fri</p>
<ul>
<li>Monday to Friday 10:00–20:00</li>
<li>Saturday 10:00–16:00</li>
<li>Sunday closed</li>
</ul>
<a class="button" ${bookAttrs}>Book</a>
</div>
<div class="offer-side">
<figure class="offer-visual"><img src="${A}/review-arm.png" alt="Illustrative treatment photograph. Not a photograph of Healing Muscles Northampton staff or premises."></figure>
</div>
</div>
</div>
</div>
</section>`
);

html = html.replace(
  /<p class="lede">Massage care, nutritional counselling[\s\S]*?<\/p>/,
  '<p class="lede">New client treatments, targeted work, a full massage menu and pregnancy wellness — booked through Fresha for Healing Muscles Northampton.</p>'
);
html = html.replace(
  /<p class="lede">Typical massage concerns[\s\S]*?<\/p>/,
  '<p class="lede">Treatments from the Fresha listing for Healing Muscles Northampton in Upton.</p>'
);

const serviceButtons = `<nav class="service-links" aria-label="Services"><button type="button">New client treatment</button><button type="button">Targeted treatments</button><button type="button">Massage menu</button><button type="button">Pregnancy wellness</button><button type="button">Deep tissue &amp; sports</button></nav>`;
const serviceAccordion = `<div class="service-accordion"><details name="listed-services"><summary>New client treatment</summary><div class="accordion-panel"><figure class="tile-media"><img src="${A}/hero-collage.png" alt="Massage treatment collage for Healing Muscles Northampton."></figure><p class="shot-copy"><span><strong>New client assessment &amp; treatment</strong><em>One hour at £80 on Fresha — a tailored first visit to understand your needs and begin treatment.</em></span><a class="button" href="#service-new-client">More Information</a></p></div></details><details name="listed-services"><summary>Targeted treatments</summary><div class="accordion-panel"><figure class="tile-media"><img src="${A}/physio-landing.png" alt="Illustrative treatment photograph. Not a photograph of Healing Muscles Northampton staff or premises."></figure><p class="shot-copy"><span><strong>Targeted treatments</strong><em>Focused sessions for problem areas — including TMJ and upper body release mentioned by clients.</em></span><a class="button" href="#service-targeted">More Information</a></p></div></details><details name="listed-services"><summary>Massage menu</summary><div class="accordion-panel"><figure class="tile-media"><img src="${A}/service-tile.png" alt="Illustrative treatment photograph. Not a photograph of Healing Muscles Northampton staff or premises."></figure><p class="shot-copy"><span><strong>Massage menu</strong><em>Choose from the full treatment menu when you book online, with instant confirmation on Fresha.</em></span><a class="button" href="#service-menu">More Information</a></p></div></details><details name="listed-services"><summary>Pregnancy wellness</summary><div class="accordion-panel"><figure class="tile-media"><img src="${A}/service-tile-2.png" alt="Illustrative treatment photograph. Not a photograph of Healing Muscles Northampton staff or premises."></figure><p class="shot-copy"><span><strong>Pregnancy wellness massage</strong><em>Mother-to-be and pregnancy wellness massage in a warm, welcoming treatment room.</em></span><a class="button" href="#service-pregnancy">More Information</a></p></div></details><details name="listed-services"><summary>Deep tissue &amp; sports</summary><div class="accordion-panel"><figure class="tile-media"><img src="${A}/review-shoulder.png" alt="Illustrative treatment photograph. Not a photograph of Healing Muscles Northampton staff or premises."></figure><p class="shot-copy"><span><strong>Deep tissue &amp; sports</strong><em>Bespoke deep tissue and sports massage for physical jobs, training and stubborn tension.</em></span><a class="button" href="#service-deep-tissue">More Information</a></p></div></details><a class="button accordion-book" ${bookAttrs}>Book appointment</a></div>`;
const serviceShots = `<div class="shots"><div class="shot"><figure class="tile-media"><img src="${A}/hero-collage.png" alt="Massage treatment collage for Healing Muscles Northampton."></figure><p class="shot-copy"><span><strong>New client assessment &amp; treatment</strong><em>One hour at £80 on Fresha — a tailored first visit to understand your needs and begin treatment.</em></span><a class="button" href="#service-new-client">More Information</a></p></div><div class="shot"><figure class="tile-media"><img src="${A}/physio-landing.png" alt="Illustrative treatment photograph. Not a photograph of Healing Muscles Northampton staff or premises."></figure><p class="shot-copy"><span><strong>Targeted treatments</strong><em>Focused sessions for problem areas — including TMJ and upper body release mentioned by clients.</em></span><a class="button" href="#service-targeted">More Information</a></p></div><div class="shot"><figure class="tile-media"><img src="${A}/service-tile.png" alt="Illustrative treatment photograph. Not a photograph of Healing Muscles Northampton staff or premises."></figure><p class="shot-copy"><span><strong>Massage menu</strong><em>Choose from the full treatment menu when you book online, with instant confirmation on Fresha.</em></span><a class="button" href="#service-menu">More Information</a></p></div><div class="shot"><figure class="tile-media"><img src="${A}/service-tile-2.png" alt="Illustrative treatment photograph. Not a photograph of Healing Muscles Northampton staff or premises."></figure><p class="shot-copy"><span><strong>Pregnancy wellness massage</strong><em>Mother-to-be and pregnancy wellness massage in a warm, welcoming treatment room.</em></span><a class="button" href="#service-pregnancy">More Information</a></p></div><div class="shot"><figure class="tile-media"><img src="${A}/review-shoulder.png" alt="Illustrative treatment photograph. Not a photograph of Healing Muscles Northampton staff or premises."></figure><p class="shot-copy"><span><strong>Deep tissue &amp; sports</strong><em>Bespoke deep tissue and sports massage for physical jobs, training and stubborn tension.</em></span><a class="button" href="#service-deep-tissue">More Information</a></p></div></div>`;

html = html.replace(/<nav class="service-links"[\s\S]*?<\/nav>/, serviceButtons);
html = html.replace(/<div class="service-accordion">[\s\S]*?<\/div>\s*<\/div>\s*<div class="shots">/, `${serviceAccordion}\n</div>\n${serviceShots.replace('<div class="shots">', '<<<SHOTS>>>')}`);
// fix accidental marker approach - redo shots replace cleanly
html = html.replace(/<<<SHOTS>>>[\s\S]*?<\/div>\s*<\/div>\s*<\/section>\s*<section class="section mist meet">/, `${serviceShots.slice('<div class="shots">'.length)}\n</div>\n</section>\n<section class="section mist meet">`);

// If shots still old, force replace
if (html.includes('Back pain') || html.includes('Neck pain')) {
  html = html.replace(
    /<nav class="service-links" aria-label="Services">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>\s*<section class="section mist meet">/,
    `${serviceButtons}\n${serviceAccordion}\n</div>\n${serviceShots}\n</div>\n</section>\n<section class="section mist meet">`
  );
}

html = html.replace(
  /<h2>Meet the massage therapists<\/h2>|<h2>Meet the chiropractors<\/h2>|<h2>Meet the specialists<\/h2>/,
  '<h2>Meet the therapist</h2>'
);
html = html.replace(
  /Our specialists/,
  'Your therapist'
);

html = html.replace(
  /<div class="meet-stage">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>\s*<section class="section reviews">/,
  `<div class="meet-stage">${meetSlides}</div>\n</div>\n</section>\n<section class="section reviews">`
);

html = html.replace(
  /<a class="button review-leave-link"[^>]*>Leave a Google review<\/a>\s*<div class="review-board"[\s\S]*?<\/div><\/div>\s*<\/div>\s*<\/section>\s*<section class="section book"/,
  `<a class="button review-leave-link" href="${freshaUrl}" target="_blank" rel="noopener noreferrer">See Fresha reviews</a>\n${reviewsBlock}\n</div>\n</section>\n<section class="section book"`
);

html = html.replace(
  /Call <a href="[^"]*">[^<]*<\/a> to enquire or book\.[\s\S]*?This preview does not send what you type\./,
  `Book online via the demo booking page, or call <a href="tel:${tel}">${telNice}</a>. Hours are Monday to Friday 10:00–20:00 and Saturday 10:00–16:00. This preview does not send what you type.`
);

html = html.replace(
  /<div class="book-paths" aria-label="Ways to get in touch">[\s\S]*?<\/div>\s*<div class="book-fields">/,
  `<div class="book-paths" aria-label="Ways to get in touch">
<div class="book-path is-primary">
<strong>Book online</strong>
<p>Open the Parley demo booking page for Healing Muscles Northampton.</p>
<a class="button" ${bookAttrs}>Book appointment</a>
</div>
<div class="book-path">
<strong>Call or enquire</strong>
<p>Phone ${telNice}, or use the form — this preview does not submit.</p>
<a class="button" href="tel:${tel}">${telNice}</a>
</div>
</div>
<div class="book-fields">`
);

html = html.replace(
  /<p class="hours-note">[^<]*<\/p>\s*<p class="hours-live" data-hours="[^"]*">/,
  `<p class="hours-note">Hours from the Fresha listing for Healing Muscles Northampton. Sunday closed.</p>
<p class="hours-live" data-hours="Monday, 10:00–20:00, Tuesday, 10:00–20:00, Wednesday, 10:00–20:00, Thursday, 10:00–20:00, Friday, 10:00–20:00, Saturday, 10:00–16:00">`
);
html = html.replace(
  /<ul class="hours-list">[\s\S]*?<\/ul>\s*<a class="button book-call"[^>]*>[^<]*<\/a>/,
  `<ul class="hours-list">
<li><span>Monday</span><strong>10:00 – 20:00</strong></li>
<li><span>Tuesday</span><strong>10:00 – 20:00</strong></li>
<li><span>Wednesday</span><strong>10:00 – 20:00</strong></li>
<li><span>Thursday</span><strong>10:00 – 20:00</strong></li>
<li><span>Friday</span><strong>10:00 – 20:00</strong></li>
<li><span>Saturday</span><strong>10:00 – 16:00</strong></li>
<li><span>Sunday</span><strong>Closed</strong></li>
</ul>
<a class="button book-call" ${bookAttrs}>Book appointment</a>`
);

html = html.replace(
  /<div class="social-track">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>\s*<\/section>\s*<section id="services"/,
  `<div class="social-track">
<div class="social-set"><article class="post"><div class="post-art" aria-hidden="true"><span class="post-geo"></span><span class="post-geo post-geo-b"></span></div><div class="post-body"><p class="flag">Healing Muscles</p><h3>Upton</h3><p>187 West Street — calm massage in Northampton.</p></div></article><article class="post"><div class="post-art" aria-hidden="true"><span class="post-geo"></span><span class="post-geo post-geo-b"></span></div><div class="post-body"><p class="flag">Healing Muscles</p><h3>Kylie Mellors</h3><p>Founder &amp; senior therapist · 5.0 on Fresha.</p></div></article><article class="post"><div class="post-art" aria-hidden="true"><span class="post-geo"></span><span class="post-geo post-geo-b"></span></div><div class="post-body"><p class="flag">Healing Muscles</p><h3>368 reviews</h3><p>Five-star clients on Fresha praise tailored care.</p></div></article><article class="post"><div class="post-art" aria-hidden="true"><span class="post-geo"></span><span class="post-geo post-geo-b"></span></div><div class="post-body"><p class="flag">Healing Muscles</p><h3>Book online</h3><p>Demo booking page for this concept.</p></div></article><article class="post"><div class="post-art" aria-hidden="true"><span class="post-geo"></span><span class="post-geo post-geo-b"></span></div><div class="post-body"><p class="flag">Layout</p><h3>Sample tiles</h3><p>These tiles are not posts from a live account.</p></div></article></div>
<div class="social-set" aria-hidden="true"><article class="post"><div class="post-art" aria-hidden="true"><span class="post-geo"></span><span class="post-geo post-geo-b"></span></div><div class="post-body"><p class="flag">Healing Muscles</p><h3>Upton</h3><p>187 West Street — calm massage in Northampton.</p></div></article><article class="post"><div class="post-art" aria-hidden="true"><span class="post-geo"></span><span class="post-geo post-geo-b"></span></div><div class="post-body"><p class="flag">Healing Muscles</p><h3>Kylie Mellors</h3><p>Founder &amp; senior therapist · 5.0 on Fresha.</p></div></article><article class="post"><div class="post-art" aria-hidden="true"><span class="post-geo"></span><span class="post-geo post-geo-b"></span></div><div class="post-body"><p class="flag">Healing Muscles</p><h3>368 reviews</h3><p>Five-star clients on Fresha praise tailored care.</p></div></article><article class="post"><div class="post-art" aria-hidden="true"><span class="post-geo"></span><span class="post-geo post-geo-b"></span></div><div class="post-body"><p class="flag">Healing Muscles</p><h3>Book online</h3><p>Demo booking page for this concept.</p></div></article><article class="post"><div class="post-art" aria-hidden="true"><span class="post-geo"></span><span class="post-geo post-geo-b"></span></div><div class="post-body"><p class="flag">Layout</p><h3>Sample tiles</h3><p>These tiles are not posts from a live account.</p></div></article></div>
</div>
</div>
</section>
</section>
<section id="services"`
);

html = html.replace(
  /<h1>Healing Muscles Northampton<\/h1>\s*<div class="about-pair">\s*<div class="about-lead"><p class="lede">[\s\S]*?<\/div>\s*<\/div>/,
  `<h1>Healing Muscles Northampton</h1>
<div class="about-pair">
<div class="about-lead"><p class="lede">At Healing Muscles Northampton, nestled in Overstone, I provide a tranquil haven where you can unwind and rejuvenate. Whether you're seeking relief from muscle tension or simply wish to indulge in some well-deserved self-care, my tailored treatments are designed to meet your unique needs.</p><p class="lede">Each session is crafted to ensure you leave feeling relaxed, refreshed, and confident in your body's well-being. The clinic is at 187 West Street, Upton — adults only, with parking available and wheelchair access noted on Fresha.</p></div>
<figure class="about-photo"><img src="${A}/about-exterior.png" alt="Illustrative clinic exterior. Not a photograph of Healing Muscles Northampton premises."><figcaption class="flag">Meet the Team</figcaption></figure>
</div>`
);

html = html.replace(
  /<div class="wrap team-board" data-person="0">[\s\S]*?<\/div><\/div>\s*<\/section>\s*<section id="contact"/,
  `<div class="wrap team-board" data-person="0"><div class="team-rail" aria-hidden="true"><span class="team-fall"></span></div><div class="people">${peopleCards}</div></div>
</section>
<section id="contact"`
);

html = html.replace(
  /<div class="contact-book">[\s\S]*?<\/div>\s*<div class="info-grid">/,
  `<div class="contact-book">
<div>
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><rect x="2.2" y="3.2" width="11.6" height="10.6" rx="1.4" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M2.2 6.4h11.6M5.2 2v2.6M10.8 2v2.6" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg> Appointments</p>
<h2>Book online</h2>
<p>Use the Parley demo booking page for this concept. The live practice also takes bookings on Fresha.</p>
</div>
<div class="contact-book-actions">
<a class="button solid" ${bookAttrs}>Book appointment</a>
<a class="button" href="tel:${tel}">Call ${telNice}</a>
</div>
</div>
<div class="info-grid">`
);

html = html.replace(
  /<p class="flag">Demo layout figures[\s\S]*?<\/p>\s*<p class="lede">[\s\S]*?<\/p>\s*<div class="fee-pair">[\s\S]*?<\/div>/,
  `<p class="flag">Fees from the Fresha listing for Healing Muscles Northampton</p>
<p class="lede">New client assessment &amp; treatment is published at £80 for one hour. Other treatments appear on the booking menu.</p>
<div class="fee-pair"><article class="fee-card"><span class="fee-gem"><strong>£80</strong></span><span class="fee-gem fee-gem-sm" aria-hidden="true"></span><h2>New client assessment &amp; treatment</h2><p class="fee-k">1 hour · Fresha</p><ul class="fee-includes"><li>First visit assessment</li><li>Tailored treatment</li><li>Adults only</li></ul><a class="button solid fee-book" ${bookAttrs}>Book appointment</a></article><article class="fee-card"><span class="fee-gem"><strong>Menu</strong></span><span class="fee-gem fee-gem-sm" aria-hidden="true"></span><h2>Massage &amp; targeted treatments</h2><p class="fee-k">Book online</p><ul class="fee-includes"><li>Deep tissue &amp; sports</li><li>Pregnancy wellness</li><li>See full list when booking</li></ul><a class="button solid fee-book" ${bookAttrs}>Book appointment</a></article></div>`
);

html = html.replace(
  /src="https:\/\/maps\.google\.com\/maps\?q=[^"]+"/,
  `src="https://maps.google.com/maps?q=${mapQuery}&hl=en&z=15&output=embed"`
);

// Clean leftover Marc / Restore / demo-profile language
html = html.replace(/Marc Muncila/g, 'Kylie Mellors');
html = html.replace(/Alex Carter|Sam Reed/g, 'Kylie Mellors');
html = html.replace(/UCA DC of the Year 2021/g, 'Founder & Senior Therapist');
html = html.replace(/portrait-marc\.jpg/g, 'portrait-kylie.jpg');
html = html.replace(/portrait-alex\.png|portrait-sam\.png/g, 'portrait-kylie.jpg');

// Hide empty meet nav arrows usefulness is fine with one slide
html = html.replace(
  /<div class="meet-nav">[\s\S]*?<\/div>\s*<\/div>\s*<div class="meet-stage">/,
  '</div>\n<div class="meet-stage">'
);

// Book portrait → Kylie
html = html.replace(
  /src="[^"]*book-portrait\.png"/g,
  `src="${A}/portrait-kylie.jpg"`
);

const outPath = path.join(outDir, 'index.html');
fs.writeFileSync(outPath, html);

const hash = crypto.createHash('sha256').update(html).digest('hex');
const status = {
  slug,
  status: 'PREVIEW_READY',
  previewPath: `/preview/${slug}/index.html`,
  contentHash: hash,
  demo: false,
  instructionsVersion: 'manual-adaptation',
  updatedAt: new Date().toISOString().slice(0, 10),
};
fs.writeFileSync(path.join(outDir, 'status.json'), JSON.stringify(status, null, 2) + '\n');

const site = {
  slug,
  sector: 'massage',
  status: 'concept',
  demo: false,
  approvedInstructionsVersion: 'manual-adaptation',
  template: { id: 'care-modern', version: '1.0.0' },
  brand: {
    accent,
    logo: `${A}/logo.png`,
  },
  sources: [
    {
      id: 'fresha',
      url: freshaUrl,
      checkedAt: '2026-11-02',
    },
    {
      id: 'directory',
      url: 'https://northampton.cylex-uk.co.uk/company/healing-muscles-28354300.html',
      checkedAt: '2026-11-02',
    },
  ],
  business: {
    name: { value: 'Healing Muscles Northampton', sourceId: 'fresha' },
    location: { value: 'Upton, Northampton', sourceId: 'fresha' },
    phone: { value: telNice, sourceId: 'directory' },
    address: {
      value: '187 West Street, Upton, Northampton',
      sourceId: 'fresha',
    },
    website: { value: freshaUrl, sourceId: 'fresha' },
    hours: {
      value:
        'Monday to Friday 10:00–20:00, Saturday 10:00–16:00, Sunday closed.',
      sourceId: 'fresha',
    },
  },
  notes:
    'Manual adaptation of public/preview/muncila-chiropractic/. Do not regenerate this slug. Logo, hero collage and Kylie NL Awards portrait supplied by user. Accent #61534A from logo brown; pale #ebe6e2. Hero figure background #e8e8e8 with theme pale gradient retained. BOOK CTAs use Parley LeadConnector demo https://api.leadconnectorhq.com/booking/parley-demo-clinic/bp/healing-muscles-northampton-demo. Phone 07856 268245 from directory listings (not shown on Fresha page scraped). New client fee £80 / 1 hour from Fresha. Team is Kylie only.',
};
fs.writeFileSync(
  path.join(root, 'website-factory/sites', `${slug}.json`),
  JSON.stringify(site, null, 2) + '\n'
);

// Register in preview index if present
const indexPath = path.join(root, 'public/preview/index.json');
if (fs.existsSync(indexPath)) {
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const entry = {
    slug,
    status: 'PREVIEW_READY',
    sheetStatus: 'Preview ready',
    previewPath: `/preview/${slug}/index.html`,
    template: { id: 'care-modern', version: '1.0.0' },
    instructionsVersion: 'manual-adaptation',
    contentHash: hash,
    demo: false,
    message: '',
    updatedAt: new Date().toISOString(),
  };
  const list = Array.isArray(index.previews) ? index.previews : [];
  const i = list.findIndex((p) => p.slug === slug);
  if (i >= 0) list[i] = entry;
  else list.push(entry);
  list.sort((a, b) => a.slug.localeCompare(b.slug));
  index.previews = list;
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n');
}

console.log(JSON.stringify({ ok: true, slug, previewPath: status.previewPath, contentHash: hash }, null, 2));
