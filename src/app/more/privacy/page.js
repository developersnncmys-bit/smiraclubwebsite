import ScreenBar from '@/components/ui/ScreenBar';
import LegalDocument from '@/components/ui/LegalDocument';
import { privacyPolicy } from '@/lib/legal/privacy';

export const metadata = {
  title: 'Privacy Policy',
  description:
    'How Smira Club collects, uses, stores and protects your information across membership and bookings.',
};

export default function Page() {
  return (
    <>
      <ScreenBar title="Privacy Policy" backHref="/profile" />
      <LegalDocument doc={privacyPolicy} />
    </>
  );
}
