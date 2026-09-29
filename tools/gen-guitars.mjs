// Generates one product image per guitar type in public/guitars/ with OpenAI gpt-image-2.
// Key: OPENAI_API_KEY in the environment or .env.local, else Akoe's app/Secrets.xcconfig.
// Only writes missing files; `--all` redoes all, or pass ids: node tools/gen-guitars.mjs strat tele
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
function readKey() {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
  for (const f of [path.join(root, ".env.local"), path.join(root, "../akoe/app/Secrets.xcconfig")]) {
    if (!fs.existsSync(f)) continue;
    const m = fs.readFileSync(f, "utf8").match(/^\s*OPENAI_API_KEY\s*=\s*(\S+)/m);
    if (m) return m[1];
  }
  throw new Error("No OPENAI_API_KEY");
}

// Generic descriptions on purpose: no maker names, so nothing reads as a trademarked model.
const TYPES = {
  strat: "a double-cutaway solid-body electric guitar with a contoured body, three single-coil pickups, a pickguard, a tremolo bridge and a maple neck with a six-in-line headstock, sunburst finish",
  tele: "a single-cutaway slab solid-body electric guitar with two single-coil pickups, a metal bridge plate, a maple neck and a six-in-line headstock, butterscotch blonde finish",
  lesPaul: "a single-cutaway solid-body electric guitar with a carved arched top, two humbucker pickups, a tune-o-matic bridge, a mahogany neck and a three-a-side headstock, cherry sunburst finish",
  prs: "a double-cutaway solid-body electric guitar with a carved figured maple top, two humbuckers, a tremolo bridge, bird-shaped fretboard inlays and a three-a-side headstock, dark blue finish",
  superstrat: "a sleek modern double-cutaway superstrat electric guitar with sharp horns, a humbucker and single-coil pickups, a locking tremolo, a thin neck and a pointed six-in-line headstock, glossy black finish",
  baritone: "a long-scale six-string baritone electric guitar, double-cutaway solid body, two humbuckers, a long neck with widely spaced frets and a six-in-line headstock, matte grey finish",
  seven: "a seven-string electric guitar, double-cutaway solid body, two humbuckers, seven strings clearly visible, a fixed bridge, a seven-in-line headstock, deep green finish",
  sevenLong: "a long-scale seven-string electric guitar, sharp double-cutaway solid body, two humbuckers, seven strings clearly visible, a long neck, a seven-in-line headstock, matte black finish",
  eight: "an eight-string electric guitar, modern double-cutaway solid body, two humbuckers, eight strings clearly visible, a very long neck and a wide headstock with eight tuners, satin dark red finish",
  acoustic: "a steel-string acoustic guitar, dreadnought body, spruce top, round soundhole, a black pickguard, a rosewood bridge and a three-a-side headstock, natural gloss finish",
  classical: "a classical nylon-string guitar, smaller body, wide flat neck, a slotted headstock with six tuners and white plastic knobs, a tie-block bridge with nylon strings, light natural spruce top",
};

const STYLE = "Studio product photograph, the whole guitar upright and centered, headstock at the top, straight-on view, soft even lighting, subtle shadow, plain dark charcoal background (#1a1a1a), no text, no logos, no brand names, no hands, no stand, no cables.";

const args = process.argv.slice(2);
const all = args.includes("--all");
const ids = args.filter((a) => !a.startsWith("--"));
const key = readKey();
const out = path.join(root, "public/guitars");
fs.mkdirSync(out, { recursive: true });

for (const id of ids.length ? ids : Object.keys(TYPES)) {
  const file = path.join(out, `${id}.webp`);
  if (fs.existsSync(file) && !all && !ids.length) { console.log("skip", id); continue; }
  if (!TYPES[id]) throw new Error(`unknown type ${id}`);
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-image-2", prompt: `${STYLE} Subject: ${TYPES[id]}.`, size: "1024x1536", n: 1 }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`${id}: ${res.status} ${JSON.stringify(json.error ?? json)}`);
  const b64 = json.data[0].b64_json;
  const buf = b64 ? Buffer.from(b64, "base64") : Buffer.from(await (await fetch(json.data[0].url)).arrayBuffer());
  await sharp(buf).resize({ width: 720 }).webp({ quality: 82 }).toFile(file);
  console.log("wrote", id);
}
