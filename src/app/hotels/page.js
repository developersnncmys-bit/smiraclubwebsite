import ScreenBar from '@/components/ui/ScreenBar';
import HotelsScreen from '@/components/hotels/HotelsScreen';

export const metadata = {
  title: 'Hotels & Resorts',
  description: 'Member rates on hotels and resorts, by the night or by the hour.',
};

/** Where the Hotel tab lands. */
export default function Page() {
  return (
    <>
      <ScreenBar title="Hotels & Resorts" backHref="/" />
      <HotelsScreen />
    </>
  );
}
