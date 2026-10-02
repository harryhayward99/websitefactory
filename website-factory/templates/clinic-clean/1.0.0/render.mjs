// Draft starter. Freeze this file once Harry approves it. Design changes after that belong in a new version directory.
export function render(s, e) {
  const b = s.business;
  const name = e(b.name.value);
  const location = e(b.location.value);
  const accent = /^#[0-9a-fA-F]{6}$/.test(s.brand?.accent || '') ? s.brand.accent : '#31584a';
  const initial = e((b.name.value || '•').trim().charAt(0).toUpperCase());
  const logo = s.assets.logo
    ? `<img class="logo" src="${e(s.assets.logo.path)}" alt="${e(s.assets.logo.alt)}">`
    : `<span class="wordmark"><span class="mark" aria-hidden="true">${initial}</span><span><strong>${name}</strong><small>${location}</small></span></span>`;
  const heroImage = s.assets.images[0];
  const hero = heroImage
    ? `<figure class="hero-figure"><img src="${e(heroImage.path)}" alt="${e(heroImage.alt)}"><figcaption>Illustrative image. Not verified as this business’s premises or staff.</figcaption></figure>`
    : `<figure class="hero-figure"><div class="monogram" role="img" aria-label="No photograph selected">${initial}</div><figcaption>Photograph awaiting an approved category image.</figcaption></figure>`;
  const phoneDigits = (b.phone?.value || '').replace(/[^\d+]/g, '');
  const phoneLink = /^\+?\d{7,15}$/.test(phoneDigits)
    ? `<a class="button" href="tel:${phoneDigits}">Call ${e(b.phone.value)}</a>`
    : '<p class="pending">Contact details awaiting confirmation.</p>';
  const website = b.website && /^https:\/\//.test(b.website.value)
    ? `<a href="${e(b.website.value)}" rel="noopener noreferrer">Visit the official website</a>`
    : '';
  const services = b.services.length
    ? b.services.map((service, index) => `<article class="card"><small>${String(index + 1).padStart(2, '0')}</small><h3>${e(service.value)}</h3></article>`).join('')
    : '<p class="pending">Service details awaiting confirmation.</p>';
  const examples = s.exampleSections.map(section => `<aside class="example"><small>ILLUSTRATIVE CONTENT — NOT A VERIFIED BUSINESS CLAIM</small><h3>${e(section.title)}</h3><p>${e(section.body)}</p></aside>`).join('');
  const facts = [
    b.address ? `<div><dt>Address</dt><dd>${e(b.address.value)}</dd></div>` : '',
    b.hours ? `<div><dt>Hours</dt><dd>${e(b.hours.value)}</dd></div>` : '',
    website ? `<div><dt>Official website</dt><dd>${website}</dd></div>` : ''
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
<meta name="generator" content="parley-website-factory clinic-clean 1.0.0">
<title>${name} — concept by Parley</title>
<style>
:root { color-scheme: light; --ink:#1b3330; --muted:#4c625c; --line:#d3ddd2; --paper:#f3f0e8; --card:#e5eee3; --accent:${accent}; --banner:#17312e; }
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--paper);color:var(--ink);font:17px/1.6 "Iowan Old Style",Palatino,"Palatino Linotype",Georgia,serif;overflow-x:clip}
body,button,input{font-family:"Avenir Next",Avenir,Nunito,sans-serif}
h1,h2,h3,p{margin:0}
h1,h2,.wordmark strong{font-family:Georgia,"Iowan Old Style",serif;font-weight:500;letter-spacing:-.035em;line-height:1.05}
h1{font-size:clamp(40px,6vw,84px);max-width:11ch}
h2{font-size:clamp(32px,4vw,56px);max-width:14ch}
h3{font-size:22px;line-height:1.25;font-weight:650}
a{color:inherit}
.skip{position:absolute;left:16px;top:-48px;background:white;padding:8px 12px;z-index:2}
.skip:focus{top:16px}
.banner{margin:0;padding:12px 20px;background:var(--banner);color:white;text-align:center;font-size:12px;letter-spacing:.08em;text-transform:uppercase}
.wrap{width:min(1120px,calc(100% - 48px));margin:auto}
header{display:flex;justify-content:space-between;align-items:center;gap:20px 32px;flex-wrap:wrap;padding:28px 0;border-bottom:1px solid var(--line)}
.brand{display:flex;align-items:center;min-height:44px;text-decoration:none}
.logo{display:block;max-width:min(220px,70vw);max-height:64px;object-fit:contain}
.wordmark{display:flex;align-items:center;gap:12px}
.wordmark strong,.wordmark small{display:block}
.wordmark small{color:var(--muted);letter-spacing:.04em;font-size:13px}
.mark,.monogram{display:grid;place-items:center;background:var(--card);color:var(--accent)}
.mark{width:44px;height:44px;border-radius:50%;font:24px Georgia,serif}
nav ul{display:flex;flex-wrap:wrap;gap:4px 8px;list-style:none;margin:0;padding:0}
nav a{display:inline-flex;align-items:center;min-height:44px;padding:0 12px;text-decoration:none}
.hero{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(280px,.95fr);gap:48px;align-items:center;padding:72px 0}
.eyebrow{margin:0 0 18px;color:var(--muted);font-size:13px;letter-spacing:.14em;text-transform:uppercase}
.intro{max-width:38rem;margin:22px 0 28px;font-size:19px}
.button{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:12px 22px;background:var(--accent);color:white;border-radius:999px;text-decoration:none}
.hero-figure{margin:0}
.hero-figure img,.monogram{width:100%;height:min(520px,62vh);object-fit:cover;border-radius:180px 180px 28px 28px}
.monogram{font:140px Georgia,serif}
.hero-figure figcaption,.pending{color:var(--muted);font-size:14px}
.hero-figure figcaption{margin-top:10px}
.detail{padding:64px 0;border-top:1px solid var(--line)}
.services{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:28px}
.card{background:var(--card);min-height:160px;padding:24px;border-radius:18px}
.card small{display:block;margin-bottom:28px;color:var(--muted)}
.example{margin-top:20px;padding:22px;border:1px dashed #83958a;border-radius:16px;background:white}
.example small{display:block;margin-bottom:10px;font-size:12px;font-weight:750;letter-spacing:.04em}
.contact{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:32px;align-items:start}
.contact dl{display:grid;gap:16px;margin:0}
.contact div{padding-top:12px;border-top:1px solid var(--line)}
dt{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
dd{margin:4px 0 0}
footer{padding:28px 0 48px;border-top:1px solid var(--line);color:var(--muted);font-size:14px}
footer small{display:block;margin-top:8px}
a:focus-visible,.button:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
@media (max-width:1040px){
  .services{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media (max-width:800px){
  .wrap{width:min(100% - 32px,1120px)}
  .hero,.contact,.services{grid-template-columns:1fr}
  .hero{padding:40px 0;gap:28px}
  .hero-figure img,.monogram{height:240px;border-radius:28px;font-size:96px}
  h1{font-size:clamp(36px,11vw,56px)}
  .intro{font-size:17px}
  .button{width:100%}
  .banner{font-size:11px;line-height:1.4}
}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
</style>
</head>
<body>
<p class="banner">${banner} · Prepared by Parley Systems · Not the business’s official website</p>
<a class="skip" href="#content">Skip to content</a>
<div class="wrap">
<header>
<a class="brand" href="#content">${logo}</a>
<nav aria-label="Main navigation"><ul><li><a href="#services">Services</a></li><li><a href="#contact">Contact</a></li></ul></nav>
</header>
<main id="content">
<section class="hero">
<div>
<p class="eyebrow">${location} · ${e(s.sector)}</p>
<h1>${e(s.copy.headline)}</h1>
<p class="intro">${e(s.copy.introduction)}</p>
<a class="button" href="#services">Explore services</a>
</div>
${hero}
</section>
<section id="services" class="detail">
<p class="eyebrow">Services</p>
<h2>What is published.</h2>
<p class="intro">${servicesNote}</p>
<div class="services">${services}</div>
</section>
${examples}
<section id="contact" class="detail contact">
<div>
<p class="eyebrow">Contact</p>
<h2>Speak to the clinic.</h2>
<p class="intro">${name}, ${location}</p>
${phoneLink}
</div>
<dl>${facts}</dl>
</section>
</main>
<footer>
<p>${name} · ${s.demo ? 'Fictional demonstration' : 'Unapproved design concept'} by Parley Systems. No bookings or payments are taken here.</p>
<small>Template clinic-clean 1.0.0. Photography from the category bank is illustrative.</small>
</footer>
</div>
</body>
</html>
`;
}
