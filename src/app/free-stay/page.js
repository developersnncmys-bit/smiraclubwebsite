import ScreenBar from '@/components/ui/ScreenBar';
import HotelsScreen from '@/components/hotels/HotelsScreen';
import DeskPicks from '@/components/desk/DeskPicks';
import { deskFreeStays } from '@/lib/desk';

export const metadata = {
  title: 'Free Stay',
  description: 'Complimentary rooms for Smira Club members — you only pay for food.',
};

/** Where the Free Stay tab lands. */
export default async function Page() {
  /**
   * The partners who have put rooms up as a free stay.
   *
   * A free stay is an ordinary hotel with the price moved onto the food, so
   * they are filed with the hotels and told apart by a mark the property
   * type sets. Without this a partner could register as Free Stay and
   * appear on the hotels screen and nowhere else.
   */
  const picks = await deskFreeStays();

  return (
    <>
      <ScreenBar title="Free Stay" backHref="/" />
      <HotelsScreen variant="free-stay" />
      <DeskPicks items={picks} title="More free stays from Smira" />
    </>
  );
}
