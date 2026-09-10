import ScreenBar from '@/components/ui/ScreenBar';
import LanguageSettings from '@/components/profile/LanguageSettings';

export const metadata = { title: 'Language Settings' };

/** Language Settings, from the profile screen's Your Information list. */
export default function Page() {
  return (
    <>
      <ScreenBar title="Language Settings" backHref="/profile" />
      <LanguageSettings />
    </>
  );
}
