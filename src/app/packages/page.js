import PageHead from '@/components/ui/PageHead';
import ComingSoon from '@/components/ui/ComingSoon';

export const metadata = { title: 'Packages' };

export default function Page() {
  return (
    <>
      <PageHead title="Packages" subtitle="India, international, group departures and island trips." />
      <ComingSoon what="Packages listings" />
    </>
  );
}
