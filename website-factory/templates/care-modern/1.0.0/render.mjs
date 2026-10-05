// Draft multi-page clinic layout. Brand colour comes only from site.brand.accent.
// No shop, cart, invented reviews, ratings or statistics.
export function render(s, e) {
  const b = s.business;
  const name = e(b.name.value);
  const location = e(b.location.value);
  const accent = /^#[0-9a-fA-F]{6}$/.test(s.brand?.accent || '') ? s.brand.accent : '#1f4b99';
  const rgb = [parseInt(accent.slice(1, 3), 16), parseInt(accent.slice(3, 5), 16), parseInt(accent.slice(5, 7), 16)];
  const mix = (target, t) => '#' + rgb.map((channel, index) => Math.max(0, Math.min(255, Math.round(channel + (target[index] - channel) * t))).toString(16).padStart(2, '0')).join('');
  const lum = rgb.map(channel => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  const bright = 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2] > 0.62;
  const ink = mix([17, 24, 32], 0.82);
  const onAccent = bright ? ink : '#ffffff';
  const paper = mix([247, 249, 252], 0.92);
  const wash = mix([255, 255, 255], 0.86);
  const line = mix([255, 255, 255], 0.78);
  const muted = mix([70, 84, 99], 0.55);
  const deep = mix([7, 12, 20], 0.78);
  const initial = e((b.name.value || '•').trim().charAt(0).toUpperCase());
  const logo = s.assets.logo
    ? `<img class="logo" src="${e(s.assets.logo.path)}" alt="${e(s.assets.logo.alt)}">`
    : `<span class="wordmark"><span class="mark" aria-hidden="true">${initial}</span><span><strong>${name}</strong><small>${location}</small></span></span>`;
  const phoneDigits = (b.phone?.value || '').replace(/[^\d+]/g, '');
  const phoneOk = /^\+?\d{7,15}$/.test(phoneDigits);
  const phoneLink = phoneOk ? `<a class="button" href="tel:${phoneDigits}">Call ${e(b.phone.value)}</a>` : '';
  const website = b.website && /^https:\/\//.test(b.website.value)
    ? `<a href="${e(b.website.value)}" rel="noopener noreferrer">Official website</a>`
    : '';
  const services = Array.isArray(b.services) ? b.services : [];
  const pictures = Array.isArray(s.assets?.images) ? s.assets.images : [];
  const frame = (image, caption, className) => image
    ? `<figure class="${className}"><img src="${e(image.path)}" alt="${e(image.alt)}"><figcaption>Illustrative image. Not verified as this business’s premises or staff.</figcaption></figure>`
    : `<figure class="${className} frame" role="img" aria-label="${caption}"><figcaption>${caption}</figcaption></figure>`;
  const heroMedia = frame(pictures[0], 'Photograph awaiting an approved category image.', 'hero-media');
  const wideMedia = frame(pictures[1] || pictures[0], 'Photograph awaiting an approved category image.', 'wide-media');
  const sideMedia = frame(pictures[2] || pictures[0], 'Photograph awaiting an approved category image.', 'side-media');
  const tileMedia = frame(pictures[0], 'Photograph awaiting an approved category image.', 'tile-media');
  const serviceCards = services.length
    ? services.map((service, index) => `<article class="tile"><span>${String(index + 1).padStart(2, '0')}</span><h3>${e(service.value)}</h3><a href="#services">View service</a></article>`).join('')
    : '<p class="pending">Service details awaiting confirmation.</p>';
  const serviceTiles = services.length
    ? services.map(service => `<article class="service-tile">${tileMedia}<div><h3>${e(service.value)}</h3><p>Listed for ${name}. No price, outcome or extra treatment has been added.</p></div></article>`).join('')
    : '';
  const firstService = services[0] ? e(services[0].value) : 'Services';
  const restServices = services.slice(1).map(service => `<article class="service-block"><h2>${e(service.value)}</h2><p>Also on the published list for ${name}.</p></article>`).join('');
  const examples = (Array.isArray(s.exampleSections) ? s.exampleSections : [])
    .map(section => `<aside class="example"><small>ILLUSTRATIVE CONTENT — NOT A VERIFIED BUSINESS CLAIM</small><h2>${e(section.title)}</h2><p>${e(section.body)}</p></aside>`)
    .join('');
  const people = (Array.isArray(s.examplePeople) ? s.examplePeople : [])
    .filter(person => person && person.name && person.detail);
  const personCards = people.map(person => `<article class="person"><div class="thumb" aria-hidden="true">${e(String(person.name).trim().charAt(0).toUpperCase())}</div><div><p class="flag">Illustrative layout — not a verified member of staff</p><h2>${e(person.name)}</h2><p class="role">${e(person.role || '')}</p><p>${e(person.detail)}</p></div></article>`).join('');
  const teamBody = personCards
    ? `<div class="people">${personCards}</div>`
    : '<p class="pending">No individual team members were published, so none are shown here.</p>';
  const mapQuery = b.address?.value || b.location?.value || '';
  const map = mapQuery
    ? `<iframe class="map" title="Map of the published address" width="600" height="420" src="${e('https://maps.google.com/maps?q=' + encodeURIComponent(mapQuery) + '&hl=en&z=15&output=embed')}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
    : '<p class="pending">Address awaiting confirmation, so no map is shown.</p>';
  const info = [
    phoneOk ? `<article class="info-card"><h2>Phone</h2><p><a href="tel:${phoneDigits}">${e(b.phone.value)}</a></p></article>` : '',
    b.address ? `<article class="info-card"><h2>Address</h2><p>${e(b.address.value)}</p></article>` : '',
    b.hours ? `<article class="info-card"><h2>Hours</h2><p>${e(b.hours.value)}</p></article>` : '',
    website ? `<article class="info-card"><h2>Website</h2><p>${website}</p></article>` : ''
  ].join('');
  const banner = s.demo ? 'FICTIONAL DEMO' : 'CONCEPT WEBSITE';
  const mapNote = s.demo
    ? 'Map of the fictional address. It may not match a real place.'
    : 'Map of the published address.';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive">
<meta name="generator" content="parley-website-factory care-modern 1.0.0">
<title>${name} — concept by Parley</title>
<style>
:root{color-scheme:light;--accent:${accent};--on:${onAccent};--ink:${ink};--muted:${muted};--line:${line};--paper:${paper};--wash:${wash};--deep:${deep}}
*{box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:88px}
body{margin:0;background:#fff;color:var(--ink);font:16px/1.6 "Avenir Next","Segoe UI",sans-serif;overflow-x:clip}
h1,h2,h3,p{margin:0;overflow-wrap:break-word}
h1,h2,h3{font-weight:650;letter-spacing:-.03em;line-height:1.16}
h1{font-size:clamp(36px,5vw,64px);max-width:14ch}
h2{font-size:clamp(28px,3vw,40px)}
h3{font-size:20px}
a{color:inherit}
img{max-width:100%;display:block}
.skip{position:absolute;left:12px;top:-48px;background:#fff;padding:8px 12px;z-index:9}
.skip:focus{top:12px}
.banner{margin:0;padding:10px 16px;background:var(--deep);color:#fff;text-align:center;font-size:12px;letter-spacing:.06em;text-transform:uppercase}
.nav-toggle{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.site-header{position:sticky;top:0;z-index:8;display:flex;align-items:center;justify-content:space-between;gap:16px;width:min(1120px,calc(100% - 40px));margin:auto;min-height:76px;background:#fff}
.brand{display:flex;align-items:center;min-height:44px;text-decoration:none}
.logo{max-width:min(200px,52vw);max-height:48px;object-fit:contain}
.wordmark{display:flex;align-items:center;gap:10px}
.wordmark strong,.wordmark small{display:block}
.wordmark small{color:var(--muted);font-size:13px;letter-spacing:0;font-weight:500}
.mark{display:grid;place-items:center;width:40px;height:40px;border-radius:12px;background:var(--accent);color:var(--on);font-weight:700}
.site-header nav ul{display:flex;align-items:center;gap:6px;margin:0;padding:0;list-style:none}
.site-header nav a,.menu-button,.button{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 14px;border-radius:999px;text-decoration:none}
.site-header nav a{color:var(--muted)}
.site-header nav a[href="#home"],
body:has(#services:target) .site-header nav a[href="#services"],
body:has(#team:target) .site-header nav a[href="#team"],
body:has(#contact:target) .site-header nav a[href="#contact"]{color:var(--ink);font-weight:700}
body:has(#services:target) .site-header nav a[href="#home"],
body:has(#team:target) .site-header nav a[href="#home"],
body:has(#contact:target) .site-header nav a[href="#home"]{color:var(--muted);font-weight:500}
.button{background:var(--accent);color:var(--on);font-weight:680;border:0}
.site-header nav .button{display:none}
.menu-button{display:none;border:1px solid var(--line);background:#fff;cursor:pointer}
.menu-button .close{display:none}
.nav-toggle:checked ~ .site-header .menu-button .open{display:none}
.nav-toggle:checked ~ .site-header .menu-button .close{display:inline}
.wrap{width:min(1120px,calc(100% - 40px));margin:auto}
.page{display:none;padding:12px 0 72px}
#home:target,#services:target,#team:target,#contact:target{display:block}
body:not(:has(#services:target)):not(:has(#team:target)):not(:has(#contact:target)) #home{display:block}
.hero{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(280px,.95fr);gap:36px;align-items:center;padding:28px 0 8px}
.eyebrow{margin:0 0 12px;color:var(--accent);font-size:13px;font-weight:750;letter-spacing:.12em;text-transform:uppercase}
.lede{max-width:38rem;margin:16px 0 24px;color:var(--muted);font-size:18px}
.hero-media,.wide-media,.side-media,.tile-media,.frame{position:relative;overflow:hidden;border-radius:20px;background:#e7eef5}
.frame{border:1px solid var(--line)}
.frame::before{content:"";position:absolute;left:18px;top:18px;width:42px;height:4px;border-radius:99px;background:var(--accent)}
.hero-media{min-height:460px}
.wide-media{min-height:360px;margin:22px 0}
.side-media{min-height:280px}
.tile-media{min-height:168px;border-radius:18px 18px 0 0}
.hero-media img,.wide-media img,.side-media img,.tile-media img{width:100%;height:100%;object-fit:cover;position:absolute;inset:0}
.hero-media figcaption,.wide-media figcaption,.side-media figcaption,.tile-media figcaption{position:absolute;left:16px;right:16px;bottom:16px;color:var(--muted);font-size:13px}
.hero-media:not(.frame) figcaption,.wide-media:not(.frame) figcaption,.side-media:not(.frame) figcaption,.tile-media:not(.frame) figcaption{color:#fff;text-shadow:0 1px 2px rgb(0 0 0 / 35%)}
.trio,.tiles,.info-grid{display:grid;gap:16px}
.trio{grid-template-columns:repeat(3,minmax(0,1fr));margin-top:28px}
.tiles{grid-template-columns:repeat(3,minmax(0,1fr))}
.tile,.info-card,.sheet{padding:22px;border:1px solid var(--line);border-radius:18px;background:#fff;box-shadow:0 12px 30px rgb(16 24 40 / 6%)}
.service-tile{overflow:hidden;border:1px solid var(--line);border-radius:18px;background:#fff;box-shadow:0 12px 30px rgb(16 24 40 / 6%)}
.service-tile div{padding:18px 22px 22px}
.service-tile p{margin-top:8px;color:var(--muted)}
.tile span,.role{display:block;margin-bottom:10px;color:var(--accent);font-size:13px;font-weight:750;letter-spacing:.08em;text-transform:uppercase}
.tile a,.text-link{color:var(--accent);font-weight:680}
.band{margin-top:28px;padding:64px 0;background:var(--paper)}
.statement{padding:72px 0}
.statement h2{max-width:18em;font-size:clamp(32px,4vw,52px)}
.split{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(260px,.95fr);gap:28px;align-items:center}
.example{padding:22px;border:1px dashed var(--muted);border-radius:18px;background:#fff}
.example small,.flag{display:block;margin-bottom:8px;color:var(--muted);font-size:12px;font-weight:750;letter-spacing:.04em}
.visit-row{display:flex;flex-wrap:wrap;gap:18px 28px;align-items:center;justify-content:space-between}
.page-intro{padding-bottom:8px}
.service-block,.service-close{margin-top:36px}
.people{display:grid;gap:0}
.person{display:grid;grid-template-columns:168px minmax(0,1fr);gap:28px;align-items:start;padding:22px 0;border-bottom:1px solid var(--line)}
.thumb{display:grid;place-items:center;width:168px;height:196px;border-radius:18px;background:#e7eef5;border:1px solid var(--line);color:var(--accent);font-size:42px;font-weight:680}
.map-frame{margin:22px 0 10px;border:1px solid var(--line);border-radius:20px;overflow:hidden;background:#e7eef5}
.map{display:block;width:100%;height:420px;border:0}
.map-note{margin-bottom:22px;color:var(--muted);font-size:14px}
.info-grid{grid-template-columns:repeat(3,minmax(0,1fr));margin:8px 0 28px}
.sheet{display:grid;gap:12px}
.sheet label{display:grid;gap:6px;color:var(--muted);font-size:14px}
.sheet input,.sheet textarea{width:100%;min-height:46px;padding:10px 12px;border:1px solid var(--line);border-radius:12px;font:inherit;color:var(--ink)}
.sheet textarea{min-height:120px;resize:vertical}
.pending{color:var(--muted)}
.site-footer{background:var(--deep);color:#fff;padding:48px 0 24px}
.foot{display:grid;grid-template-columns:1.4fr .7fr 1fr;gap:28px}
.site-footer a{text-decoration:none}
.site-footer ul{margin:8px 0 0;padding:0;list-style:none}
.site-footer li{margin:6px 0}
.site-footer p,.site-footer small{color:rgb(255 255 255 / 76%)}
.legal{display:block;margin-top:22px;color:rgb(255 255 255 / 62%);font-size:13px}
a:focus-visible,.button:focus-visible,.menu-button:focus-visible,input:focus-visible,textarea:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
@media (max-width:800px){
  html{scroll-padding-top:76px}
  .site-header,.wrap{width:min(100% - 32px,1120px)}
  .site-header{min-height:68px}
  .site-header nav{position:absolute;left:16px;right:16px;top:68px}
  .site-header nav ul{display:none;flex-direction:column;align-items:stretch;padding:10px;border:1px solid var(--line);border-radius:16px;background:#fff;box-shadow:0 16px 40px rgb(16 24 40 / 12%)}
  .nav-toggle:checked ~ .site-header nav ul{display:flex}
  .menu-button{display:inline-flex}
  .header-cta{display:none}
  .site-header nav .button{display:inline-flex}
  .hero,.split,.trio,.tiles,.info-grid,.foot{grid-template-columns:1fr}
  .hero{padding-top:8px;gap:18px}
  .hero-media{min-height:220px}
  .trio{margin-top:16px}
  .wide-media{min-height:220px}
  .tile-media{min-height:140px}
  .side-media{min-height:200px}
  .band,.statement{padding:40px 0}
  .lede{font-size:16px}
  .button{width:100%}
  .map{height:240px}
  .map-frame{border-radius:14px}
  .banner{font-size:11px;line-height:1.45}
  .wordmark small{display:none}
}
@media (max-width:560px){
  .person{grid-template-columns:96px minmax(0,1fr);gap:14px}
  .thumb{width:96px;height:120px;border-radius:14px;font-size:28px}
  h1{font-size:clamp(32px,9vw,42px);line-height:1.2}
}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
</style>
</head>
<body>
<p class="banner">${banner} · Prepared by Parley Systems · Not the business’s official website</p>
<a class="skip" href="#home">Skip to content</a>
<input id="nav-toggle" class="nav-toggle" type="checkbox" aria-label="Open menu">
<header class="site-header">
<a class="brand" href="#home">${logo}</a>
<nav aria-label="Pages">
<ul>
<li><a href="#home">Home</a></li>
<li><a href="#services">Services</a></li>
<li><a href="#team">Team</a></li>
<li><a href="#contact">Contact</a></li>
<li><a class="button" href="#contact">Get in touch</a></li>
</ul>
</nav>
<label class="menu-button" for="nav-toggle"><span class="open">Menu</span><span class="close">Close</span></label>
${phoneOk ? `<a class="button header-cta" href="#contact">Get in touch</a>` : '<span class="header-cta"></span>'}
</header>
<main>
<section id="home" class="page">
<div class="wrap hero">
<div>
<p class="eyebrow">${e(s.sector)} · ${location}</p>
<h1>${e(s.copy.headline)}</h1>
<p class="lede">${e(s.copy.introduction)}</p>
<a class="button" href="#services">View services</a>
</div>
${heroMedia}
</div>
<div class="wrap trio">${serviceCards}</div>
<section class="band">
<div class="wrap">
<p class="eyebrow">Services</p>
<h2>What is listed.</h2>
<p class="lede">${s.demo ? 'Fictional services, shown so this layout can be reviewed.' : 'Names taken from the official website. No extra treatments, prices or results have been added.'}</p>
<div class="tiles">${serviceTiles}</div>
</div>
</section>
<section class="wrap statement">
<p class="eyebrow">${location}</p>
<h2>${e(s.copy.introduction)}</h2>
</section>
<section class="band">
<div class="wrap split">
<div>${examples || '<p class="pending">No extra illustrative copy was supplied.</p>'}</div>
${sideMedia}
</div>
</section>
<section class="wrap statement visit-row">
<div>
<p class="eyebrow">Visit</p>
<h2>Speak to ${name}.</h2>
<p class="lede">This concept does not take bookings, payments or orders.</p>
</div>
${phoneLink || '<p class="pending">Contact details awaiting confirmation.</p>'}
</section>
</section>
<section id="services" class="page">
<div class="wrap page-intro">
<p class="eyebrow">Service</p>
<h1>${firstService}</h1>
<p class="lede">Published for ${name}. This page does not add prices, results or treatments that were not listed.</p>
${services.length ? wideMedia : '<p class="pending">Service details awaiting confirmation.</p>'}
${services[0] ? `<p>Listed for ${name}.</p>` : ''}
${restServices}
${examples}
<div class="visit-row service-close">
<div>
<h2>Talk to ${name}.</h2>
<p class="lede">This concept does not take bookings, payments or orders.</p>
</div>
<a class="button" href="#contact">Contact</a>
</div>
</div>
</section>
<section id="team" class="page">
<div class="wrap page-intro">
<p class="eyebrow">Team</p>
<h1>People at ${name}.</h1>
<p class="lede">Each thumbnail has the person’s detail beside it. Sample cards are layout only and are not staff.</p>
${teamBody}
</div>
</section>
<section id="contact" class="page">
<div class="wrap page-intro">
<p class="eyebrow">Contact</p>
<h1>Contact ${name}.</h1>
<div class="map-frame">${map}</div>
<p class="map-note">${mapNote}</p>
<div class="info-grid">${info}</div>
<div class="split">
<form class="sheet" action="#contact" method="post" onsubmit="return false">
<h2>Get in touch</h2>
<p>This preview does not send messages, take bookings or store what you type.</p>
<label>Name<input name="name" autocomplete="name"></label>
<label>Phone<input name="tel" type="tel" autocomplete="tel"></label>
<label>Message<textarea name="message"></textarea></label>
${phoneLink || '<p class="pending">Contact details awaiting confirmation.</p>'}
</form>
${sideMedia}
</div>
</div>
</section>
</main>
<footer class="site-footer">
<div class="wrap foot">
<div>
<strong>${name}</strong>
<p>${s.demo ? 'Fictional demonstration' : 'Unapproved design concept'} by Parley Systems.</p>
</div>
<div>
<strong>Pages</strong>
<ul>
<li><a href="#home">Home</a></li>
<li><a href="#services">Services</a></li>
<li><a href="#team">Team</a></li>
<li><a href="#contact">Contact</a></li>
</ul>
</div>
<div>
<strong>Visit</strong>
${b.address ? `<p>${e(b.address.value)}</p>` : ''}
${b.hours ? `<p>${e(b.hours.value)}</p>` : ''}
${phoneOk ? `<p><a href="tel:${phoneDigits}">${e(b.phone.value)}</a></p>` : ''}
</div>
</div>
<div class="wrap"><small class="legal">Template care-modern 1.0.0. Colour follows this business’s brand accent. This page does not sell products. Category photography is illustrative.</small></div>
</footer>
<script>
document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => { const box = document.getElementById('nav-toggle'); if (box) box.checked = false; }));
</script>
</body>
</html>
`;
}
