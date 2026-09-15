import ScreenBar from '@/components/ui/ScreenBar';
import ActivitiesScreen from '@/components/offers/ActivitiesScreen';
import { activities } from '@/lib/content';
import { image } from '@/lib/images';

export const metadata = {
  title: 'Camping & Adventure',
  description: 'Member discounts on camping, rafting, ziplines and more.',
};

export default function Page() {
  const list = activities.map((a) => ({ ...a, image: image(a.image) }));
  return (
    <>
      <ScreenBar title="Camping & Adventure" backHref="/" />
      <ActivitiesScreen activities={list} />
    </>
  );
}
