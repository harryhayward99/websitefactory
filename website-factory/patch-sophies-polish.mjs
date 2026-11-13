import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';

const outPath = 'public/preview/sophies-sports-massage/index.html';
const statusPath = 'public/preview/sophies-sports-massage/status.json';
const indexPath = 'public/preview/index.json';
const A = '/factory-assets/clients/sophies-sports-massage';

let html = fs.readFileSync(outPath, 'utf8').replace(/\r\n/g, '\n');

// --- Logo burgundy PNG ---
html = html.replaceAll(`${A}/logo.jpg`, `${A}/logo.png`);

// --- Fonts: Inter throughout (drop Fraunces headings); h1 black ---
html = html.replace(
  /href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]+"/,
  'href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;1,14..32,400&display=swap"'
);
html = html.replace(
  /h1,h2,h3\{color:#440621;font-weight:500;letter-spacing:-\.03em\}\s*h1,h2\{font-family:Fraunces,Georgia,serif;font-optical-sizing:auto;letter-spacing:-\.04em\}/,
  'h1,h2,h3{color:#111;font-weight:500;letter-spacing:-.03em}\nh1,h2{font-family:Inter,"Segoe UI",sans-serif;letter-spacing:-.035em}'
);
html = html.replace(
  '.hero-head h1{grid-column:1;grid-row:1;width:auto;max-width:none;font-weight:600;line-height:1.08;font-size:clamp(44px,5.4vw,76px)}',
  '.hero-head h1{grid-column:1;grid-row:1;width:auto;max-width:none;color:#111;font-family:Inter,"Segoe UI",sans-serif;font-weight:600;line-height:1.08;font-size:clamp(44px,5.4vw,76px)}'
);
html = html.replace(
  /\{font-family:Newsreader,Georgia,"Times New Roman",serif;font-optical-sizing:auto;font-weight:600;font-style:normal;letter-spacing:-\.02em;padding:0 \.04em\}/,
  '{font-family:Inter,"Segoe UI",sans-serif;font-weight:600;font-style:normal;letter-spacing:-.02em;padding:0 .04em}'
);
html = html.replace(
  '.hero-card strong{display:-webkit-box;margin:0 0 4px;overflow:hidden;font-size:18px;font-weight:600;line-height:1.2;-webkit-box-orient:vertical;-webkit-line-clamp:2}',
  '.hero-card strong{display:-webkit-box;margin:0 0 4px;overflow:hidden;font-family:Inter,"Segoe UI",sans-serif;font-size:18px;font-weight:600;line-height:1.2;-webkit-box-orient:vertical;-webkit-line-clamp:2}'
);

// --- Hero image: Southam treatment room crop ---
html = html.replace(
  /<figure class="hero-media"><img class="fit-facade" src="[^"]*" alt="[^"]*"><\/figure>/,
  `<figure class="hero-media"><img class="fit-facade" src="${A}/chiro-landing.jpg" alt="Illustrative treatment room photograph for Sophie's Sports Massage &amp; Rehabilitation."></figure>`
);
html = html.replace(
  '.hero-media img.fit-facade{left:18%;width:82%;right:auto;top:0;bottom:0;height:100%;object-fit:cover;object-position:center 22%;transform:none}',
  '.hero-media img.fit-facade{left:25%;width:75%;right:auto;top:auto;bottom:0;height:100%;object-fit:cover;object-position:center bottom;transform:none}'
);
html = html.replace(
  '  .hero-media img.fit-facade{left:0;width:100%;right:auto;top:0;bottom:0;height:100%;transform:none;object-fit:cover;object-position:center 22%}',
  '  .hero-media img.fit-facade{left:0;width:100%;right:auto;top:auto;bottom:25%;height:100%;transform:none;object-fit:cover;object-position:center center}'
);

// --- Service split: image height matches content below Services kicker ---
html = html.replace(
  '.service-split{display:flex;align-items:center;gap:56px}',
  '.service-split{display:grid;grid-template-columns:minmax(220px,36%) minmax(0,1fr);grid-template-rows:auto minmax(0,1fr);column-gap:56px;row-gap:0;align-items:stretch}'
);
html = html.replace(
  '.service-side{display:flex;flex-direction:column;width:min(36%,400px);min-width:220px}',
  '.service-side{display:contents}.service-side .kicker{grid-column:1;grid-row:1;margin:0 0 8px}.service-body{grid-column:1;grid-row:2;display:flex;flex-direction:column;min-width:0}'
);
html = html.replace(
  '.shots{position:relative;flex:1;min-width:0;min-height:480px}',
  '.shots{position:relative;grid-column:2;grid-row:2;min-width:0;min-height:0;height:100%;align-self:stretch}'
);

// Wrap service-side content (after kicker) in .service-body
html = html.replace(
  /(<div class="wrap service-split"[^>]*>\s*<div class="service-side">\s*<p class="kicker">[\s\S]*?<\/p>\s*)(<h2>[\s\S]*?)(<\/div>\s*<div class="shots">)/,
  '$1<div class="service-body">$2</div>$3'
);

// Narrow screens: restore stacked layout
if (!html.includes('.service-body{grid-column:1')) {
  // already injected above
}
html = html.replace(
  '  .hero-head,.service-split,.split,.appoint,.book-layout,.foot,.info-grid,.shots{display:grid;grid-template-columns:1fr;width:auto}',
  '  .hero-head,.service-split,.split,.appoint,.book-layout,.foot,.info-grid,.shots{display:grid;grid-template-columns:1fr;width:auto}\n  .service-split{grid-template-rows:auto auto auto;row-gap:28px}\n  .service-side .kicker{grid-column:1;grid-row:1}\n  .service-body{grid-column:1;grid-row:2}\n  .shots{grid-column:1;grid-row:3;min-height:320px;height:auto}'
);

// --- Drawn arrow styling ---
html = html.replace(
  '.title-arrow{position:absolute;left:0;top:0;z-index:2;width:100%;height:100%;overflow:visible;pointer-events:none}',
  '.title-arrow{position:absolute;left:0;top:0;z-index:2;width:100%;height:100%;overflow:visible;pointer-events:none}.title-arrow .title-shaft,.title-arrow .title-head{stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}'
);

// --- Plant / botanical motifs (thin plum line art) ---
const motifCss = `
.plant-motifs{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;color:var(--accent)}
.plant-motifs svg{position:absolute;opacity:.14}
.plant-motifs .m1{left:-2%;top:12%;width:min(220px,28vw)}
.plant-motifs .m2{right:-1%;top:8%;width:min(180px,22vw);opacity:.11}
.plant-motifs .m3{left:6%;bottom:4%;width:min(160px,18vw);opacity:.1}
.plant-motifs .m4{right:8%;bottom:18%;width:min(140px,16vw);opacity:.12}
.landing>.hero-head,.landing>.hero-stage{z-index:1}
`;
if (!html.includes('.plant-motifs{')) {
  html = html.replace(
    '.landing>.hero-head,.landing>.hero-stage{position:relative;z-index:1}',
    `.landing>.hero-head,.landing>.hero-stage{position:relative;z-index:1}${motifCss}`
  );
}

const motifs = `<div class="plant-motifs" aria-hidden="true">
<svg class="m1" viewBox="0 0 120 160" fill="none"><path d="M58 152C56 118 44 96 28 78" stroke="currentColor" stroke-width="1.1"/><path d="M58 152C62 112 78 88 98 66" stroke="currentColor" stroke-width="1.1"/><path d="M58 118C46 108 34 104 22 106" stroke="currentColor" stroke-width="1"/><path d="M58 118C70 106 84 98 98 96" stroke="currentColor" stroke-width="1"/><path d="M58 92C48 84 40 72 36 58" stroke="currentColor" stroke-width="1"/><path d="M58 92C70 80 80 66 86 50" stroke="currentColor" stroke-width="1"/><path d="M40 70c-6-10-6-20 1-28 8 6 12 14 10 24" stroke="currentColor" stroke-width=".95"/><path d="M78 64c8-10 8-20 0-28-6 7-10 15-8 26" stroke="currentColor" stroke-width=".95"/><path d="M58 70c-2-18 2-34 10-48" stroke="currentColor" stroke-width="1"/><path d="M62 34c6-4 12-4 16 0-4 6-10 8-16 6" stroke="currentColor" stroke-width=".9"/></svg>
<svg class="m2" viewBox="0 0 100 130" fill="none"><path d="M52 122C50 94 40 76 24 58" stroke="currentColor" stroke-width="1"/><path d="M52 122C56 90 70 70 88 52" stroke="currentColor" stroke-width="1"/><path d="M52 88C40 80 30 70 26 56" stroke="currentColor" stroke-width=".95"/><path d="M52 88C64 76 74 62 78 46" stroke="currentColor" stroke-width=".95"/><path d="M36 62c-5-9-4-18 2-24 6 5 9 12 8 20" stroke="currentColor" stroke-width=".9"/><path d="M70 54c6-8 6-16 0-23-5 6-8 12-6 21" stroke="currentColor" stroke-width=".9"/><path d="M52 54c0-16 4-30 12-42" stroke="currentColor" stroke-width="1"/><path d="M56 24c5-3 10-2 13 2-4 5-8 6-13 4" stroke="currentColor" stroke-width=".85"/></svg>
<svg class="m3" viewBox="0 0 90 110" fill="none"><path d="M20 98c18-10 34-28 40-52" stroke="currentColor" stroke-width="1"/><path d="M60 46c8-14 10-28 6-40" stroke="currentColor" stroke-width=".95"/><path d="M48 62c-12-2-22 2-30 12" stroke="currentColor" stroke-width=".9"/><path d="M54 54c12 2 22 10 28 22" stroke="currentColor" stroke-width=".9"/><path d="M42 78c-8 6-10 16-6 24 8-2 12-10 10-20" stroke="currentColor" stroke-width=".85"/><path d="M66 34c-6-8-6-16 1-22 6 5 8 12 5 20" stroke="currentColor" stroke-width=".85"/></svg>
<svg class="m4" viewBox="0 0 80 100" fill="none"><path d="M40 96C38 74 30 58 16 42" stroke="currentColor" stroke-width="1"/><path d="M40 96C44 70 56 54 70 40" stroke="currentColor" stroke-width="1"/><path d="M40 68C30 62 22 52 20 40" stroke="currentColor" stroke-width=".9"/><path d="M40 68C50 60 58 48 62 36" stroke="currentColor" stroke-width=".9"/><path d="M28 48c-4-8-3-15 2-20 5 4 7 10 5 17" stroke="currentColor" stroke-width=".85"/><path d="M54 42c5-7 5-14 0-20-4 5-6 10-5 18" stroke="currentColor" stroke-width=".85"/><path d="M40 42c1-14 6-26 14-36" stroke="currentColor" stroke-width=".95"/></svg>
</div>`;

if (!html.includes('class="plant-motifs"')) {
  html = html.replace(
    /(<div class="landing">)/,
    `$1\n${motifs}`
  );
}

// --- Guide wave: plum only, no green ---
html = html.replace(
  /\[\s*\{ dx: 0, stroke: '#c6e8cf'[\s\S]*?\{ dx: 0, stroke: '#440621', width: '1\.05', opacity: '0\.28' \}\s*\]/,
  `[
      { dx: 0, stroke: '#440621', width: '11', opacity: '0.08', filter: 'url(#guide-soft-' + stamp + ')' },
      { dx: 12, stroke: '#440621', width: '1.35', opacity: '0.1' },
      { dx: -10, stroke: '#682025', width: '1.05', opacity: '0.09' },
      { dx: 6, stroke: '#440621', width: '0.9', opacity: '0.16' },
      { dx: 0, stroke: '#440621', width: '1.05', opacity: '0.26' }
    ]`
);

// --- Title arrow: more hand-drawn path + better large-screen placement ---
html = html.replace(
  /var x1 = inkRight - hr\.left \+ 18;\s*var y1 = last\.bottom - hr\.top - \(last\.bottom - last\.top\) \* 0\.22 \+ 4;\s*var x2 = br\.left - hr\.left - 22;\s*var y2 = br\.top - hr\.top \+ br\.height \/ 2;\s*var reach = 0\.34;\s*var pad = \(1 - reach\) \/ 2;\s*var spanX = x2 - x1;\s*var spanY = y2 - y1;\s*x1 \+= spanX \* pad;\s*y1 \+= spanY \* pad;\s*x2 -= spanX \* pad;\s*y2 -= spanY \* pad;\s*if \(x2 < x1 \+ 36\) \{\s*hide\(\);\s*if \(reduce\) showFull\(\);\s*else if \(bars\[0\] && !bars\[0\]\.getAnimations\(\)\.length\) runBars\(\);\s*return;\s*\}\s*var dx = x2 - x1;\s*var dy = y2 - y1;\s*var drop = Math\.max\(26, Math\.min\(42, dx \* 0\.15\)\);\s*var cx = x1 \+ dx \* 0\.5;\s*var cy = y1 \+ dy \* 0\.5 \+ drop;\s*var tx = x2 - cx;\s*var ty = y2 - cy;\s*var mag = Math\.hypot\(tx, ty\) \|\| 1;\s*tx \/= mag;\s*ty \/= mag;\s*var px = -ty;\s*var py = tx;\s*var shaftEndX = x2 - tx \* 1\.2;\s*var shaftEndY = y2 - ty \* 1\.2;\s*shaft\.setAttribute\('d', 'M ' \+ x1 \+ ' ' \+ y1 \+ ' Q ' \+ cx \+ ' ' \+ cy \+ ' ' \+ shaftEndX \+ ' ' \+ shaftEndY\);\s*var hx = x2 - tx \* 10\.5;\s*var hy = y2 - ty \* 10\.5;\s*arrowHead\.setAttribute\('d', 'M ' \+ \(hx \+ px \* 5\.2\) \+ ' ' \+ \(hy \+ py \* 5\.2\) \+ ' L ' \+ x2 \+ ' ' \+ y2 \+ ' L ' \+ \(hx - px \* 5\.2\) \+ ' ' \+ \(hy - py \* 5\.2\)\);/,
  `var x1 = inkRight - hr.left + 10;
    var y1 = last.bottom - hr.top - (last.bottom - last.top) * 0.18 + 2;
    var x2 = br.left - hr.left - 14;
    var y2 = br.top - hr.top + br.height / 2;
    if (x2 < x1 + 48) {
      hide();
      if (reduce) showFull();
      else if (bars[0] && !bars[0].getAnimations().length) runBars();
      return;
    }
    var dx = x2 - x1;
    var dy = y2 - y1;
    var drop = Math.max(34, Math.min(58, dx * 0.2));
    // Hand-drawn cubic: slight wobble mid-curve
    var c1x = x1 + dx * 0.28;
    var c1y = y1 + dy * 0.18 + drop * 0.55;
    var c2x = x1 + dx * 0.68;
    var c2y = y1 + dy * 0.72 + drop * 0.85;
    var tipX = x2;
    var tipY = y2;
    var tx = tipX - c2x;
    var ty = tipY - c2y;
    var mag = Math.hypot(tx, ty) || 1;
    tx /= mag;
    ty /= mag;
    var px = -ty;
    var py = tx;
    var shaftEndX = tipX - tx * 2.4;
    var shaftEndY = tipY - ty * 2.4;
    shaft.setAttribute('d',
      'M ' + x1.toFixed(1) + ' ' + y1.toFixed(1) +
      ' C ' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) +
      ' ' + (c1x + dx * 0.12).toFixed(1) + ' ' + (c1y + drop * 0.22).toFixed(1) +
      ' ' + (x1 + dx * 0.48).toFixed(1) + ' ' + (y1 + dy * 0.45 + drop * 0.7).toFixed(1) +
      ' S ' + c2x.toFixed(1) + ' ' + c2y.toFixed(1) +
      ' ' + shaftEndX.toFixed(1) + ' ' + shaftEndY.toFixed(1)
    );
    shaft.setAttribute('stroke-width', '2.15');
    // Sketchier open arrow head (two slightly uneven strokes)
    var hx = tipX - tx * 13;
    var hy = tipY - ty * 13;
    arrowHead.setAttribute('d',
      'M ' + (hx + px * 6.4).toFixed(1) + ' ' + (hy + py * 6.4).toFixed(1) +
      ' Q ' + (hx + px * 2.2 - tx * 2).toFixed(1) + ' ' + (hy + py * 2.2 - ty * 2).toFixed(1) +
      ' ' + tipX.toFixed(1) + ' ' + tipY.toFixed(1) +
      ' Q ' + (hx - px * 1.8 - tx * 1.5).toFixed(1) + ' ' + (hy - py * 1.8 - ty * 1.5).toFixed(1) +
      ' ' + (hx - px * 5.6).toFixed(1) + ' ' + (hy - py * 5.6).toFixed(1)
    );
    arrowHead.setAttribute('stroke-width', '2.05');
    arrowHead.setAttribute('fill', 'none');`
);

// Nudge arrow (mobile) more drawn
html = html.replace(
  '<svg class="title-nudge" viewBox="0 0 72 40" aria-hidden="true"><path class="nudge-shaft" d="M68 30C56 32 38 28 18 10"/><path class="nudge-head" d="M18 10 23 21M18 10 30 13"/></svg>',
  '<svg class="title-nudge" viewBox="0 0 72 40" aria-hidden="true"><path class="nudge-shaft" d="M66 31C54 34 42 30 30 22C24 18 20 14 16 9"/><path class="nudge-head" d="M16 9C18 16 19 20 17 24M16 9C22 11 26 12 30 11"/></svg>'
);

fs.writeFileSync(outPath, html);
const hash = crypto.createHash('sha256').update(html).digest('hex');
const status = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
status.contentHash = hash;
status.updatedAt = new Date().toISOString().slice(0, 10);
fs.writeFileSync(statusPath, JSON.stringify(status, null, 2) + '\n');

if (fs.existsSync(indexPath)) {
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const entry = index.previews?.find((p) => p.slug === 'sophies-sports-massage');
  if (entry) {
    entry.contentHash = hash;
    entry.updatedAt = new Date().toISOString();
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n');
  }
}

console.log(JSON.stringify({ ok: true, contentHash: hash }, null, 2));
