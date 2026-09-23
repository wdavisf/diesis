/**
 * Web Audio sampler. One WAV per MIDI pitch lives under /public/samples/nylon (written by
 * tools/gen-samples.mjs). The AudioContext is created and resumed inside `prepare`, which the game
 * calls from the first tap, as browsers require.
 */
export interface NotePlayer {
  /** Must be called from a user gesture before anything can sound. Resolves when the given
   *  pitches are decoded and ready to play with low latency. */
  prepare(midiNotes: readonly number[]): Promise<void>;
  /** Plays the pitch at once. Overlapping calls overlap; nothing is cut short. */
  play(midi: number): void;
  dispose(): void;
}

export const SAMPLE_LOW = 40;
export const SAMPLE_HIGH = 88;

export function sampleUrl(midi: number, set = "nylon"): string {
  return `/samples/${set}/${midi}.wav`;
}

export function createNotePlayer(): NotePlayer {
  let ctx: AudioContext | null = null;
  const buffers = new Map<number, AudioBuffer>();
  const loading = new Map<number, Promise<void>>();

  function context(): AudioContext {
    if (!ctx) ctx = new AudioContext();
    return ctx;
  }

  function load(midi: number): Promise<void> {
    if (buffers.has(midi)) return Promise.resolve();
    const pending = loading.get(midi);
    if (pending) return pending;
    if (midi < SAMPLE_LOW || midi > SAMPLE_HIGH) return Promise.resolve();
    const task = (async () => {
      const bytes = await (await fetch(sampleUrl(midi))).arrayBuffer();
      buffers.set(midi, await context().decodeAudioData(bytes));
    })().finally(() => loading.delete(midi));
    loading.set(midi, task);
    return task;
  }

  return {
    async prepare(midiNotes) {
      const c = context();
      if (c.state !== "running") await c.resume();
      await Promise.all(midiNotes.map(load));
    },
    play(midi) {
      const buffer = buffers.get(midi);
      if (!ctx || !buffer) {
        void load(midi);
        return;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();
    },
    dispose() {
      void ctx?.close();
      ctx = null;
      buffers.clear();
    },
  };
}
