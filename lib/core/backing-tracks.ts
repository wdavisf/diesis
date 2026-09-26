/**
 * Backing tracks: YouTube videos to jam over, each with the key it is in and a scale from
 * `scales.ts` that fits, so the neck can show it. Pure data. Every id was checked against
 * YouTube's oEmbed endpoint (embeddable) on 2026-09-26; style and scale are read from the title.
 * Display names live in lib/i18n.ts under `backing.styles` and `neck.scales`.
 */
import type { PitchClass } from './notes';

export const STYLES = ['blues', 'rock', 'metal', 'funk', 'jazz', 'modal', 'spanish', 'country', 'ballad', 'neosoul'] as const;
export type Style = (typeof STYLES)[number];

export interface BackingTrack {
  /** YouTube video id. */
  id: string;
  /** The video's own title and channel, as YouTube gives them. */
  title: string;
  channel: string;
  style: Style;
  /** The key's tonic and quality; null quality when the title names only the tonic (blues, modal). */
  key: { tonic: PitchClass; quality: 'major' | 'minor' | null };
  /** A scale that fits, and its root (not always the tonic: flamenco in E is A harmonic minor). */
  scale: { root: PitchClass; id: string };
  bpm?: number;
}

export const BACKING_TRACKS: readonly BackingTrack[] = [
  { id: 'HDhySTjuVt0', title: 'E Minor Simple Rock Guitar Backing Track bpm132', channel: 'SimpleJamTracks', style: 'rock', key: { tonic: 4, quality: 'minor' }, scale: { root: 4, id: 'pentaMinor' }, bpm: 132 },
  { id: 'iy0GSYAIxy0', title: 'Slow Blues Jam Backing Track (A) - Quist', channel: 'Quist', style: 'blues', key: { tonic: 9, quality: null }, scale: { root: 9, id: 'blues' } },
  { id: 'Eq7sH1sXCIw', title: 'A Minor Rock Guitar Backing Track (Am)', channel: 'Marc Guitar', style: 'rock', key: { tonic: 9, quality: 'minor' }, scale: { root: 9, id: 'minor' } },
  { id: 'yz6ScvpjFcQ', title: 'Funk Guitar Jam Track (key of E) | Backing Track for Guitar', channel: 'Pickup Music', style: 'funk', key: { tonic: 4, quality: null }, scale: { root: 4, id: 'dorian' } },
  { id: 'FdmquIgumds', title: 'Heavy Metal Guitar Backing Track - D Minor', channel: 'Greg Fitch', style: 'metal', key: { tonic: 2, quality: 'minor' }, scale: { root: 2, id: 'minor' } },
  { id: 'y1ueWz4-Hkk', title: 'Clapton Style Blues Shuffle Backing Track (A)', channel: 'Quist', style: 'blues', key: { tonic: 9, quality: null }, scale: { root: 9, id: 'pentaMinor' } },
  { id: 'Io2J3XhRu5w', title: 'Bossa Nova Blues Jam | Sexy Guitar Backing Track (Em)', channel: 'Quist', style: 'jazz', key: { tonic: 4, quality: 'minor' }, scale: { root: 4, id: 'pentaMinor' } },
  { id: 'tiAXSae0Deo', title: 'Epic Guitar Jam | D Dorian Backing Track - Quist', channel: 'Quist', style: 'modal', key: { tonic: 2, quality: null }, scale: { root: 2, id: 'dorian' } },
  { id: 'wJnlEKIkmU4', title: 'A Harmonic Minor E Phrygian Dominant Flamenco Backing Track', channel: 'Nick Neblo', style: 'spanish', key: { tonic: 4, quality: null }, scale: { root: 9, id: 'harmonicMinor' } },
  { id: 'IRqdyzrQa7A', title: 'Country Guitar Backing Track | G Major | 100 BPM | Free Track Friday', channel: 'Licklibrary', style: 'country', key: { tonic: 7, quality: 'major' }, scale: { root: 7, id: 'pentaMajor' }, bpm: 100 },
  { id: '6Fzfmjjld08', title: 'Joyful Mixolydian Guitar Backing Track (A)', channel: 'Quist', style: 'modal', key: { tonic: 9, quality: null }, scale: { root: 9, id: 'mixolydian' } },
  { id: 'n_DC3VO-5Jc', title: 'Sweet Ethereal Ballad Guitar Backing Track Jam in E', channel: 'Elevated Jam Tracks', style: 'ballad', key: { tonic: 4, quality: 'major' }, scale: { root: 4, id: 'pentaMajor' } },
  { id: 'DnU3hrvMPk0', title: 'Neo-Soul Guitar Jam Track (key of Em)', channel: 'Pickup Music', style: 'neosoul', key: { tonic: 4, quality: 'minor' }, scale: { root: 4, id: 'pentaMinor' } },
];

/** The styles that have at least one track, in `STYLES` order. */
export function stylesPresent(tracks: readonly BackingTrack[] = BACKING_TRACKS): Style[] {
  return STYLES.filter((s) => tracks.some((t) => t.style === s));
}

export function tracksOf(style: Style | 'all', tracks: readonly BackingTrack[] = BACKING_TRACKS): BackingTrack[] {
  return style === 'all' ? [...tracks] : tracks.filter((t) => t.style === style);
}
