import ScreenBar from '@/components/ui/ScreenBar';
import MemberLogin from '@/components/auth/MemberLogin';

export const metadata = {
  title: 'Log in',
  description: 'Log in to Smira Club with your mobile number to see your membership and bookings.',
};

/** The sheet's own page, for a link sent straight to signing in. */
export default function Page() {
  return (
    <>
      <ScreenBar title="Login" backHref="/" />
      <MemberLogin />
    </>
  );
}
