import { notFound } from 'next/navigation';
import ScreenBar from '@/components/ui/ScreenBar';
import PackageBooking from '@/components/packages/PackageBooking';
import { packageDepartures, packages, packageTaxRate } from '@/lib/content';
import { image } from '@/lib/images';

export function generateStaticParams() {
  return packages.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const pkg = packages.find((p) => p.id === id);
  return { title: pkg ? `Review Booking — ${pkg.name}` : 'Review Booking' };
}

/**
 * Review Booking for a fixed-departure package — where Book Now on a
 * package page goes.
 *
 * The departure dates are worked out when the page is built; the rest of the
 * screen changes with the traveller count, so it lives in a client component.
 */
export default async function Page({ params }) {
  const { id } = await params;
  const pkg = packages.find((p) => p.id === id);
  if (!pkg) notFound();

  return (
    <div className="pb-36 lg:pb-12">
      <ScreenBar title="Review Booking" backHref={`/packages/${pkg.id}`} />

      <div className="shell py-4">
        <PackageBooking
          pkg={{
            id: pkg.id,
            name: pkg.name,
            place: pkg.place,
            nights: pkg.nights,
            price: pkg.price,
            was: pkg.was,
            rating: pkg.rating,
            reviews: pkg.reviews,
          }}
          photo={image(pkg.image)}
          departures={packageDepartures(8)}
          taxRate={packageTaxRate}
        />
      </div>
    </div>
  );
}
