import PageHead from '@/components/ui/PageHead';
import ComingSoon from '@/components/ui/ComingSoon';

export const metadata = { title: 'Wishlist' };

export default function Page() {
  return (
    <>
      <PageHead title="Wishlist" subtitle="Everything you have saved for later." />
      <ComingSoon what="Wishlist" />
    </>
  );
}
