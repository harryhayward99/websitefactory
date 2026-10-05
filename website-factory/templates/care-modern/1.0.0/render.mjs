// Draft layout. Brand colour comes only from site.brand.accent. This template has no shop or cart.
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
  const ink = mix([12, 16, 20], 0.78);
  const onAccent = bright ? ink : '#ffffff';
  const paper = mix([255, 255, 255], 0.94);
  const card = mix([255, 255, 255], 0.9);
  const wash = mix([255, 255, 255], 0.8);
  const line = mix([255, 255, 255], 0.74);
  const muted = mix([28, 32, 38], 0.42);
  const deep = mix([8, 10, 14], 0.58);
  const initial = e((b.name.value || '•').trim().charAt(0).toUpperCase());
  const logo = s.assets.logo
    ? `<img class="logo" src="${e(s.assets.logo.path)}" alt="${e(s.assets.logo.alt)}">`
    : `<span class="wordmark"><span class="mark" aria-hidden="true">${initial}</span><span><strong>${name}</strong><small>${location}</small></span></span>`;
  const heroImage = s.assets.images[0];
  const chip = `<div class="chip"><small>${location}</small><strong>${e(s.sector)}</strong></div>`;
  const hero = heroImage
    ? `<figure class="hero-visual"><img src="${e(heroImage.path)}" alt="${e(heroImage.alt)}">${chip}<figcaption>Illustrative image. Not verified as this business’s premises or staff.</figcaption></figure>`
    : `<figure class="hero-visual"><div class="panel" role="img" aria-label="Brand colour panel"><span>${initial}</span></div>${chip}<figcaption>Photograph awaiting an approved category image.</figcaption></figure>`;
  const phoneDigits = (b.phone?.value || '').replace(/[^\d+]/g, '');
  const phoneLink = /^\+?\d{7,15}$/.test(phoneDigits)
    ? `<a class="button" href="tel:${phoneDigits}">Call ${e(b.phone.value)}</a>`
    : '<p class="pending">Contact details awaiting confirmation.</p>';
  const website = b.website && /^https:\/\//.test(b.website.value)
    ? `<a href="${e(b.website.value)}" rel="noopener noreferrer">Official website</a>`
    : '';
  const services = b.services.length
    ? b.services.map((service, index) => `<article class="card"><small>${String(index + 1).padStart(2, '0')}</small><h3>${e(service.value)}</h3></article>`).join('')
    : '<p class="pending">Service details awaiting confirmation.</p>';
  const serviceLine = b.services.length
    ? b.services.map(service => e(service.value)).join('<span aria-hidden="true"> · </span>')
    : '';
  const examples = s.exampleSections.map(section => `<aside class="example"><small>ILLUSTRATIVE CONTENT — NOT A VERIFIED BUSINESS CLAIM</small><h3>${e(section.title)}</h3><p>${e(section.body)}</p></aside>`).join('');
  const facts = [
    b.address ? `<div><dt>Address</dt><dd>${e(b.address.value)}</dd></div>` : '',
    b.hours ? `<div><dt>Hours</dt><dd>${e(b.hours.value)}</dd></div>` : '',
    website ? `<div><dt>Website</dt><dd>${website}</dd></div>` : ''
  ].join('');
  const banner = s.demo ? 'FICTIONAL DEMO' : 'CONCEPT WEBSITE';
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
<style>
:root{color-scheme:light;--accent:${accent};--on:${onAccent};--ink:${ink};--muted:${muted};--line:${line};--paper:${paper};--card:${card};--wash:${wash};--deep:${deep}}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--paper);color:var(--ink);font:17px/1.55 "Avenir Next",Avenir,"Segoe UI",sans-serif;overflow-x:clip}
h1,h2,h3,p{margin:0}
h1,h2{font-family:"Iowan Old Style",Palatino,Georgia,serif;font-weight:520;letter-spacing:-.045em;line-height:.98}
h1{font-size:clamp(52px,7vw,96px);max-width:11ch}
h2{font-size:clamp(36px,4.4vw,64px);max-width:14ch}
h3{font-size:22px;line-height:1.25;letter-spacing:-.03em}
a{color:inherit}
.skip{position:absolute;left:16px;top:-48px;background:white;padding:8px 12px;z-index:3}
.skip:focus{top:16px}
.banner{margin:0;padding:11px 20px;background:var(--deep);color:white;text-align:center;font-size:12px;letter-spacing:.08em;text-transform:uppercase}
.nav{display:flex;justify-content:space-between;align-items:center;gap:20px 28px;width:min(1180px,calc(100% - 48px));margin:auto;padding:22px 0}
.brand{display:flex;align-items:center;min-height:44px;text-decoration:none}
.logo{display:block;max-width:min(220px,64vw);max-height:56px;object-fit:contain}
.wordmark{display:flex;align-items:center;gap:12px}
.wordmark strong,.wordmark small{display:block}
.wordmark small{color:var(--muted);font-size:13px}
.mark{display:grid;place-items:center;width:42px;height:42px;border-radius:14px;background:var(--accent);color:var(--on);font-family:Georgia,serif;font-size:22px}
nav ul{display:flex;gap:8px;list-style:none;margin:0;padding:0}
nav a,.button{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 18px;border-radius:999px;text-decoration:none}
nav a{color:var(--muted)}
.button{background:var(--accent);color:var(--on);font-weight:650}
.hero,.detail,.visit{width:min(1180px,calc(100% - 48px));margin:auto}
.hero{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(300px,.95fr);gap:48px;align-items:center;padding:28px 0 18px}
.eyebrow{margin:0 0 16px;color:var(--accent);font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase}
.intro{max-width:38rem;margin:22px 0 28px;color:var(--muted);font-size:19px}
.hero-visual{position:relative;margin:0}
.hero-visual img,.panel{width:100%;height:min(560px,68vh);object-fit:cover;border-radius:36px;background:linear-gradient(160deg,var(--wash),var(--accent))}
.panel{display:grid;place-items:center;color:var(--on);font:180px Georgia,serif}
.chip{position:absolute;left:24px;bottom:58px;max-width:220px;padding:16px 18px;border-radius:20px;background:white;box-shadow:0 16px 40px rgb(16 24 40 / 12%)}
.chip small,.chip strong{display:block}
.chip small{color:var(--muted);font-size:12px;letter-spacing:.08em;text-transform:uppercase}
.hero-visual figcaption,.pending{margin-top:10px;color:var(--muted);font-size:14px}
.features{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;width:min(1180px,calc(100% - 48px));margin:28px auto 10px}
.card{min-height:180px;padding:24px;border:1px solid var(--line);border-radius:28px;background:white}
.card small{display:block;margin-bottom:36px;color:var(--accent);font-weight:750}
.detail{padding:72px 0}
.service-line{margin:18px 0 28px;color:var(--deep);font-family:Georgia,serif;font-size:clamp(28px,3vw,42px);letter-spacing:-.04em;line-height:1.15}
.services{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.about{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:28px;align-items:start}
.example{padding:22px;border:1px dashed var(--muted);border-radius:24px;background:white}
.example small{display:block;margin-bottom:10px;font-size:12px;font-weight:750;letter-spacing:.04em}
.visit{display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:28px;margin-bottom:28px;padding:36px;border-radius:36px;background:var(--deep);color:white}
.visit .eyebrow,.visit .intro,.visit dt{color:rgb(255 255 255 / 72%)}
.visit .button{background:white;color:var(--deep)}
.visit dl{display:grid;gap:16px;margin:8px 0 0}
.visit div{padding-top:12px;border-top:1px solid rgb(255 255 255 / 20%)}
dt{font-size:12px;letter-spacing:.08em;text-transform:uppercase}
dd{margin:4px 0 0}
footer{width:min(1180px,calc(100% - 48px));margin:auto;padding:8px 0 48px;color:var(--muted);font-size:14px}
footer small{display:block;margin-top:8px}
a:focus-visible,.button:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
@media (max-width:1040px){.features,.services{grid-template-columns:1fr 1fr}}
@media (max-width:800px){
  .nav,.hero,.detail,.features,.visit,footer{width:min(100% - 32px,1180px)}
  .nav,nav ul{flex-wrap:wrap}
  .hero,.about,.visit,.features,.services{grid-template-columns:1fr}
  .hero{padding-top:12px;gap:28px}
  .hero-visual img,.panel{height:280px;border-radius:28px;font-size:120px}
  .chip{left:16px;bottom:48px}
  h1{font-size:clamp(42px,12vw,64px)}
  .intro{font-size:17px}
  .button{width:100%}
  .visit{padding:24px}
  .banner{font-size:11px;line-height:1.4}
}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
</style>
</head>
<body>
<p class="banner">${banner} · Prepared by Parley Systems · Not the business’s official website</p>
<a class="skip" href="#content">Skip to content</a>
<header class="nav">
<a class="brand" href="#content">${logo}</a>
<nav aria-label="Main navigation"><ul><li><a href="#services">Services</a></li><li><a href="#visit">Visit</a></li></ul></nav>
<a class="button" href="#visit">Get in touch</a>
</header>
<main id="content">
<section class="hero">
<div>
<p class="eyebrow">${location}</p>
<h1>${e(s.copy.headline)}</h1>
<p class="intro">${e(s.copy.introduction)}</p>
<a class="button" href="#services">View services</a>
</div>
${hero}
</section>
<section class="features" aria-label="Published services">${services}</section>
<section id="services" class="detail">
<p class="eyebrow">Services</p>
<h2>What is published.</h2>
<p class="service-line">${serviceLine}</p>
<p class="intro">${servicesNote}</p>
${examples}
</section>
<section id="visit" class="visit">
<div>
<p class="eyebrow">Visit</p>
<h2>Speak to ${name}.</h2>
<p class="intro">This concept page does not take bookings, payments or orders.</p>
${phoneLink}
</div>
<dl>${facts}</dl>
</section>
</main>
<footer>
<p>${name} · ${s.demo ? 'Fictional demonstration' : 'Unapproved design concept'} by Parley Systems.</p>
<small>Template care-modern 1.0.0. Colour follows this business’s brand accent. This page does not sell products. Category photography is illustrative.</small>
</footer>
</body>
</html>
`;
}
