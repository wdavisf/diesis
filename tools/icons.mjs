// Renders public/icon.png (apple-touch-icon) from the logo SVG, and the link previews from
// tools/og-card.mjs: public/og.jpg (English) and public/og-es.jpg (Spanish) for the landing and
// the app's front door (a photo, so JPEG: as PNG it was 680 KB, more than chat apps like to fetch), and public/og/<tool>-<lang>.png for each tool page (lib/lang.ts names them).
// Run with `npm run icons` after changing the mark in public/favicon.svg (and components/logo.tsx),
// the cards, or the hero's still (tools/gen-video.mjs writes the card's photo, tools/og-stage.jpg).
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
for (const [lang, file] of [['en', 'og.jpg'], ['es', 'og-es.jpg']]) await sharp(await ogCard(lang, delta)).jpeg({ quality: 88, mozjpeg: true }).toFile(join(pub, file));
mkdirSync(join(pub, 'og'), { recursive: true });
for (const tool of TOOL_CARDS) for (const lang of ['en', 'es']) writeFileSync(join(pub, 'og', `${tool}-${lang}.png`), await ogCard(lang, delta, tool));
console.log(`wrote public/icon.png, public/og.jpg, public/og-es.jpg and ${TOOL_CARDS.length * 2} cards in public/og/`);
