import ScreenBar from '@/components/ui/ScreenBar';
import LegalDocument from '@/components/ui/LegalDocument';
import { serviceAgreement } from '@/lib/legal/sla';

export const metadata = {
  title: 'Service Legal Agreement',
  description:
    'The terms under which Smira Club provides membership, booking, lifestyle and support services.',
};

export default function Page() {
  return (
    <>
      <ScreenBar title="Service Legal Agreement" backHref="/more" />
      <LegalDocument doc={serviceAgreement} />
    </>
  );
}
