import PageHead from '@/components/ui/PageHead';
import ComingSoon from '@/components/ui/ComingSoon';

export const metadata = { title: 'Search' };

export default function Page() {
  return (
    <>
      <PageHead title="Search" subtitle="Tell us where and when, and we will do the looking." />
      <ComingSoon what="Search" />
    </>
  );
}
