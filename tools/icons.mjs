// Renders public/icon.png (apple-touch-icon) and the link previews public/og.png (English) and
// public/og-es.png (Spanish) from the logo SVG.
// Run with `npm run icons` after changing the mark in public/favicon.svg (and components/logo.tsx).
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
const logo = readFileSync(join(pub, 'favicon.svg'), 'utf8');

await sharp(Buffer.from(logo)).resize(512, 512).png().toFile(join(pub, 'icon.png'));

const mark = logo.replace(/<svg[^>]*>/, '').replace('</svg>', '');
const og = (tagline) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#14120f"/>
  <g transform="translate(96 175) scale(0.2734)">${mark}</g>
  <text x="420" y="300" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="96" font-weight="700" fill="#f3efe6" letter-spacing="-2">Diesis</text>
  <text x="420" y="372" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="40" fill="#a39c8e">${tagline}</text>
  <text x="420" y="440" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="30" font-weight="600" fill="#f0c46a">diesis.app</text>
</svg>`;
await sharp(Buffer.from(og('Know every note on the guitar neck.'))).png().toFile(join(pub, 'og.png'));
await sharp(Buffer.from(og('Aprende todas las notas del mástil.'))).png().toFile(join(pub, 'og-es.png'));
console.log('wrote public/icon.png, public/og.png and public/og-es.png');
