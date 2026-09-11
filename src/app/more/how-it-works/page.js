import ScreenBar from '@/components/ui/ScreenBar';
import LegalDocument from '@/components/ui/LegalDocument';
import { howItWorks } from '@/lib/legal/guidelines';

export const metadata = {
  title: 'How Smira Club Works',
  description: 'Five steps from choosing a membership to sharing its benefits.',
};

export default function Page() {
  return (
    <>
      <ScreenBar title="How Smira Club Works" backHref="/more" />
      <LegalDocument doc={howItWorks} />
    </>
  );
}
