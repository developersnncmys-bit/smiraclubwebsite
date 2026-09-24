import ScreenBar from '@/components/ui/ScreenBar';
import HotelsScreen from '@/components/hotels/HotelsScreen';
import DeskPicks from '@/components/desk/DeskPicks';
import { deskItems } from '@/lib/desk';

export const metadata = {
  title: 'Hotels & Resorts',
  description: 'Member rates on hotels and resorts, by the night or by the hour.',
};

/** Where the Hotel tab lands. */
export default async function Page() {
  /** Whatever the desk has put into Travel Inventory under Hotels. */
  const picks = await deskItems('Hotels');

  return (
    <>
      <ScreenBar title="Hotels & Resorts" backHref="/" />
      <HotelsScreen />
      <DeskPicks items={picks} title="More hotels from Smira" />
    </>
  );
}
