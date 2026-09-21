import ScreenBar from '@/components/ui/ScreenBar';
import GroupDeparturesScreen from '@/components/packages/GroupDeparturesScreen';
import { groupDepartureDates, groupDepartures } from '@/lib/content';
import { image } from '@/lib/images';

export const metadata = {
  title: 'Group Departures',
  description: 'Fixed-date group trips in India and abroad, with a tour manager and member prices.',
};

/**
 * `searchParams` is read so the departure dates are worked out per request —
 * they are counted from today — and so ?region= can pre-select a tab.
 */
export default async function Page({ searchParams }) {
  const params = (await searchParams) || {};
  const trips = groupDepartures.map((t) => ({
    id: t.id,
    region: t.region,
    name: t.name,
    place: t.place,
    nights: t.nights,
    price: t.price,
    was: t.was,
    rating: t.rating,
    reviews: t.reviews,
    groupSize: t.groupSize,
    image: image(t.image),
    dates: groupDepartureDates(t),
  }));

  return (
    <>
      <ScreenBar title="Group Departures" backHref="/" />
      <GroupDeparturesScreen trips={trips} initialRegion={params.region || 'all'} />
    </>
  );
}
