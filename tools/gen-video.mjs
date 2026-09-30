// Generates the landing's video and cuts the copy the site serves. Three steps, each skipped when its
// file is already there:
//   1. the still   design/video/<id>.png   OpenAI gpt-image-2: the first frame, so it can be checked
//                                          (hands, six strings, nothing that reads as a brand) before
//                                          any video is paid for
//   2. the take    design/video/<id>.mp4   Runway image-to-video, which sets that still in motion
//   3. the cut     public/video/<id>.mp4   no sound, H.264, looped between the two moments of the
//                  public/video/<id>.jpg   take that look most alike, cross-faded, so the loop has
//                                          no jump; the poster is the cut's first frame
// design/video/ is not in git. The still also gives the link-preview card its photo, tools/og-stage.jpg
// (in git, so `npm run icons` works from a clone): run `npm run icons` after a new still.
//   node tools/gen-video.mjs stage           whatever is missing, then the cut
//   node tools/gen-video.mjs stage --still   a new still, and stop there to look at it
//   node tools/gen-video.mjs stage --take    a new take from the still, then the cut
//   node tools/gen-video.mjs stage --card    only the card's photo again, from the still
// A take is paid for when it is asked for, so its task id is kept in design/video/<id>.task until the
// file is down: a run that was cut short picks the same take up again instead of buying another.
// Keys: OPENAI_API_KEY and RUNWAY_API_KEY in the environment or .env.local, else Akoe's
// app/Secrets.xcconfig (as gen-images.mjs). OpenAI's own video API (Sora) closed on 2026-09-24.
// Needs ffmpeg: on the PATH, or FFMPEG=/path/to/ffmpeg (npm's ffmpeg-static works).
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
function readKey(name) {
  if (process.env[name]) return process.env[name];
  for (const f of [path.join(root, ".env.local"), path.join(root, "../akoe/app/Secrets.xcconfig")]) {
    if (!fs.existsSync(f)) continue;
    const m = fs.readFileSync(f, "utf8").match(new RegExp(`^\\s*${name}\\s*=\\s*(\\S+)`, "m"));
    if (m) return m[1];
  }
  throw new Error(`No ${name}`);
}

// No maker names and no real player: a generic modern-metal guitarist, described by his clothes and
// never by a band, the face turned down into shadow. The light is the site's own (black stage, amber
// rim). The player stands to the right, so the text has the left. Chosen by Will from three takes
// (the others: long hair and a black guitar; a hood in front of LED bars).
const VIDEOS = {
  stage: {
    ratio: [1584, 672], // Runway's widest, 2.36:1
    seconds: 8,
    model: "gen4.5",
    still: "Cinematic ultra-wide film still, 2.39:1 anamorphic frame. A dark, empty stage. A modern metalcore guitarist stands in the right third of the frame, seen from the hips up, body facing the camera, head bowed, the face turned down and lost in shadow: short dark textured hair with faded sides, an oversized black t-shirt, a thin silver chain, tattoos covering both arms, the neck and the backs of the hands, silver rings. Playing a matte white solid-body electric guitar with sharp modern horns, exactly six strings, a single black humbucker pickup, black hardware, a dark ebony fretboard with no inlays and a plain unmarked matte white headstock, hung low on a black strap, the neck angled up toward the upper right. The right hand picks the strings over the pickup, the left hand frets a chord low on the neck. The left half of the frame is empty: dark haze and faint amber light beams. Behind the player, two warm amber stage lights glow through thick drifting haze, tracing the hair, the shoulders, the arms and the edge of the guitar with a hot orange rim light; everything else falls off into deep black. High contrast, low-key, fine film grain, anamorphic bokeh. No text, no logos, no brand names, no audience, no other musicians.",
    motion: "The guitarist plays a slow, crushing metal breakdown: the picking hand hits hard, tight downstrokes, the fretting hand holds low chords and shifts along the neck, the whole body rocks forward with every hit, knees bending, the head nodding hard to the beat. The face stays turned down in shadow. Haze drifts slowly through the amber backlights. Locked-off camera on a tripod, no camera movement, no cuts, one continuous shot.",
  },
};

const FADE = 0.5; // seconds of cross-fade where the loop joins
const SEARCH = 2.5; // how far from each end of the take the loop may start and stop, in seconds
const SHORTEST = 5.5; // and the loop is never shorter than this
const FPS = 24;
const ffmpeg = process.env.FFMPEG ?? "ffmpeg";
const args = process.argv.slice(2);
const only = ["--still", "--take"].find((f) => args.includes(f));
const ids = args.filter((a) => !a.startsWith("--"));
if (!ids.length) throw new Error(`Which video? ${Object.keys(VIDEOS).join(", ")}`);

async function still(id, v, file) {
  const [w, h] = v.ratio;
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${readKey("OPENAI_API_KEY")}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-image-2", prompt: v.still, size: `${w * 2}x${h * 2}`, n: 1 }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`${id}: ${res.status} ${JSON.stringify(json.error ?? json)}`);
  const b64 = json.data[0].b64_json;
  const buf = b64 ? Buffer.from(b64, "base64") : Buffer.from(await (await fetch(json.data[0].url)).arrayBuffer());
  await sharp(buf).png().toFile(file);
  console.log("wrote", path.relative(root, file));
}

/** The link-preview card's photo (1200×630, tools/og-card.mjs): the still at full height, cut so the player's chest sits two thirds across and the text has the left. */
async function cardPhoto(stillFile) {
  const { width, height } = await sharp(stillFile).metadata();
  const wide = Math.round((height * 1200) / 630);
  const file = path.join(root, "tools/og-stage.jpg");
  await sharp(stillFile).extract({ left: Math.round(width * 0.953) - wide, top: 0, width: wide, height }).resize(1200, 630).jpeg({ quality: 88 }).toFile(file);
  console.log("wrote", path.relative(root, file));
}

const runway = "https://api.dev.runwayml.com/v1";
async function take(id, v, stillFile, file, fresh) {
  const headers = { Authorization: `Bearer ${readKey("RUNWAY_API_KEY")}`, "X-Runway-Version": "2024-11-06", "Content-Type": "application/json" };
  const note = file.replace(/\.mp4$/, ".task");
  if (fresh) fs.rmSync(note, { force: true });
  let task;
  if (fs.existsSync(note)) {
    task = { id: fs.readFileSync(note, "utf8").trim() };
    console.log(id, "picking up task", task.id);
  } else {
    const [w, h] = v.ratio;
    // Runway takes no picture wider than 2:1 and crops to the ratio from the center: a wider still
    // gets its top and bottom edges mirrored out to 2:1, and the crop takes exactly that back off.
    const pad = Math.max(0, Math.ceil((w / 2 - h) / 2));
    const frame = await sharp(stillFile).resize({ width: w, height: h, fit: "cover" }).extend({ top: pad, bottom: pad, extendWith: "mirror" }).jpeg({ quality: 92 }).toBuffer();
    const res = await fetch(`${runway}/image_to_video`, {
      method: "POST",
      headers,
      body: JSON.stringify({ model: v.model, promptImage: `data:image/jpeg;base64,${frame.toString("base64")}`, promptText: v.motion, ratio: `${w}:${h}`, duration: v.seconds }),
    });
    task = await res.json();
    if (!res.ok) throw new Error(`${id}: ${res.status} ${JSON.stringify(task)}`);
    fs.writeFileSync(note, task.id);
    console.log(id, "task", task.id);
  }
  for (;;) {
    const res = await fetch(`${runway}/tasks/${task.id}`, { headers });
    task = await res.json();
    if (!res.ok) throw new Error(`${id}: ${res.status} ${JSON.stringify(task)}`);
    console.log(id, task.status, task.progress ?? "");
    if (["SUCCEEDED", "FAILED", "CANCELLED"].includes(task.status)) break;
    await new Promise((r) => setTimeout(r, 8000));
  }
  if (task.status !== "SUCCEEDED") {
    fs.rmSync(note, { force: true });
    throw new Error(`${id}: ${task.status} ${task.failure ?? ""} ${task.failureCode ?? ""}`);
  }
  fs.writeFileSync(file, Buffer.from(await (await fetch(task.output[0])).arrayBuffer()));
  fs.rmSync(note, { force: true });
  console.log("wrote", path.relative(root, file));
}

/**
 * Where to loop: the start `a` and the end `b` (seconds into the take) whose next FADE seconds look
 * most alike, so the cross-fade joins two like poses instead of doubling the player. Compared on
 * tiny gray frames.
 */
function loopPoints(raw) {
  const w = 64, h = 28, size = w * h;
  const frames = execFileSync(ffmpeg, ["-v", "error", "-i", raw, "-vf", `fps=${FPS},scale=${w}:${h},format=gray`, "-f", "rawvideo", "-"], { maxBuffer: 1 << 28 });
  const count = Math.floor(frames.length / size);
  const fade = Math.round(FADE * FPS);
  const reach = Math.round(SEARCH * FPS);
  const apart = (i, j) => {
    let d = 0;
    for (let k = 0; k < size; k++) d += Math.abs(frames[i * size + k] - frames[j * size + k]);
    return d;
  };
  let best = { cost: Infinity };
  for (let a = 0; a <= reach; a++) {
    for (let b = Math.max(a + Math.round(SHORTEST * FPS), count - fade - reach); b <= count - fade; b++) {
      let cost = 0;
      for (let k = 0; k < fade; k++) cost += apart(a + k, b + k);
      if (cost < best.cost) best = { cost, a, b };
    }
  }
  if (best.cost === Infinity) throw new Error(`The take is shorter than ${SHORTEST + FADE} s`);
  return { a: best.a / FPS, b: best.b / FPS };
}

function cut(id, v, raw) {
  const out = path.join(root, "public/video");
  fs.mkdirSync(out, { recursive: true });
  const { a, b } = loopPoints(raw);
  // The cut runs from a+FADE to b, then b..b+FADE fades into a..a+FADE: it ends where it starts.
  const filter = [
    `[0:v]fps=${FPS},split[x][y]`,
    `[x]trim=start=${a + FADE}:end=${b + FADE},setpts=PTS-STARTPTS[body]`,
    `[y]trim=start=${a}:end=${a + FADE},setpts=PTS-STARTPTS[head]`,
    `[body][head]xfade=transition=fade:duration=${FADE}:offset=${b - a - FADE},format=yuv420p[v]`,
  ].join(";");
  const mp4 = path.join(out, `${id}.mp4`);
  execFileSync(ffmpeg, ["-y", "-v", "error", "-i", raw, "-filter_complex", filter, "-map", "[v]", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-movflags", "+faststart", mp4]);
  execFileSync(ffmpeg, ["-y", "-v", "error", "-i", mp4, "-frames:v", "1", "-q:v", "4", path.join(out, `${id}.jpg`)]);
  console.log("cut", path.relative(root, mp4), `loop ${a.toFixed(2)}–${b.toFixed(2)} s,`, `${(fs.statSync(mp4).size / 1e6).toFixed(2)} MB`);
}

for (const id of ids) {
  const v = VIDEOS[id];
  if (!v) throw new Error(`No video "${id}"`);
  const dir = path.join(root, "design/video");
  fs.mkdirSync(dir, { recursive: true });
  const png = path.join(dir, `${id}.png`);
  const raw = path.join(dir, `${id}.mp4`);
  const fresh = only === "--still" || !fs.existsSync(png);
  if (fresh) await still(id, v, png);
  if (fresh || args.includes("--card")) await cardPhoto(png);
  if (args.includes("--card")) continue;
  if (only === "--still") continue;
  if (only === "--take" || !fs.existsSync(raw)) await take(id, v, png, raw, only === "--take");
  cut(id, v, raw);
}
