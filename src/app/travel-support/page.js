import ScreenBar from '@/components/ui/ScreenBar';
import TravelSupportScreen from '@/components/support/TravelSupportScreen';

export const metadata = {
  title: 'Travel Support',
  description: 'Visa assistance, travel insurance, currency exchange and international SIM cards.',
};

export default function Page() {
  return (
    <>
      <ScreenBar title="Travel Support" backHref="/" />
      <TravelSupportScreen />
    </>
  );
}
