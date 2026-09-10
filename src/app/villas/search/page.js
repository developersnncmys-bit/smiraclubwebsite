import ScreenBar from '@/components/ui/ScreenBar';
import VillaResults from '@/components/villas/VillaResults';
import { villaCollections, villaResults } from '@/lib/content';
import { image } from '@/lib/images';
import { shortDate } from '@/lib/format';

export const metadata = { title: 'Villas & Home Stays' };

/** "29 Aug - 31 Aug", the way the summary bar writes a stay. */
function stayLabel(from, to) {
  if (!from || !to) return 'Any dates';
  const a = new Date(from);
  const b = new Date(to);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 'Any dates';
  return `${shortDate(a)} - ${shortDate(b)}`;
}

/** "2 Guests", counting the children the guests panel collected. */
function guestLabel(adults, children) {
  const n = (Number(adults) || 0) + (Number(children) || 0);
  const total = n > 0 ? n : 2;
  return `${total} Guest${total === 1 ? '' : 's'}`;
}

/**
 * Villa search results.
 *
 * `searchParams` is a promise in Next 16 — synchronous access was removed —
 * so it is awaited before anything reads it. Reading it also makes this page
 * render per request rather than prerender, which is right: a result set
 * belongs to the search that asked for it.
 *
 * The image slots are resolved here because `image()` reads the filesystem,
 * which only the server can do; the client screen below takes real paths.
 */
export default async function Page({ searchParams }) {
  const params = await searchParams;

  const where = (params?.destination || '').trim() || 'Goa';
  const when = stayLabel(params?.from, params?.to);
  const guests = guestLabel(params?.adults, params?.children);

  const villas = villaResults.map((v) => ({ ...v, image: image(v.image) }));
  const collections = villaCollections.map((c) => ({ ...c, image: image(c.image) }));

  return (
    <>
      <ScreenBar title="Villas & Home Stays" backHref="/villas" />

      <VillaResults
        where={where}
        when={when}
        guests={guests}
        villas={villas}
        collections={collections}
        query={new URLSearchParams(params).toString()}
      />
    </>
  );
}
