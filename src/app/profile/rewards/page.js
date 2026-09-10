import ScreenBar from '@/components/ui/ScreenBar';
import RewardsScreen from '@/components/profile/RewardsScreen';
import { rewards, rewardsHero } from '@/lib/content';
import { image } from '@/lib/images';

export const metadata = {
  title: 'Claim Your Gifts',
  description: 'The gifts your membership has earned, and what is left to unlock the rest.',
};

/** Claim Your Gifts, from the profile screen's Your Information list. */
export default function Page() {
  // Resolved here because image() reads the filesystem, which the
  // interactive screen below cannot do.
  const art = Object.fromEntries(rewards.map((g) => [g.key, image(g.image)]));

  return (
    <>
      <ScreenBar title="Claim Your Gifts" backHref="/profile" />
      <RewardsScreen hero={image(rewardsHero.image)} art={art} />
    </>
  );
}
