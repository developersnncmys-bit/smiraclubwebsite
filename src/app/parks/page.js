import ScreenBar from '@/components/ui/ScreenBar';
import ParksScreen from '@/components/offers/ParksScreen';
import { parks } from '@/lib/content';
import { image } from '@/lib/images';

export const metadata = {
  title: 'Water park & Theme park',
  description: 'Member discounts on water parks and theme parks.',
};

export default function Page() {
  const list = parks.map((p) => ({ ...p, images: p.images.map((slot) => image(slot)) }));
  return (
    <>
      <ScreenBar title="Water park & Theme park" backHref="/" />
      <ParksScreen parks={list} />
    </>
  );
}
