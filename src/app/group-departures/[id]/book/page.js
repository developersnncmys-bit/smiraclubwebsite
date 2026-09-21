import { notFound } from 'next/navigation';
import ScreenBar from '@/components/ui/ScreenBar';
import PackageBooking from '@/components/packages/PackageBooking';
import { groupDepartureDates, groupDepartures, packageTaxRate } from '@/lib/content';
import { image } from '@/lib/images';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const trip = groupDepartures.find((t) => t.id === id);
  return { title: trip ? `Review Booking — ${trip.name}` : 'Review Booking' };
}

/**
 * Review Booking for a group departure — the package booking screen, told
 * which dates still have seats and what was chosen on the trip page.
 */
export default async function Page({ params, searchParams }) {
  const { id } = await params;
  const q = (await searchParams) || {};
  const trip = groupDepartures.find((t) => t.id === id);
  if (!trip) notFound();

  const open = groupDepartureDates(trip).filter((d) => d.seats > 0);
  if (!open.length) notFound();
  const seats = Object.fromEntries(open.map((d) => [d.date, d.seats]));

  const adults = Math.max(1, Number(q.adults) || 2);
  const children = Math.max(0, Number(q.children) || 0);

  return (
    <div className="pb-36 lg:pb-12">
      <ScreenBar title="Review Booking" backHref={`/group-departures/${trip.id}`} />
      <div className="shell py-4">
        <PackageBooking
          pkg={{
            id: trip.id,
            name: trip.name,
            place: trip.place,
            nights: trip.nights,
            price: trip.price,
            was: trip.was,
            rating: trip.rating,
            reviews: trip.reviews,
          }}
          photo={image(trip.image)}
          departures={open.map((d) => d.date)}
          seats={seats}
          taxRate={packageTaxRate}
          kind="group"
          badge="Group Departure"
          initial={{ departure: q.date, adults, children }}
        />
      </div>
    </div>
  );
}
