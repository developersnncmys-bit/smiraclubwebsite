/**
 * Where a search lands, in one place.
 *
 * The home panel worked this out for itself. The header bar searches
 * too, and two copies of "which screen does a villa search open" is one
 * copy too many — the day a tab moves, only one of them gets fixed.
 */

/** Each tab has a screen of its own; a search goes to that screen. */
const RESULTS = {
  'free-stay': '/free-stay/results',
  hotel: '/results',
  villa: '/villas/search',
  package: '/packages',
};

/**
 * The URL a search opens, or '' when there is nothing to search for.
 *
 * Packages are not booked by the night, so dates and guests mean nothing
 * to that screen and it is given only what was typed.
 */
export function searchHref({
  kind = 'hotel',
  destination = '',
  from,
  to,
  adults = 2,
  rooms = 1,
  childAges = [],
} = {}) {
  const where = String(destination || '').trim();
  if (!where) return '';

  if (kind === 'package') return `/packages?destination=${encodeURIComponent(where)}`;

  const params = new URLSearchParams({
    kind,
    destination: where,
    from,
    to,
    adults: String(adults),
    rooms: String(rooms),
    children: String(childAges.length),
  });
  // A hotel prices a nine-year-old differently from a two-year-old, so the
  // ages travel with the search rather than just the count.
  if (childAges.length) params.set('ages', childAges.join(','));

  return `${RESULTS[kind] || '/results'}?${params.toString()}`;
}
