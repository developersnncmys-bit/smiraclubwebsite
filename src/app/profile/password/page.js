import ScreenBar from '@/components/ui/ScreenBar';
import ChangePassword from '@/components/profile/ChangePassword';

export const metadata = { title: 'Change Password' };

/** Change Password, from the profile screen's Your Information list. */
export default function Page() {
  return (
    <>
      <ScreenBar title="Change Password" backHref="/profile" />
      <ChangePassword />
    </>
  );
}
