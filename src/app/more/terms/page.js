import ScreenBar from '@/components/ui/ScreenBar';
import LegalDocument from '@/components/ui/LegalDocument';
import { terms } from '@/lib/legal/terms';

export const metadata = {
  title: 'Terms & Conditions',
  description:
    'The terms governing Smira Club membership, bookings, benefits, gifts and referrals.',
};

export default function Page() {
  return (
    <>
      <ScreenBar title="Terms & Conditions" backHref="/profile" />
      <LegalDocument doc={terms} />
    </>
  );
}
