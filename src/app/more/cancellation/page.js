import ScreenBar from '@/components/ui/ScreenBar';
import LegalDocument from '@/components/ui/LegalDocument';
import { cancellationPolicy } from '@/lib/legal/cancellation';

export const metadata = {
  title: 'Cancellation Policy',
  description:
    'How a Smira Club booking can be cancelled or changed, by when, and what happens in each case.',
};

export default function Page() {
  return (
    <>
      <ScreenBar title="Cancellation Policy" backHref="/profile" />
      <LegalDocument doc={cancellationPolicy} />
    </>
  );
}
