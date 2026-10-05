/**
 * Whether a listing is in the place somebody searched for.
 *
 * The results screens took the destination and printed it — "2 Results
 * for Goa" — over a list they had not filtered at all. So the number was
 * right, the place was whatever had been typed, and the two had nothing
 * to do with each other: searching Manali showed the same Goa hotels
 * under a Manali heading.
 *
 * Matching is loose on purpose. "goa" should find "Baga, Goa", "candolim"
 * should find a hotel whose address says so, and somebody typing a hotel's
 * name should find the hotel. Being strict here means a real search comes
 * back empty, which is worse than one extra result.
 */
export function inPlace(item, where) {
  const q = String(where || '').trim().toLowerCase();
  if (!q) return true;

  const hay = [item.place, item.destination, item.locality, item.address, item.name]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  // Every word has to appear somewhere, so "south goa" does not match a
  // hotel that is merely in Goa while "goa" still matches all of them.
  return q.split(/\s+/).every((word) => hay.includes(word));
}

/** What a results screen calls the search when nobody named a place. */
export const placeLabel = (where) => String(where || '').trim() || 'all destinations';
