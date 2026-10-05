// Draft clinic layout. Type, spacing and colour bands follow a pale clinical homepage.
// Brand tint comes from site.brand.accent. No shop, cart, invented reviews or statistics.
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
  const onAccent = bright ? '#111111' : '#ffffff';
  const pale = mix([255, 255, 255], 0.82);
  const initial = e((b.name.value || '•').trim().charAt(0).toUpperCase());
  const logo = s.assets.logo
    ? `<img class="logo" src="${e(s.assets.logo.path)}" alt="${e(s.assets.logo.alt)}">`
    : `<span class="wordmark"><span class="mark" aria-hidden="true">${initial}</span><span><strong>${name}</strong><small>${location}</small></span></span>`;
  const phoneDigits = (b.phone?.value || '').replace(/[^\d+]/g, '');
  const phoneOk = /^\+?\d{7,15}$/.test(phoneDigits);
  const phoneLink = phoneOk ? `<a class="button solid" href="tel:${phoneDigits}">Call ${e(b.phone.value)}</a>` : '';
  const phoneText = phoneOk ? `<a class="nav-phone" href="tel:${phoneDigits}">${e(b.phone.value)}</a>` : '';
  const website = b.website && /^https:\/\//.test(b.website.value)
    ? `<a href="${e(b.website.value)}" rel="noopener noreferrer">Official website</a>`
    : '';
  const services = Array.isArray(b.services) ? b.services : [];
  const pictures = Array.isArray(s.assets?.images) ? s.assets.images : [];
  const frame = (image, caption, className) => image
    ? `<figure class="${className}"><img src="${e(image.path)}" alt="${e(image.alt)}"></figure>`
    : `<figure class="${className} frame" role="img" aria-label="${caption}"></figure>`;
  const heroMedia = frame(pictures[0], 'Photograph awaiting an approved category image.', 'hero-media');
  const wideMedia = frame(pictures[1] || pictures[0], 'Photograph awaiting an approved category image.', 'wide-media');
  const sideMedia = frame(pictures[2] || pictures[0], 'Photograph awaiting an approved category image.', 'side-media');
  const tileMedia = frame(pictures[0], 'Photograph awaiting an approved category image.', 'tile-media');
  const heroCards = services.length
    ? services.slice(0, 3).map(service => `<a class="hero-card" href="#services"><span class="mini" aria-hidden="true"></span><span><strong>${e(service.value)}</strong><em>Listed for ${name}.</em></span></a>`).join('')
    : '<p class="pending">Service details awaiting confirmation.</p>';
  const serviceLinks = services.length
    ? services.map(service => `<a href="#services">${e(service.value)}</a>`).join('')
    : '<p class="pending">Service details awaiting confirmation.</p>';
  const serviceTiles = services.length
    ? services.map(service => `<a class="shot" href="#services">${tileMedia}<strong>${e(service.value)}</strong></a>`).join('')
    : '';
  const firstService = services[0] ? e(services[0].value) : 'Services';
  const restServices = services.slice(1).map(service => `<article class="service-block"><h2>${e(service.value)}</h2><p>Also on the published list for ${name}.</p></article>`).join('');
  const examples = (Array.isArray(s.exampleSections) ? s.exampleSections : [])
    .map(section => `<aside class="example"><small>Illustrative content — not a verified business claim</small><h2>${e(section.title)}</h2><p>${e(section.body)}</p></aside>`)
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
  const servicesNote = s.demo
    ? 'Fictional services, shown so this layout can be reviewed.'
    : 'Names taken from the official website. No extra treatments, prices or results have been added.';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive">
<meta name="generator" content="parley-website-factory care-modern 1.0.0">
<title>${name} — concept by Parley</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{color-scheme:light;--accent:${accent};--on:${onAccent};--pale:${pale}}
*{box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:88px}
body{margin:0;background:#fff;color:#333;font:16px/1.5 Manrope,"Segoe UI",sans-serif}
h1,h2,h3,p{margin:0;overflow-wrap:break-word}
h1,h2,h3{color:#000;font-weight:500;letter-spacing:-.03em}
h1{font-size:clamp(40px,5vw,68px);line-height:1.05;max-width:11em}
h2{font-size:clamp(32px,4vw,44px);font-weight:400;line-height:1.3}
h3{font-size:20px;line-height:1.2}
a{color:inherit}
img{max-width:100%;display:block}
.skip{position:absolute;left:12px;top:-48px;background:#fff;padding:8px 12px;z-index:9}
.skip:focus{top:12px}
.banner{margin:0;padding:8px 16px;background:#111;color:#fff;text-align:center;font-size:11px;font-weight:500;letter-spacing:.08em}
.nav-toggle{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.site-header{position:sticky;top:0;z-index:8;display:flex;align-items:center;justify-content:space-between;gap:24px;min-height:84px;padding:0 28px;background:#fff}
.nav-left{display:flex;align-items:center;gap:18px;min-width:0}
.brand{display:flex;align-items:center;min-height:44px;color:#000;text-decoration:none}
.logo{max-width:180px;max-height:42px;object-fit:contain}
.wordmark{display:flex;align-items:center;gap:10px}
.wordmark strong{display:block;font-size:16px;font-weight:600;letter-spacing:-.02em}
.wordmark small{display:block;color:#333;font-size:12px;font-weight:500}
.mark{display:grid;place-items:center;width:36px;height:36px;border-radius:8px;background:var(--accent);color:var(--on);font-weight:700}
.nav-rule{width:1px;height:16px;background:#ddd}
.nav-phone{color:#000;font-size:14px;font-weight:500;text-decoration:none;white-space:nowrap}
.site-header nav ul{display:flex;align-items:center;gap:8px;margin:0;padding:0;list-style:none}
.site-header nav a{display:inline-flex;align-items:center;min-height:44px;padding:0 12px;color:#000;font-size:16px;font-weight:500;text-decoration:none}
.site-header nav a[href="#home"],
body:has(#services:target) .site-header nav a[href="#services"],
body:has(#team:target) .site-header nav a[href="#team"],
body:has(#contact:target) .site-header nav a[href="#contact"]{font-weight:700}
body:has(#services:target) .site-header nav a[href="#home"],
body:has(#team:target) .site-header nav a[href="#home"],
body:has(#contact:target) .site-header nav a[href="#home"]{font-weight:500}
.button{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:12px 22px;border:0;border-radius:25px;background:var(--pale);color:#000;font:500 14px/1 Manrope,"Segoe UI",sans-serif;text-decoration:none}
.button.solid{background:#000;color:#fff}
.site-header nav .button{display:none}
.menu-button{display:none;align-items:center;min-height:44px;padding:0 14px;border:1px solid #e6e6e6;border-radius:25px;background:#fff;cursor:pointer}
.menu-button .close{display:none}
.nav-toggle:checked ~ .site-header .menu-button .open{display:none}
.nav-toggle:checked ~ .site-header .menu-button .close{display:inline}
.wrap{width:min(1180px,calc(100% - 80px));margin:auto}
.page{display:none;padding:8px 0 80px}
#home:target,#services:target,#team:target,#contact:target{display:block}
body:not(:has(#services:target)):not(:has(#team:target)):not(:has(#contact:target)) #home{display:block}
.hero-head{display:flex;justify-content:space-between;align-items:flex-start;gap:48px;padding-top:64px}
.hero-head h1{width:min(50%,640px);max-width:none}
.hero-aside{width:min(28%,320px);padding-top:8px}
.lede{margin:0 0 28px;color:#333;font-size:16px;line-height:1.5}
.hero-stage{position:relative;margin-top:40px}
.hero-media,.wide-media,.side-media,.tile-media,.frame{position:relative;overflow:hidden;border-radius:10px;background:var(--pale)}
.hero-media{min-height:640px}
.wide-media{min-height:420px;margin:28px 0}
.side-media{min-height:460px}
.tile-media{min-height:220px;border-radius:10px 10px 0 0}
.hero-media img,.wide-media img,.side-media img,.tile-media img{width:100%;height:100%;object-fit:cover;position:absolute;inset:0}
.hero-cards{position:absolute;left:35px;right:35px;bottom:35px;z-index:1;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:26px}
.hero-card{display:flex;gap:20px;align-items:flex-start;padding:30px;border-radius:10px;background:#fff;color:#000;text-decoration:none}
.hero-card strong{display:block;margin-bottom:8px;font-size:20px;font-weight:500;line-height:1}
.hero-card em{color:#333;font-size:14px;font-style:normal;font-weight:400;line-height:1.5}
.mini{flex:0 0 64px;width:64px;height:64px;border-radius:10px;background:var(--pale)}
.section{padding:120px 0}
.service-split{display:flex;align-items:flex-start;gap:50px}
.service-side{width:22%;min-width:180px}
.service-side h2{margin:8px 0 28px}
.service-links{display:flex;flex-direction:column}
.service-links a{padding:0 0 15px;margin-bottom:15px;border-bottom:1px solid rgba(0,0,0,.15);color:#000;font-size:22px;line-height:1.35;text-decoration:none}
.shots{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;width:78%}
.shot{overflow:hidden;border-radius:10px;background:#f9f9f9;color:#000;text-decoration:none}
.shot strong{display:block;padding:16px 4px 0;font-size:18px;font-weight:500}
.statement{padding:40px 0 20px}
.statement h2{max-width:16em}
.band{background:var(--pale)}
.split,.appoint{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(280px,.95fr);gap:40px;align-items:center}
.example small,.flag{display:block;margin-bottom:8px;color:#333;font-size:12px;font-weight:600}
.example{margin-bottom:22px}
.example h2{font-size:28px;margin-bottom:8px}
.kicker{margin-bottom:10px;color:#000;font-size:14px;font-weight:500}
.home-team{display:grid;gap:8px;margin:28px 0}
.people{display:grid}
.person{display:grid;grid-template-columns:168px minmax(0,1fr);gap:28px;align-items:start;padding:22px 0;border-bottom:1px solid rgba(0,0,0,.12)}
.thumb{display:grid;place-items:center;width:168px;height:196px;border-radius:10px;background:var(--pale);color:#000;font-size:42px;font-weight:500}
.role{margin:4px 0 8px;color:#000;font-size:13px;font-weight:600;letter-spacing:.06em;text-transform:uppercase}
.page-intro{padding-top:36px}
.service-block{margin-top:28px}
.service-close{margin-top:36px}
.map-frame{margin:28px 0 10px;border-radius:10px;overflow:hidden;background:var(--pale)}
.map{display:block;width:100%;height:420px;border:0}
.map-note{margin-bottom:22px;color:#333;font-size:14px}
.info-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:8px 0 36px}
.info-card,.sheet{padding:22px;border-radius:10px;background:#fff}
.sheet{display:grid;gap:12px}
.sheet label{display:grid;gap:6px;color:#333;font-size:14px}
.sheet input,.sheet textarea{width:100%;min-height:48px;padding:12px 14px;border:0;border-radius:8px;background:#f9f9f9;font:inherit;color:#000}
.sheet textarea{min-height:120px;resize:vertical}
.pending{color:#333}
.site-footer{background:#111;color:#fff;padding:72px 0 28px}
.foot{display:grid;grid-template-columns:1.4fr .7fr 1fr;gap:32px}
.site-footer a{color:#fff;text-decoration:none}
.site-footer ul{margin:12px 0 0;padding:0;list-style:none}
.site-footer li{margin:8px 0}
.site-footer p{color:rgba(255,255,255,.72)}
.legal{display:block;margin-top:28px;color:rgba(255,255,255,.55);font-size:13px}
a:focus-visible,.button:focus-visible,.menu-button:focus-visible,input:focus-visible,textarea:focus-visible{outline:3px solid #000;outline-offset:3px}
@media (max-width:800px){
  html{scroll-padding-top:76px}
  .site-header{min-height:68px;padding:0 16px}
  .nav-rule,.nav-phone,.header-cta{display:none}
  .site-header nav{position:absolute;left:16px;right:16px;top:68px}
  .site-header nav ul{display:none;flex-direction:column;align-items:stretch;padding:12px;border-radius:10px;background:#fff;box-shadow:0 16px 40px rgba(0,0,0,.12)}
  .nav-toggle:checked ~ .site-header nav ul{display:flex}
  .site-header nav .button{display:inline-flex}
  .menu-button{display:inline-flex}
  .wrap{width:min(100% - 32px,1180px)}
  .hero-head,.service-split,.split,.appoint,.foot,.info-grid,.hero-cards,.shots{display:grid;grid-template-columns:1fr;width:auto}
  .hero-head{padding-top:28px;gap:18px}
  .hero-head h1,.hero-aside,.service-side,.shots{width:auto;max-width:none}
  .hero-media{min-height:260px}
  .hero-cards{position:static;margin-top:16px;gap:12px}
  .hero-card{padding:18px}
  .wide-media{min-height:220px}
  .side-media{min-height:220px}
  .section{padding:56px 0}
  .button{width:auto}
  .map{height:240px}
  .wordmark small{display:none}
}
@media (max-width:560px){
  .person{grid-template-columns:96px minmax(0,1fr);gap:14px}
  .thumb{width:96px;height:120px;border-radius:10px;font-size:28px}
  h1{font-size:40px;line-height:1.12}
}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
</style>
</head>
<body>
<p class="banner">${banner} · Prepared by Parley Systems · Not the business’s official website</p>
<a class="skip" href="#home">Skip to content</a>
<input id="nav-toggle" class="nav-toggle" type="checkbox" aria-label="Open menu">
<header class="site-header">
<div class="nav-left">
<a class="brand" href="#home">${logo}</a>
<span class="nav-rule" aria-hidden="true"></span>
${phoneText}
</div>
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
<a class="button header-cta" href="#contact">Get in touch</a>
</header>
<main>
<section id="home" class="page">
<div class="wrap hero-head">
<h1>${e(s.copy.headline)}</h1>
<div class="hero-aside">
<p class="lede">${e(s.copy.introduction)}</p>
<a class="button" href="#services">View services</a>
</div>
</div>
<div class="wrap hero-stage">
${heroMedia}
<div class="hero-cards">${heroCards}</div>
</div>
<section class="section">
<div class="wrap service-split">
<div class="service-side">
<p class="kicker">Services</p>
<h2>What is listed.</h2>
<p class="lede">${servicesNote}</p>
<nav class="service-links" aria-label="Services">${serviceLinks}</nav>
</div>
<div class="shots">${serviceTiles}</div>
</div>
</section>
<section class="wrap statement">
<h2>${e(s.copy.introduction)}</h2>
</section>
<section class="section band">
<div class="wrap split">
<div>
<p class="kicker">${location}</p>
${examples || '<p class="pending">No extra illustrative copy was supplied.</p>'}
</div>
${sideMedia}
</div>
</section>
<section class="section">
<div class="wrap">
<p class="kicker">Team</p>
<h2>People at ${name}.</h2>
<p class="lede">Each note sits beside its thumbnail. Sample cards are layout only and are not staff.</p>
<div class="home-team">${personCards || '<p class="pending">No individual team members were published, so none are shown here.</p>'}</div>
<a class="button" href="#team">View the team</a>
</div>
</section>
<section class="section band">
<div class="wrap appoint">
<form class="sheet" action="#contact" method="post" onsubmit="return false">
<p class="kicker">Visit</p>
<h2>Speak to ${name}.</h2>
<p class="lede">This concept does not take bookings, payments or orders.</p>
<label>Name<input name="name" autocomplete="name"></label>
<label>Phone<input name="tel" type="tel" autocomplete="tel"></label>
<label>Message<textarea name="message"></textarea></label>
${phoneLink || '<p class="pending">Contact details awaiting confirmation.</p>'}
</form>
${sideMedia}
</div>
</section>
</section>
<section id="services" class="page">
<div class="wrap page-intro">
<p class="kicker">Service</p>
<h1>${firstService}</h1>
<p class="lede">Published for ${name}. This page does not add prices, results or treatments that were not listed.</p>
${services.length ? wideMedia : '<p class="pending">Service details awaiting confirmation.</p>'}
${services[0] ? `<p>Listed for ${name}.</p>` : ''}
${restServices}
${examples}
<div class="service-close">
<h2>Talk to ${name}.</h2>
<p class="lede">This concept does not take bookings, payments or orders.</p>
<a class="button" href="#contact">Contact</a>
</div>
</div>
</section>
<section id="team" class="page">
<div class="wrap page-intro">
<p class="kicker">Team</p>
<h1>People at ${name}.</h1>
<p class="lede">Each thumbnail has the person’s detail beside it. Sample cards are layout only and are not staff.</p>
${teamBody}
</div>
</section>
<section id="contact" class="page">
<div class="wrap page-intro">
<p class="kicker">Contact</p>
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
