import ScreenBar from '@/components/ui/ScreenBar';
import MemberLogin from '@/components/auth/MemberLogin';

export const metadata = {
  title: 'Log in',
  description: 'Log in to Smira Club with your mobile number to see your membership and bookings.',
};

/** Reached from Log in in the header, and from anywhere that needs a member. */
export default function Page() {
  return (
    <>
      <ScreenBar title="Log in" backHref="/" />
      <MemberLogin />
    </>
  );
}
