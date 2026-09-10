import ScreenBar from '@/components/ui/ScreenBar';
import ResultsScreen from '@/components/results/ResultsScreen';
import { searchResults } from '@/lib/content';
import { image } from '@/lib/images';
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

  const where = (params.destination || '').trim() || 'Goa';
  const when = stayLabel(params.from, params.to);
  const guests = guestLabel(params.adults, params.children);

  const results = searchResults.map((r) => ({ ...r, image: image(r.image) }));

  return (
    <>
      <ScreenBar title="Search results" backHref="/" />
      <ResultsScreen where={where} when={when} guests={guests} results={results} />
    </>
  );
}
