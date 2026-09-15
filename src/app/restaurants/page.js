import ScreenBar from '@/components/ui/ScreenBar';
import RestaurantsScreen from '@/components/offers/RestaurantsScreen';
import { restaurants } from '@/lib/content';
import { image } from '@/lib/images';

export const metadata = {
  title: 'Restaurant Offers',
  description: 'Member discounts at restaurants — walk in or book a table.',
};

export default function Page() {
  const list = restaurants.map((r) => ({ ...r, image: image(r.image) }));
  return (
    <>
      <ScreenBar title="Restaurant Offers" backHref="/" />
      <RestaurantsScreen restaurants={list} />
    </>
  );
}
