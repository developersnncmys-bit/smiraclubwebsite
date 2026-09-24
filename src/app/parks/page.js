import ScreenBar from '@/components/ui/ScreenBar';
import ParksScreen from '@/components/offers/ParksScreen';
import { parks } from '@/lib/content';
import { image } from '@/lib/images';
import DeskPicks from '@/components/desk/DeskPicks';
import { deskItems } from '@/lib/desk';

export const metadata = {
  title: 'Water park & Theme park',
  description: 'Member discounts on water parks and theme parks.',
};

export default async function Page() {
  /** Whatever the desk has put into Travel Inventory under Attractions. */
  const picks = await deskItems('Attractions');

  const list = parks.map((p) => ({ ...p, images: p.images.map((slot) => image(slot)) }));
  return (
    <>
      <ScreenBar title="Water park & Theme park" backHref="/" />
      <ParksScreen parks={list} />
      <DeskPicks items={picks} title="More parks from Smira" />
    </>
  );
}
