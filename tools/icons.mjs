// Renders public/icon.png (apple-touch-icon) from the logo SVG, and the link previews
// public/og.png (English) and public/og-es.png (Spanish) from tools/og-card.mjs.
// Run with `npm run icons` after changing the mark in public/favicon.svg (and components/logo.tsx).
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
import { ogCard } from './og-card.mjs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
const logo = readFileSync(join(pub, 'favicon.svg'), 'utf8');

await sharp(Buffer.from(logo)).resize(512, 512).png().toFile(join(pub, 'icon.png'));

const delta = logo.match(/<path[^>]* d="([^"]+)"/)[1];
writeFileSync(join(pub, 'og.png'), await ogCard('en', delta));
writeFileSync(join(pub, 'og-es.png'), await ogCard('es', delta));
console.log('wrote public/icon.png, public/og.png and public/og-es.png');
