import ScreenBar from '@/components/ui/ScreenBar';
import WishlistScreen from '@/components/profile/WishlistScreen';

export const metadata = { title: 'Wishlist', description: 'Everything you have saved for later.' };

export default function Page() {
  return (
    <>
      <ScreenBar title="Wishlist" backHref="/" />
      <WishlistScreen />
    </>
  );
}
