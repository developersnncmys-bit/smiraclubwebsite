import ScreenBar from '@/components/ui/ScreenBar';
import LegalDocument from '@/components/ui/LegalDocument';
import { refundPolicy } from '@/lib/legal/refunds';

export const metadata = {
  title: 'Refund Policy',
  description:
    'When Smira Club returns money for a membership or a booking, how much, and how long it takes.',
};

export default function Page() {
  return (
    <>
      <ScreenBar title="Refund Policy" backHref="/profile" />
      <LegalDocument doc={refundPolicy} />
    </>
  );
}
