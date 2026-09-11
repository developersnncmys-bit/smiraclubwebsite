import ScreenBar from '@/components/ui/ScreenBar';
import PlanTripForm from '@/components/profile/PlanTripForm';
import { planTripHero } from '@/lib/content';
import { image } from '@/lib/images';

export const metadata = {
  title: 'Plan My Trip',
  description: 'Tell us where and when you are going, and we will remind you and watch for offers.',
};

/** Reached from Add a Trip on the profile screen. */
export default function Page() {
  return (
    <>
      <ScreenBar title="Plan My Trip" backHref="/profile" />
      <PlanTripForm hero={image(planTripHero.image)} doneImage={image('villa-beach')} />
    </>
  );
}
