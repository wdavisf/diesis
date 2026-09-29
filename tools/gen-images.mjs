// Generates the site's illustrations with OpenAI gpt-image-2: guitar types (public/guitar-shots/),
// setup gear (public/gear/), the suggested string sets (public/picks/, one per pick id in
// lib/core/shop.ts) and the string-change steps (public/steps/).
// Key: OPENAI_API_KEY in the environment or .env.local, else Akoe's app/Secrets.xcconfig.
// Guitars are dramatic body shots cropped to 4:5, the shape of the picker cards, so the card shows the
// whole picture. Only writes missing files; `--all` redoes all, or pass ids: node tools/gen-images.mjs strat tele step1
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

// The body is the hero: close, leaning a little, the neck leaving the frame at the top. Same lean and
// light for every guitar so the row of cards reads as one shoot.
const GUITAR_STYLE = "Dramatic low-key studio photograph for a high-end guitar magazine advert, vertical portrait composition. The guitar stands close to the camera, leaning about 15 degrees so the neck rises toward the top-left corner and leaves the frame; the headstock is out of frame. The body fills the lower two thirds of the frame, seen from a slight three-quarter angle, its lower edge just inside the bottom of the frame. Pure black background fading to a soft vignette, one hard rim light tracing the outline of the body, a large soft key light giving long glossy specular reflections on the finish, rich deep saturated colour, razor-sharp detail on the pickups, bridge and strings, fine film grain. No text, no logos, no brand names, no hands, no stand, no cables, no strap.";
const GEAR_STYLE = "Studio product photograph of a single unbranded object, centered, soft even lighting, subtle shadow, plain dark charcoal background (#1a1a1a), no text, no logos, no brand names, no labels, no numbers on packaging.";
const STEP_STYLE = "Macro photograph, shallow depth of field, moody warm lighting, dark charcoal background, an unbranded electric guitar, no text, no logos, no brand names, no faces.";

const GEAR = {
  strings: "a sealed pack of electric guitar strings with plain blank packaging, next to a few loose coiled steel strings",
  ruler: "a small stainless steel guitar string action ruler with millimeter markings, lying flat",
  feeler: "a set of steel feeler gauges fanned out on a ring, thin metal blades",
  winder: "a guitar string winder with a built-in wire cutter, red and black plastic handle",
  tuner: "a black clip-on guitar tuner with a small colour display",
};
// One unbranded pack per suggested set (ids from lib/core/shop.ts): no logos, no text, colours of our
// own choosing so nothing copies a maker's packaging; the strings inside tell the kind apart.
const STRINGS = {
  nickel: "a few loose coiled nickel-plated steel electric guitar strings, bright silver, with small brass ball ends",
  coated: "a few loose coiled electric guitar strings with a faint glossy polymer coating, silver, with small brass ball ends",
  bronze: "a few loose coiled phosphor bronze acoustic guitar strings, warm copper colour, with small brass ball ends",
  nylon: "a few loose coiled classical guitar strings, clear nylon trebles and silver-wound basses, plain ends",
};
const pack = (colour, kind) => `a sealed flat paper envelope pack of guitar strings, plain blank ${colour} envelope with a small round clear window showing the coiled strings inside, lying at a slight angle, with ${STRINGS[kind]} beside it`;
const PICKS = {
  exl120: pack("slate blue", "nickel"),
  eb2223: pack("charcoal grey", "nickel"),
  elixir12002: pack("white", "coated"),
  exl110: pack("navy blue", "nickel"),
  eb2221: pack("graphite", "nickel"),
  elixir12052: pack("light grey", "coated"),
  exl140: pack("burgundy", "nickel"),
  eb2215: pack("dark olive green", "nickel"),
  exl115: pack("teal", "nickel"),
  exl117: pack("plum", "nickel"),
  "exl120-7": pack("forest green", "nickel"),
  "exl110-7": pack("petrol blue", "nickel"),
  "exl120-8": pack("rust orange", "nickel"),
  "exl110-8": pack("black", "nickel"),
  ej15: pack("light kraft brown", "bronze"),
  ej26: pack("dark kraft brown", "bronze"),
  ej16: pack("warm tan", "bronze"),
  ej45: pack("cream", "nylon"),
  ej46: pack("dark red", "nylon"),
};
const STEPS = {
  step1: "a hand gently pulling a new steel guitar string away from the fretboard to stretch it, close-up at the neck",
  step2: "a feeler gauge slid between a string and the frets around the 8th fret to check neck relief, the other hand pressing the string at the first fret",
  step3: "a small steel ruler standing on the 12th fret measuring the height of the strings above the fret, close-up",
  step4: "a small steel ruler measuring the gap between a humbucker pickup and the strings, close-up on the pickup",
  "step5-rear-screw": "a close-up of the rear edge of a Telecaster-style six-saddle guitar bridge seen from behind and slightly above: six saddles, six strings, six long silver intonation screws at the back of the plate pointing along the strings with small coil springs, and a normal-sized small silver Phillips screwdriver with a black handle, held by a hand, with its tip in the head of one of the rear screws, natural wood body",
  "step5-saddle": "a close-up of the bridge of a standard six-string steel-string acoustic guitar seen from slightly above and from the side: a compensated bone saddle standing in its slot in the dark rosewood bridge, with exactly six strings (count them: six) passing over the saddle to exactly six bridge pins in a single row, natural spruce top, no hands",
  step6: "a clip-on tuner on a headstock showing it is in tune with a green display, the guitar strings and tuning pegs in focus",
};

const SETS = [
  { dir: "guitar-shots", size: "1024x1536", width: 720, height: 900, style: GUITAR_STYLE, items: GUITARS },
  { dir: "gear", size: "1024x1024", width: 480, style: GEAR_STYLE, items: GEAR },
  { dir: "picks", size: "1024x1024", width: 480, style: GEAR_STYLE, items: PICKS },
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
    await sharp(buf).resize({ width: set.width, height: set.height, fit: "cover", position: "centre" }).webp({ quality: 82 }).toFile(file);
    console.log("wrote", id);
  }
}
