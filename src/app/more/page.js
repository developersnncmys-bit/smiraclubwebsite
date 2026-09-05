import PageHead from '@/components/ui/PageHead';
import ComingSoon from '@/components/ui/ComingSoon';

export const metadata = { title: 'More' };

export default function Page() {
  return (
    <>
      <PageHead title="More" subtitle="Support, about, contact and everything else." />
      <ComingSoon what="More" />
    </>
  );
}
