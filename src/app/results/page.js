import ResultsScreen from '@/components/results/ResultsScreen';
import { searchResults } from '@/lib/content';
import { asResult, deskItems } from '@/lib/desk';
import { image } from '@/lib/images';
import { inPlace, placeLabel } from '@/lib/search';
import { shortDate } from '@/lib/format';

export const metadata = {
  title: 'Search results',
  description: 'Hotels, free stays, packages and villas at member prices.',
};

function stayLabel(from, to) {
  if (!from || !to) return 'Any dates';
  const a = new Date(from);
  const b = new Date(to);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 'Any dates';
  return `${shortDate(a)} - ${shortDate(b)}`;
}

function guestLabel(adults, children) {
  const n = (Number(adults) || 0) + (Number(children) || 0);
  const total = n > 0 ? n : 2;
  return `${total} Guest${total === 1 ? '' : 's'}`;
}

/**
 * Where the home screen's Search lands.
 *
 * The home search is not tied to one category, so this returns all of them
 * and lets the chips narrow it — which is why it is its own route rather
 * than one of the category screens. `/search` is the AI screen and stays
 * that; this is the plain one.
 *
 * `searchParams` is a promise in Next 16, so it is awaited before anything
 * reads it, and reading it makes the page render per request.
 */
export default async function Page({ searchParams }) {
  const params = (await searchParams) || {};

  // What they actually typed. It used to fall back to Goa, so a search
  // with nothing in it opened a Goa page nobody had asked for.
  const where = (params.destination || '').trim();
  // An hourly stay is one day, so its line reads the time and length instead.
  const when =
    params.mode === 'hourly' && params.checkin
      ? `${shortDate(params.from)}, ${params.checkin} · ${params.hours} Hrs`
      : stayLabel(params.from, params.to);
  const guests = guestLabel(params.adults, params.children);

  /**
   * The site's own listings, and every partner the desk has put live.
   *
   * A partner used to reach only a "More from Smira" strip at the foot of
   * a category screen, which is not where anybody browses. They belong in
   * the same list as everything else, so they are mapped into the same
   * shape and sorted in — newest partners first, so a place that has just
   * joined is seen.
   */
  const [hotels, villas] = await Promise.all([deskItems('Hotels'), deskItems('Villas')]);
  const fromDesk = [
    ...hotels.map((h) => asResult(h, 'hotel')),
    ...villas.map((v) => asResult(v, 'villa')),
  ];

  const results = [
    ...fromDesk,
    ...searchResults.map((r) => ({ ...r, image: image(r.image) })),
  ].filter((r) => inPlace(r, where));

  // Arriving from Hotels & Resorts brings that screen's chips and back arrow.
  const fromHotels = params.kind === 'hotel';

  return (
    <ResultsScreen
      where={placeLabel(where)}
      when={when}
      guests={guests}
      results={results}
      variant={fromHotels ? 'hotel' : 'all'}
      backHref={fromHotels ? '/hotels' : '/'}
    />
  );
}
