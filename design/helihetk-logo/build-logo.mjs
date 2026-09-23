// Generates the Helihetk logo SVG files from one set of hand-built letter paths.
// Run: node build-logo.mjs  (writes into ./assets)
import { mkdirSync, writeFileSync } from 'node:fs';

const INK = '#1C1A17';
const PAPER = '#EEE8DC';
const RED = '#E0442E';
const STROKE = 12;

// Letters on a 100-unit baseline grid: ascender 12, x-height 40, baseline 100.
const heli = [
  'M6 12 V100 M6 58 A12 12 0 0 1 30 58 V100',
  'M48 70 H72 V58 A12 12 0 0 0 48 58 V82 A12 12 0 0 0 69.2 89.7',
  'M90 12 V100',
  'M108 40 V100',
];
const hetk = [
  'M126 12 V100 M126 58 A12 12 0 0 1 150 58 V100',
  'M168 70 H192 V58 A12 12 0 0 0 168 58 V82 A12 12 0 0 0 189.2 89.7',
  'M210 22 V82 A12 12 0 0 0 222 94 H229 M201 46 H228',
  'M240 12 V100',
];
// k arm and leg are filled shapes so the joint and the flat ends stay clean.
const kArmLeg = 'M259 40 H273 L252.5 81 L246 68 V66 Z M246 68 L259.5 67 L276 100 H262 Z';
const dot = { cx: 110, cy: 24, r: 8.5 };

const paths = (list) => list.map((d) => `<path d="${d}"/>`).join('');

function letters({ color, dotColor, stacked }) {
  const shift = stacked ? ' transform="translate(-120 108)"' : '';
  return `<g fill="none" stroke="${color}" stroke-width="${STROKE}">${paths(heli)}<g${shift}>${paths(hetk)}<path d="${kArmLeg}" fill="${color}" stroke="none"/></g></g>
<circle cx="${dot.cx}" cy="${dot.cy}" r="${dot.r}" fill="${dotColor}"/>`;
}

const WORD = { x: 0, y: 12, w: 276, h: 88 };
const STACK = { x: 0, y: 12, w: 156, h: 196 };

function svg(vb, width, height, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.x} ${vb.y} ${vb.w} ${vb.h}" width="${width}" height="${height}">${body}</svg>\n`;
}

function mark(box, opts) {
  return svg(box, box.w * 4, box.h * 4, letters(opts));
}

function placed(box, size, bg, opts, scale, shiftY = 0) {
  const w = box.w * scale;
  const h = box.h * scale;
  const tx = (size.w - w) / 2 - box.x * scale;
  const ty = (size.h - h) / 2 - box.y * scale + shiftY;
  return svg({ x: 0, y: 0, w: size.w, h: size.h }, size.w, size.h,
    `<rect width="${size.w}" height="${size.h}" fill="${bg}"/><g transform="translate(${tx} ${ty}) scale(${scale})">${letters(opts)}</g>`);
}

const out = new URL('./assets/', import.meta.url);
mkdirSync(out, { recursive: true });
const files = {
  'helihetk-sonamark-tume.svg': mark(WORD, { color: INK, dotColor: RED }),
  'helihetk-sonamark-hele.svg': mark(WORD, { color: PAPER, dotColor: RED }),
  'helihetk-virn-tume.svg': mark(STACK, { color: INK, dotColor: RED, stacked: true }),
  'helihetk-virn-hele.svg': mark(STACK, { color: PAPER, dotColor: RED, stacked: true }),
  'helihetk-profiil-must.svg': placed(STACK, { w: 1080, h: 1080 }, INK, { color: PAPER, dotColor: RED, stacked: true }, 2.9),
  'helihetk-profiil-punane.svg': placed(STACK, { w: 1080, h: 1080 }, RED, { color: PAPER, dotColor: INK, stacked: true }, 2.9),
  'helihetk-profiil-hele.svg': placed(STACK, { w: 1080, h: 1080 }, PAPER, { color: INK, dotColor: RED, stacked: true }, 2.9),
  'helihetk-kaanepilt.svg': placed(WORD, { w: 1640, h: 624 }, INK, { color: PAPER, dotColor: RED }, 2.75),
};
for (const [name, body] of Object.entries(files)) writeFileSync(new URL(name, out), body);
console.log(Object.keys(files).join('\n'));
