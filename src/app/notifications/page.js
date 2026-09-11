import ScreenBar from '@/components/ui/ScreenBar';
import NotificationsScreen from '@/components/profile/NotificationsScreen';

export const metadata = {
  title: 'Notifications',
  description: 'Trip reminders, booking updates and offers picked for your plans.',
};

export default function Page() {
  return (
    <>
      <ScreenBar title="Notifications" backHref="/" />
      <NotificationsScreen />
    </>
  );
}
