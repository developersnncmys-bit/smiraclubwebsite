import ScreenBar from '@/components/ui/ScreenBar';
import ActivitiesScreen from '@/components/offers/ActivitiesScreen';
import { luxuries, luxuryAvailableFrom, luxuryKinds } from '@/lib/content';
import { image } from '@/lib/images';
import DeskPicks from '@/components/desk/DeskPicks';
import { deskItems } from '@/lib/desk';

export const metadata = {
  title: 'Luxury Experiences',
  description: 'Helicopter rides, yachts, hot air balloons and more, at member prices.',
};

/** `searchParams` is read so "Bookings available from" is worked out per request. */
export default async function Page({ searchParams }) {
  /** Whatever the desk has put into Travel Inventory under Experiences. */
  const picks = await deskItems('Experiences');

  await searchParams;
  const list = luxuries.map((l) => ({ ...l, image: image(l.image), availableFrom: luxuryAvailableFrom(l) }));
  return (
    <>
      <ScreenBar title="Luxury Experiences" backHref="/" />
      <ActivitiesScreen
        activities={list}
        kinds={luxuryKinds}
        kindStyle="chips"
        foot="availability"
        title="Luxury Experiences"
        placeholder="Search luxury experiences or location"
        hrefBase="/luxury"
      />
      <DeskPicks items={picks} title="More luxury from Smira" />
    </>
  );
}
