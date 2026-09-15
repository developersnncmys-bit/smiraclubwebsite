import HourlyResults from '@/components/hotels/HourlyResults';
import { hourlyHotels } from '@/lib/content';
import { image } from '@/lib/images';

export const metadata = {
  title: 'Hourly Stays',
  description: 'Hotel rooms by the hour, at your check-in time.',
};

const isoDay = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/**
 * Hourly stay results.
 *
 * `searchParams` is a promise in Next 16, so it is awaited; the search is
 * normalised here — a missing day is today, a missing time is 2 PM — so the
 * list, the hotel page and Review Booking all agree on one slot.
 */
export default async function Page({ searchParams }) {
  const params = (await searchParams) || {};

  const search = {
    destination: (params.destination || '').trim() || 'Goa',
    date: /^\d{4}-\d{2}-\d{2}$/.test(params.date || '') ? params.date : isoDay(new Date()),
    time: /^\d{2}:\d{2}$/.test(params.time || '') ? params.time : '14:00',
    adults: Number(params.adults) || 2,
    rooms: Number(params.rooms) || 1,
    children: Number(params.children) || 0,
  };

  const hotels = hourlyHotels.map((h) => ({ ...h, images: h.images.map((slot) => image(slot)) }));

  return <HourlyResults search={search} hotels={hotels} />;
}
