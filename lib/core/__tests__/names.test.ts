import { describe, expect, it } from 'vitest';
import { namesFor, SHARP_NAMES, SOLFEGE_NAMES } from '../notes';

describe('note name styles', () => {
  it('has twelve names in each style, sharps written with ♯', () => {
    expect(SOLFEGE_NAMES).toHaveLength(12);
    expect(SOLFEGE_NAMES.filter((n) => n.endsWith('♯'))).toHaveLength(5);
    expect(SHARP_NAMES.filter((n) => n.endsWith('♯'))).toHaveLength(5);
  });

  it('maps the same pitch class to both spellings', () => {
    expect(namesFor('letters')[7]).toBe('G');
    expect(namesFor('solfege')[7]).toBe('Sol');
    expect(namesFor('solfege')[0]).toBe('Do');
    expect(namesFor('letters')).toBe(SHARP_NAMES);
  });
});
