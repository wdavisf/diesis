// Renders public/icon.png (apple-touch-icon) from the logo SVG, and the link previews from
// tools/og-card.mjs: public/og.png (English) and public/og-es.png (Spanish) for the landing and
// the app's front door, and public/og/<tool>-<lang>.png for each tool page (lib/lang.ts names them).
// Run with `npm run icons` after changing the mark in public/favicon.svg (and components/logo.tsx)
// or the cards.
import sharp from 'sharp';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { ogCard, TOOL_CARDS } from './og-card.mjs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
const logo = readFileSync(join(pub, 'favicon.svg'), 'utf8');

await sharp(Buffer.from(logo)).resize(512, 512).png().toFile(join(pub, 'icon.png'));

const delta = logo.match(/<path[^>]* d="([^"]+)"/)[1];
writeFileSync(join(pub, 'og.png'), await ogCard('en', delta));
writeFileSync(join(pub, 'og-es.png'), await ogCard('es', delta));
mkdirSync(join(pub, 'og'), { recursive: true });
for (const tool of TOOL_CARDS) for (const lang of ['en', 'es']) writeFileSync(join(pub, 'og', `${tool}-${lang}.png`), await ogCard(lang, delta, tool));
console.log(`wrote public/icon.png, public/og.png, public/og-es.png and ${TOOL_CARDS.length * 2} cards in public/og/`);
