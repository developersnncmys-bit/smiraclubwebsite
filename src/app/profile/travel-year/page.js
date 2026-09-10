import ScreenBar from '@/components/ui/ScreenBar';
import TravelYear from '@/components/profile/TravelYear';
import { travelYears } from '@/lib/content';
import { image } from '@/lib/images';

export const metadata = {
  title: 'My Travel Year',
  description: 'A year of Smira Club trips, month by month.',
};

/** My Travel Year, from the profile screen's Your Information list. */
export default function Page() {
  const art = Object.fromEntries(
    Object.values(travelYears).flat().map((t) => [t.id, image(t.image)]),
  );

  return (
    <>
      <ScreenBar title="My Travel Year" backHref="/profile" />
      <TravelYear art={art} />
    </>
  );
}
