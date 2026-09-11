import ScreenBar from '@/components/ui/ScreenBar';
import LegalDocument from '@/components/ui/LegalDocument';
import { membershipGuidelines } from '@/lib/legal/guidelines';

export const metadata = {
  title: 'Membership Guidelines',
  description:
    'How Smira Club membership works in practice — validity, bookings, food charges, benefits and what to confirm before you book.',
};

export default function Page() {
  return (
    <>
      <ScreenBar title="Membership Guidelines" backHref="/more" />
      <LegalDocument doc={membershipGuidelines} />
    </>
  );
}
