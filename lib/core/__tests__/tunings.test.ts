import { describe, expect, it } from 'vitest';
import { midiAt, pitchClassAt, stringsOf, tuningPreset, tuningsFor, TUNINGS } from '../notes';
import { candidatePositions, DEFAULT_SETTINGS, positionsOf } from '../quiz';
import { neckNotes, scaleOf } from '../scales';

describe('tunings', () => {
  it('offers presets for six, seven and eight strings', () => {
    expect(tuningsFor(6).length).toBeGreaterThan(4);
    expect(tuningsFor(7).map((t) => t.id)).toEqual(['standard7', 'dropA7']);
    expect(tuningsFor(8).map((t) => t.id)).toEqual(['standard8', 'dropE8']);
    for (const t of TUNINGS) expect(t.notes.every((n, i) => i === 0 || n < t.notes[i - 1])).toBe(true);
  });

  it('falls back to standard six-string tuning', () => {
    expect(tuningPreset('nope').id).toBe('standard6');
    expect(tuningPreset(null).notes).toHaveLength(6);
  });

  it('reads notes on a seven-string: the low B', () => {
    const seven = tuningPreset('standard7').notes;
    expect(midiAt({ string: 7, fret: 0 }, seven)).toBe(35);
    expect(pitchClassAt({ string: 7, fret: 0 }, seven)).toBe(11); // B
    expect(pitchClassAt({ string: 6, fret: 0 }, tuningPreset('dropD').notes)).toBe(2); // D
  });

  it('asks questions on every string of the tuning', () => {
    const eight = tuningPreset('standard8').notes;
    const settings = { ...DEFAULT_SETTINGS, tuning: eight, strings: stringsOf(eight) };
    expect(candidatePositions(settings)).toHaveLength(8 * 13);
    // F♯ (6): the open eighth string is one of them.
    expect(positionsOf(6, settings)).toContainEqual({ string: 8, fret: 0 });
  });

  it('lays scales on any tuning', () => {
    const dropA = tuningPreset('dropA7').notes;
    const notes = neckNotes(9, scaleOf('pentaMinor'), 0, 12, dropA);
    expect(notes.find((n) => n.position.string === 7 && n.position.fret === 0)).toMatchObject({ root: true, degree: '1' });
  });
});
