import ScreenBar from '@/components/ui/ScreenBar';
import GroundSearch from '@/components/support/GroundSearch';
import RequestScreen from '@/components/support/RequestScreen';

export const metadata = {
  title: 'Train/Bus',
  description: 'Send a train or bus request to the Smira Club travel desk.',
};

export default function Page() {
  return (
    <>
      <ScreenBar title="Train/Bus" backHref="/" />
      <RequestScreen title="Train/Bus">
        <GroundSearch />
      </RequestScreen>
    </>
  );
}
