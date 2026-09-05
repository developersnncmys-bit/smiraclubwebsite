import PageHead from '@/components/ui/PageHead';
import ComingSoon from '@/components/ui/ComingSoon';

export const metadata = { title: 'Offers' };

export default function Page() {
  return (
    <>
      <PageHead title="Offers" subtitle="Weekend, seasonal, dining and salon offers for members." />
      <ComingSoon what="Offers" />
    </>
  );
}
