import fs from 'node:fs';

const path = 'public/preview/sophies-sports-massage/index.html';
let html = fs.readFileSync(path, 'utf8');

const swaps = [
  ['New clients can book the introductory visit for £40.', 'New clients can book the introductory visit for £35.'],
  ['New clients · £40 · 45 minutes', 'New clients · £35 · 45 minutes'],
  ['<span class="fee-gem"><strong>£55</strong></span>', '<span class="fee-gem"><strong>£50</strong></span>'],
  ['<span class="fee-gem"><strong>£45</strong></span>', '<span class="fee-gem"><strong>£40</strong></span>'],
  ['Continued treatment from £45', 'Continued treatment from £40'],
  ['Sports massage 60 min £50', 'Sports massage 60 min £45'],
];

for (const [from, to] of swaps) {
  if (!html.includes(from)) {
    console.warn('missing:', from);
    continue;
  }
  html = html.replace(from, to);
}

fs.writeFileSync(path, html);
console.log('patched');
