import ScreenBar from '@/components/ui/ScreenBar';
import MyBookings from '@/components/profile/MyBookings';

export const metadata = {
  title: 'My Bookings',
  description: 'Every stay you have booked, and where each one has got to.',
};

/**
 * My Bookings, from the profile screen's Your Information list.
 *
 * It used to hand down a map of pictures keyed by the sample bookings'
 * own ids. Real bookings carry their own, and the samples are gone, so
 * the map matched nothing and only shipped their references to the
 * browser.
 */
export default function Page() {
  return (
    <>
      <ScreenBar title="My Bookings" backHref="/profile" />
      <MyBookings />
    </>
  );
}
