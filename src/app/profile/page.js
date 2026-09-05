import PageHead from '@/components/ui/PageHead';
import ComingSoon from '@/components/ui/ComingSoon';

export const metadata = { title: 'Profile' };

export default function Page() {
  return (
    <>
      <PageHead title="Profile" subtitle="Your membership, bookings, rewards and referrals." />
      <ComingSoon what="Profile" />
    </>
  );
}
