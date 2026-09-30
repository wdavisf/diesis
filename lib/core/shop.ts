/**
 * Affiliate links to Amazon.es (Will's Associates store id). Search links, not product links:
 * they need no per-product code, never go stale when a listing disappears, and the tag earns on
 * whatever the visitor buys in that session. Amazon.es only for now: English visitors outside
 * Spain would need their own marketplace's programme (OneLink), which Will has not joined.
 * The disclosure Amazon requires is shown next to every link and in the footer.
 */
export const AMAZON_TAG = 'willdafer-21';
export const AMAZON_HOST = 'https://www.amazon.es';

export function amazonSearch(query: string): string {
  const url = new URL('/s', AMAZON_HOST);
  url.searchParams.set('k', query);
  url.searchParams.set('tag', AMAZON_TAG);
  return url.toString();
}

/** "10-46", "10-68": a set is named by its thinnest and thickest gauge. */
export function setName(gauges: readonly number[]): string {
  return `${gauges[0]}-${gauges[gauges.length - 1]}`;
}

/** Why a pick is on the list; the wording is in `strings.setup.picks`. */
export type PickKind = 'nickel' | 'coated' | 'bronze' | 'normal' | 'hard';
export interface StringPick {
  /** Its picture, `public/picks/<id>.webp`: an unbranded illustration made by tools/gen-images.mjs, not the maker's pack. */
  id: string;
  /** Maker and model, as sold; the link is an Amazon.es search for exactly this. */
  name: string;
  kind: PickKind;
}

const dadd = (model: string, kind: PickKind = 'nickel'): StringPick => ({ id: model.toLowerCase(), name: `D'Addario ${model}`, kind });

/** Real sets sold at exactly these gauges, by set name. Only sets Will can stand behind: no entry, no suggestion. */
const ELECTRIC_PICKS: Record<string, StringPick[]> = {
  '9-42': [dadd('EXL120'), { id: 'eb2223', name: 'Ernie Ball Super Slinky 2223', kind: 'nickel' }, { id: 'elixir12002', name: 'Elixir Nanoweb 12002', kind: 'coated' }],
  '10-46': [dadd('EXL110'), { id: 'eb2221', name: 'Ernie Ball Regular Slinky 2221', kind: 'nickel' }, { id: 'elixir12052', name: 'Elixir Nanoweb 12052', kind: 'coated' }],
  '10-52': [dadd('EXL140'), { id: 'eb2215', name: 'Ernie Ball Skinny Top Heavy Bottom 2215', kind: 'nickel' }],
  '11-49': [dadd('EXL115')],
  '11-56': [dadd('EXL117')],
  '13-62': [dadd('EXL158')],
  '14-68': [dadd('EXL157')],
  '9-54': [dadd('EXL120-7')],
  '10-59': [dadd('EXL110-7')],
  '9-65': [dadd('EXL120-8')],
  '10-74': [dadd('EXL110-8')],
};
const ACOUSTIC_PICKS: StringPick[] = [dadd('EJ15', 'bronze'), dadd('EJ26', 'bronze'), dadd('EJ16', 'bronze')];
const CLASSICAL_PICKS: StringPick[] = [dadd('EJ45', 'normal'), dadd('EJ46', 'hard')];

/** Named strings for the guitar type and the set on it (`setId` like "10-46", null when the gauges match no common set). */
export function picksFor(typeId: string, nylon: boolean, setId: string | null): StringPick[] {
  if (nylon) return CLASSICAL_PICKS;
  if (typeId === 'acoustic') return ACOUSTIC_PICKS;
  return (setId && ELECTRIC_PICKS[setId]) || [];
}
