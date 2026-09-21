/**
 * The version of the service artwork in public/img/services/.
 *
 * Browsers and the image optimiser keep a copy of every icon by its address,
 * so a new file saved under an old name keeps showing the old picture. Bump
 * this number whenever the icons are replaced and every copy is fetched
 * fresh. next.config.mjs reads it too (hence .mjs) — Next only optimises a local image
 * with a query string when the config allows that exact query.
 */
export const SERVICE_ART_VERSION = '2';
