/**
 * One interface, two implementations: `createNotePlayer.web.ts` on Web Audio,
 * `createNotePlayer.ts` on expo-audio for iOS and Android. Metro picks the file by platform.
 */
export interface NotePlayer {
  /**
   * Must be called from a user gesture on web before anything can sound; harmless elsewhere.
   * Resolves when the player is ready to play the given pitches with low latency.
   */
  prepare(midiNotes: readonly number[]): Promise<void>;
  /** Plays the pitch at once. Overlapping calls overlap; nothing is cut short. */
  play(midi: number): void;
  dispose(): void;
}
