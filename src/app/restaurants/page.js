import ScreenBar from '@/components/ui/ScreenBar';
import RestaurantsScreen from '@/components/offers/RestaurantsScreen';
import { restaurants } from '@/lib/content';
import { image } from '@/lib/images';
import DeskPicks from '@/components/desk/DeskPicks';
import { deskItems } from '@/lib/desk';

export const metadata = {
  title: 'Restaurant Offers',
  description: 'Member discounts at restaurants — walk in or book a table.',
};

export default async function Page() {
  /** Whatever the desk has put into Travel Inventory under Restaurants. */
  const picks = await deskItems('Restaurants');

  const list = restaurants.map((r) => ({ ...r, image: image(r.image) }));
  return (
    <>
      <ScreenBar title="Restaurant Offers" backHref="/" />
      <RestaurantsScreen restaurants={list} />
      <DeskPicks items={picks} title="More restaurants from Smira" />
    </>
  );
}
