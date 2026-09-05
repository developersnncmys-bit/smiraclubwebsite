import PageHead from '@/components/ui/PageHead';
import ComingSoon from '@/components/ui/ComingSoon';

export const metadata = { title: 'Hotels' };

export default function Page() {
  return (
    <>
      <PageHead title="Hotels" subtitle="Member rates at hotels across India and beyond." />
      <ComingSoon what="Hotels listings" />
    </>
  );
}
