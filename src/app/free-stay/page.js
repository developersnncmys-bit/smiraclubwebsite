import ScreenBar from '@/components/ui/ScreenBar';
import HotelsScreen from '@/components/hotels/HotelsScreen';

export const metadata = {
  title: 'Free Stay',
  description: 'Complimentary rooms for Smira Club members — you only pay for food.',
};

/** Where the Free Stay tab lands. */
export default function Page() {
  return (
    <>
      <ScreenBar title="Free Stay" backHref="/" />
      <HotelsScreen variant="free-stay" />
    </>
  );
}
