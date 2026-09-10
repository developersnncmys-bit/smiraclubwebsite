import ScreenBar from '@/components/ui/ScreenBar';
import SavedAddresses from '@/components/profile/SavedAddresses';

export const metadata = {
  title: 'Saved Address',
  description: 'Where Smira Club sends your gifts and anything else that needs posting.',
};

/** Saved Address, from the profile screen's Your Information list. */
export default function Page() {
  return (
    <>
      <ScreenBar title="Saved Address" backHref="/profile" />
      <SavedAddresses />
    </>
  );
}
