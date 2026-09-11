import ScreenBar from '@/components/ui/ScreenBar';
import DeactivateAccount from '@/components/profile/DeactivateAccount';

export const metadata = {
  title: 'Deactivate Account',
  description: 'What deactivating your Smira Club account affects, and how long you have to undo it.',
};

/** Reached from Delete Account on the profile screen. */
export default function Page() {
  return (
    <>
      <ScreenBar title="Deactivate Account" backHref="/profile" />
      <DeactivateAccount />
    </>
  );
}
