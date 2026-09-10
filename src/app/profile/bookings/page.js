import ScreenBar from '@/components/ui/ScreenBar';
import MyBookings from '@/components/profile/MyBookings';
import { myBookings } from '@/lib/content';
import { image } from '@/lib/images';

export const metadata = {
  title: 'My Bookings',
  description: 'Every stay you have booked, and where each one has got to.',
};

/** My Bookings, from the profile screen's Your Information list. */
export default function Page() {
  const art = Object.fromEntries(myBookings.map((b) => [b.id, image(b.image)]));

  return (
    <>
      <ScreenBar title="My Bookings" backHref="/profile" />
      <MyBookings art={art} />
    </>
  );
}
