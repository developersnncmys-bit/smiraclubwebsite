import ScreenBar from '@/components/ui/ScreenBar';
import ActivitiesScreen from '@/components/offers/ActivitiesScreen';
import { activities } from '@/lib/content';
import { image } from '@/lib/images';
import DeskPicks from '@/components/desk/DeskPicks';
import { deskItems } from '@/lib/desk';

export const metadata = {
  title: 'Camping & Adventure',
  description: 'Member discounts on camping, rafting, ziplines and more.',
};

export default async function Page() {
  /** Whatever the desk has put into Travel Inventory under Activities. */
  const picks = await deskItems('Activities');

  const list = activities.map((a) => ({ ...a, image: image(a.image) }));
  return (
    <>
      <ScreenBar title="Camping & Adventure" backHref="/" />
      <ActivitiesScreen activities={list} />
      <DeskPicks items={picks} title="More to do, from Smira" />
    </>
  );
}
