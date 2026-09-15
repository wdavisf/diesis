import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import type { NotePlayer } from './NotePlayer';
import { NYLON_SAMPLES } from './samples.generated';

/** expo-audio sampler for iOS and Android. One preloaded player per pitch; a pitch that is
 *  already sounding is restarted from the top, which reads as a fresh pluck. */
export function createNotePlayer(): NotePlayer {
  const players = new Map<number, AudioPlayer>();
  let modeSet = false;

  function playerFor(midi: number): AudioPlayer | null {
    const existing = players.get(midi);
    if (existing) return existing;
    const module = NYLON_SAMPLES[midi];
    if (module === undefined) return null;
    const player = createAudioPlayer(module, { downloadFirst: true });
    players.set(midi, player);
    return player;
  }

  return {
    async prepare(midiNotes) {
      if (!modeSet) {
        modeSet = true;
        // Practice apps must sound with the ringer switch off, like a tuner would.
        await setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers' });
      }
      for (const midi of midiNotes) playerFor(midi);
    },
    play(midi) {
      const player = playerFor(midi);
      if (!player) return;
      player.seekTo(0);
      player.play();
    },
    dispose() {
      for (const p of players.values()) p.remove();
      players.clear();
    },
  };
}
