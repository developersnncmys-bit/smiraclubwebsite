/**
 * Where a property actually is, as links Google will honour.
 *
 * The desk and the partner are both asked for a latitude and a longitude
 * when a listing is created, and both are required — and the detail pages
 * were throwing them away and searching Google for the address instead. An
 * address typed by a partner has a typo in it often enough that the pin
 * lands in the wrong town, or nowhere at all, which is exactly what the
 * coordinates were collected to prevent.
 *
 * `gps` is whatever the listing holds: a pair of numbers, a Google Maps
 * share link, or nothing. Each gets the best link it can support.
 */

/** "18.9100, 73.3233" — a pair of numbers that could be a place on Earth. */
export function coordsOf(gps) {
  const pair = String(gps || '')
    .trim()
    .match(/^(-?\d{1,3}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)$/);
  if (!pair) return null;

  const lat = Number(pair[1]);
  const lng = Number(pair[2]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  // 0,0 is in the Atlantic. It is what an empty form submits, not a villa.
  if (lat === 0 && lng === 0) return null;

  return { lat, lng };
}

const isUrl = (v) => /^https?:\/\//i.test(String(v || '').trim());

/**
 * The two links the Location card draws.
 *
 * `map` opens the place. `pano` opens Street View standing at it, which
 * needs its own address — both buttons used to go to the same search, so
 * the one labelled Street View never once showed a street view.
 */
export function mapLinks({ gps, address, name } = {}) {
  const at = coordsOf(gps);

  if (at) {
    const point = `${at.lat},${at.lng}`;
    return {
      map: `https://www.google.com/maps/search/?api=1&query=${point}`,
      pano: `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${point}`,
      exact: true,
    };
  }

  /*
   * No coordinates, so the best that can be done is a search. The name
   * is only worth adding when the address does not already open with it,
   * or the query reads "Smira Villa, Smira Villa, Plot no. 133".
   */
  const where = String(address || "").trim();
  const titled = String(name || "").trim();
  const known = titled && where.toLowerCase().startsWith(titled.toLowerCase());
  const query = encodeURIComponent([known ? "" : titled, where].filter(Boolean).join(", "));
  const search = `https://www.google.com/maps/search/?api=1&query=${query}`;

  return {
    map: isUrl(gps) ? String(gps).trim() : search,
    /*
     * Street View stands at a point, and there is no point. The card
     * draws nothing rather than a second button that opens the same
     * search under a label promising something else.
     */
    pano: null,
    exact: false,
  };
}
