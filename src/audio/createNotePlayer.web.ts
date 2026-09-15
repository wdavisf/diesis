import { Asset } from 'expo-asset';
import type { NotePlayer } from './NotePlayer';
import { NYLON_SAMPLES } from './samples.generated';

/** Web Audio sampler. The AudioContext is created and resumed inside `prepare`, which the app
 *  calls from the first tap, as browsers require. */
export function createNotePlayer(): NotePlayer {
  let ctx: AudioContext | null = null;
  const buffers = new Map<number, AudioBuffer>();
  const loading = new Map<number, Promise<void>>();

  function context(): AudioContext {
    if (!ctx) {
      ctx = new AudioContext();
    }
    return ctx;
  }

  function load(midi: number): Promise<void> {
    if (buffers.has(midi)) return Promise.resolve();
    const pending = loading.get(midi);
    if (pending) return pending;
    const module = NYLON_SAMPLES[midi];
    if (module === undefined) return Promise.resolve();
    const task = (async () => {
      const asset = Asset.fromModule(module);
      await asset.downloadAsync();
      const uri = asset.localUri ?? asset.uri;
      const bytes = await (await fetch(uri)).arrayBuffer();
      buffers.set(midi, await context().decodeAudioData(bytes));
    })().finally(() => loading.delete(midi));
    loading.set(midi, task);
    return task;
  }

  return {
    async prepare(midiNotes) {
      const c = context();
      if (c.state !== 'running') {
        await c.resume();
      }
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
