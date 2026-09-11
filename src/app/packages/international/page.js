import ScreenBar from '@/components/ui/ScreenBar';
import IntlTripsScreen from '@/components/packages/IntlTripsScreen';
import { packages, popularDestinations } from '@/lib/content';
import { image } from '@/lib/images';

export const metadata = {
  title: 'International Trips',
  description: 'Customised tours and fixed departures, with flights, stays and transfers arranged.',
};

/** Reached from the International Trip tile in All Services. */
export default function Page() {
  const art = Object.fromEntries([
    ...popularDestinations.map((d) => [d.key, image(d.image)]),
    ...packages.map((p) => [p.id, image(p.image)]),
  ]);

  return (
    <>
      <ScreenBar title="International Trips" backHref="/" />
      <IntlTripsScreen art={art} />
    </>
  );
}
