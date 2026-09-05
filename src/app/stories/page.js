import PageHead from '@/components/ui/PageHead';
import ComingSoon from '@/components/ui/ComingSoon';

export const metadata = { title: 'Watch and explore' };

export default function Page() {
  return (
    <>
      <PageHead title="Watch and explore" subtitle="Films and journals from members and the desk." />
      <ComingSoon what="Watch and explore" />
    </>
  );
}
