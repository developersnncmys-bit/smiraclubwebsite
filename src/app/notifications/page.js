import PageHead from '@/components/ui/PageHead';
import ComingSoon from '@/components/ui/ComingSoon';

export const metadata = { title: 'Notifications' };

export default function Page() {
  return (
    <>
      <PageHead title="Notifications" subtitle="What the desk has told you lately." />
      <ComingSoon what="Notifications" />
    </>
  );
}
