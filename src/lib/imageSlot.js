/**
 * Turns an image slot into something an <Image> can actually load, without
 * touching the filesystem — so a client component can call it.
 *
 * A slot that has already been resolved on the server ("/img/hero.jpg") comes
 * back untouched. A bare slot ("hero-benefits") becomes its committed
 * placeholder. That way no component can ever hand next/image a bare name,
 * whatever route it renders through.
 */
export function toSrc(slot) {
  if (!slot) return '/img/placeholder.svg';
  const value = String(slot);
  if (value.startsWith('/') || value.startsWith('http')) return value;
  return `/img/${value}.svg`;
}
