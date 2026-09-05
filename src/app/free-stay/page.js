import PageHead from '@/components/ui/PageHead';
import ComingSoon from '@/components/ui/ComingSoon';

export const metadata = { title: 'Free stays' };

export default function Page() {
  return (
    <>
      <PageHead title="Free stays" subtitle="Rooms on the house. Members only pay for food." />
      <ComingSoon what="Free stays listings" />
    </>
  );
}
