import FreeStayResults from '@/components/hotels/FreeStayResults';
import { hotels } from '@/lib/content';
import { image } from '@/lib/images';
import { defaultStay, shortDate } from '@/lib/format';

export const metadata = {
  title: 'Free Stay results',
  description: 'Complimentary rooms for members — you only pay for food.',
};

const isoDay = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const valid = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v || '');

/**
 * Free Stay results.
 *
 * `searchParams` is a promise in Next 16, so it is awaited. The stay is
 * settled here — missing dates become the default stay — and carried to the
 * hotel page, so every screen after this one agrees on the same nights.
 */
export default async function Page({ searchParams }) {
  const params = (await searchParams) || {};
  const fallback = defaultStay();

  const where = (params.destination || '').trim() || 'Goa';
  const from = valid(params.from) ? params.from : isoDay(fallback.from);
  const to = valid(params.to) && params.to > from ? params.to : isoDay(fallback.to);
  const adults = Number(params.adults) || 2;
  const children = Number(params.children) || 0;
  const rooms = Number(params.rooms) || 1;

  const guests = adults + children;
  const summary = `${shortDate(from)} - ${shortDate(to)}, ${guests} Guest${guests === 1 ? '' : 's'}`;
  const carry = new URLSearchParams({
    from, to, adults: String(adults), children: String(children), rooms: String(rooms),
  }).toString();

  const list = hotels.map((h) => ({ ...h, image: image(h.image) }));

  return <FreeStayResults where={where} summary={summary} hotels={list} carry={carry} />;
}
