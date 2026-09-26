import { describe, expect, it } from 'vitest';
import { AMAZON_TAG, amazonSearch, setName } from '../shop';

describe('shop', () => {
  it('builds an Amazon.es search link carrying the store id', () => {
    const url = new URL(amazonSearch('cuerdas guitarra eléctrica 10-46'));
    expect(url.origin).toBe('https://www.amazon.es');
    expect(url.pathname).toBe('/s');
    expect(url.searchParams.get('k')).toBe('cuerdas guitarra eléctrica 10-46');
    expect(url.searchParams.get('tag')).toBe(AMAZON_TAG);
  });

  it('names a set by its end gauges', () => {
    expect(setName([10, 13, 17, 26, 36, 46])).toBe('10-46');
    expect(setName([9.5, 11, 16, 24, 32, 42])).toBe('9.5-42');
  });
});
