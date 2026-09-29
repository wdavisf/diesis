// Generates the site's illustrations with OpenAI gpt-image-2: guitar types (public/guitar-cards/),
// setup gear (public/gear/) and the string-change steps (public/steps/).
// Key: OPENAI_API_KEY in the environment or .env.local, else Akoe's app/Secrets.xcconfig.
// Guitars are saved upright (the picker cards are narrow portrait ones). Only writes missing files; `--all` redoes all, or pass ids: node tools/gen-images.mjs strat tele step1
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
const GUITARS = {
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

const GUITAR_STYLE = "Studio product photograph, the whole guitar upright and centered, headstock at the top, straight-on view, soft even lighting, subtle shadow, plain dark charcoal background (#1a1a1a), no text, no logos, no brand names, no hands, no stand, no cables.";
const GEAR_STYLE = "Studio product photograph of a single unbranded object, centered, soft even lighting, subtle shadow, plain dark charcoal background (#1a1a1a), no text, no logos, no brand names, no labels, no numbers on packaging.";
const STEP_STYLE = "Macro photograph, shallow depth of field, moody warm lighting, dark charcoal background, an unbranded electric guitar, no text, no logos, no brand names, no faces.";

const GEAR = {
  strings: "a sealed pack of electric guitar strings with plain blank packaging, next to a few loose coiled steel strings",
  ruler: "a small stainless steel guitar string action ruler with millimeter markings, lying flat",
  feeler: "a set of steel feeler gauges fanned out on a ring, thin metal blades",
  winder: "a guitar string winder with a built-in wire cutter, red and black plastic handle",
  tuner: "a black clip-on guitar tuner with a small colour display",
};
const STEPS = {
  step1: "a hand gently pulling a new steel guitar string away from the fretboard to stretch it, close-up at the neck",
  step2: "a feeler gauge slid between a string and the frets around the 8th fret to check neck relief, the other hand pressing the string at the first fret",
  step3: "a small steel ruler standing on the 12th fret measuring the height of the strings above the fret, close-up",
  step4: "a small steel ruler measuring the gap between a humbucker pickup and the strings, close-up on the pickup",
  step5: "a small screwdriver adjusting a bridge saddle screw for intonation, a clip-on tuner on the headstock blurred in the background",
  step6: "a clip-on tuner on a headstock showing it is in tune with a green display, the guitar strings and tuning pegs in focus",
};

const SETS = [
  { dir: "guitar-cards", size: "1024x1536", width: 720, style: GUITAR_STYLE, items: GUITARS },
  { dir: "gear", size: "1024x1024", width: 480, style: GEAR_STYLE, items: GEAR },
  { dir: "steps", size: "1536x1024", width: 720, style: STEP_STYLE, items: STEPS },
];

const args = process.argv.slice(2);
const all = args.includes("--all");
const ids = args.filter((a) => !a.startsWith("--"));
const key = readKey();

for (const set of SETS) {
  const out = path.join(root, "public", set.dir);
  fs.mkdirSync(out, { recursive: true });
  for (const [id, subject] of Object.entries(set.items)) {
    if (ids.length && !ids.includes(id)) continue;
    const file = path.join(out, `${id}.webp`);
    if (fs.existsSync(file) && !all && !ids.length) { console.log("skip", id); continue; }
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gpt-image-2", prompt: `${set.style} Subject: ${subject}.`, size: set.size, n: 1 }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(`${id}: ${res.status} ${JSON.stringify(json.error ?? json)}`);
    const b64 = json.data[0].b64_json;
    const buf = b64 ? Buffer.from(b64, "base64") : Buffer.from(await (await fetch(json.data[0].url)).arrayBuffer());
    await sharp(buf).resize({ width: set.width }).webp({ quality: 82 }).toFile(file);
    console.log("wrote", id);
  }
}
