import ScreenBar from '@/components/ui/ScreenBar';
import FlightSearch from '@/components/support/FlightSearch';
import RequestScreen from '@/components/support/RequestScreen';

export const metadata = {
  title: 'Flight Search',
  description: 'Send a flight request to the Smira Club travel desk.',
};

export default function Page() {
  return (
    <>
      <ScreenBar title="Flight Search" backHref="/" />
      <RequestScreen title="Flight Search">
        <FlightSearch />
      </RequestScreen>
    </>
  );
}
