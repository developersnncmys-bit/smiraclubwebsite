import ScreenBar from '@/components/ui/ScreenBar';
import GetHelp from '@/components/profile/GetHelp';
import RaiseComplaint from '@/components/profile/RaiseComplaint';
import { helpDesk } from '@/lib/content';
import { image } from '@/lib/images';

export const metadata = {
  title: 'Get Help',
  description: 'Look up a booking, or reach the Smira Club desk.',
};

/** Get Help — reached from the profile list and from Travel Support. */
export default function Page() {
  return (
    <>
      <ScreenBar title="Get Help" backHref="/profile" />
      <GetHelp art={image(helpDesk.image)} />
      {/* Looking a booking up is one thing; telling us it went wrong is
          another, and that one has to reach the desk. */}
      <div className="shell pb-10">
        <RaiseComplaint />
      </div>
    </>
  );
}
