import ScreenBar from '@/components/ui/ScreenBar';
import SavingsScreen from '@/components/profile/SavingsScreen';

export const metadata = {
  title: 'Your savings',
  description: 'What your membership and our offers have taken off your bookings.',
};

/** "View Savings Details" on the profile screen led here, and here was nothing. */
export default function Page() {
  return (
    <>
      <ScreenBar title="Your savings" backHref="/profile" />
      <SavingsScreen />
    </>
  );
}
