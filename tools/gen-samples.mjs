// Generates placeholder plucked-string samples with Karplus-Strong synthesis, one WAV per MIDI
// pitch from E2 (40) to E6 (88), into public/samples/nylon. Run: npm run samples.
// These stand in until real nylon and electric samples with clear licensing are sourced.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'samples', 'nylon');
mkdirSync(outDir, { recursive: true });

const SR = 22050;
const DURATION = 1.6;
const LOW = 40;
const HIGH = 88;

function pluck(freq) {
  const n = Math.round(SR / freq);
  const ring = new Float32Array(n);
  let prev = 0;
  for (let i = 0; i < n; i++) {
    const noise = Math.random() * 2 - 1;
    prev = 0.6 * prev + 0.4 * noise; // warm the excitation
    ring[i] = prev;
  }
  // Stretch factor keeps high notes ringing about as long as low ones.
  const stretch = freq > 400 ? 0.93 : freq > 200 ? 0.85 : freq > 120 ? 0.7 : 0.55;
  const damp = 0.998;
  const out = new Float32Array(Math.round(SR * DURATION));
  let idx = 0;
  for (let i = 0; i < out.length; i++) {
    const cur = ring[idx];
    const next = ring[(idx + 1) % n];
    out[i] = cur;
    ring[idx] = damp * (stretch * cur + (1 - stretch) * next);
    idx = (idx + 1) % n;
  }
  // Envelope: quick attack, exponential decay, short fade at the end.
  for (let i = 0; i < out.length; i++) {
    const t = i / SR;
    const attack = Math.min(1, i / 40);
    const decay = Math.exp(-t * 1.9);
    const tail = Math.min(1, (out.length - i) / (SR * 0.05));
    out[i] *= attack * decay * tail;
  }
  let peak = 0;
  for (const v of out) peak = Math.max(peak, Math.abs(v));
  const gain = peak > 0 ? 0.8 / peak : 1;
  for (let i = 0; i < out.length; i++) out[i] *= gain;
  return out;
}

function wav(samples) {
  const bytes = samples.length * 2;
  const buf = Buffer.alloc(44 + bytes);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + bytes, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(1, 22); // mono
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(bytes, 40);
  for (let i = 0; i < samples.length; i++) {
    const v = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
  }
  return buf;
}

for (let midi = LOW; midi <= HIGH; midi++) {
  const freq = 440 * Math.pow(2, (midi - 69) / 12);
  writeFileSync(join(outDir, `${midi}.wav`), wav(pluck(freq)));
}
console.log(`wrote ${HIGH - LOW + 1} samples to ${outDir}`);
