import PageHead from '@/components/ui/PageHead';
import ComingSoon from '@/components/ui/ComingSoon';

export const metadata = { title: 'Villas and homestays' };

export default function Page() {
  return (
    <>
      <PageHead title="Villas and homestays" subtitle="Whole villas in Goa, Alibaug, Lonavala and Coorg." />
      <ComingSoon what="Villas and homestays listings" />
    </>
  );
}
