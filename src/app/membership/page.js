import ScreenBar from '@/components/ui/ScreenBar';
import MembershipScreen from '@/components/membership/MembershipScreen';
import { membershipGifts } from '@/lib/content';
import { image } from '@/lib/images';

export const metadata = {
  title: 'Smira Club Membership',
  description:
    'Silver, Gold, Platinum and Diamond — choose the plan that fits how you travel and what it includes.',
};

/**
 * Smira Club Membership.
 *
 * Reached from "My Membership" on the profile screen and from every
 * "Explore Membership Plans" link on the site, so it is both the sales page
 * and the checkout for a plan.
 */
export default function Page() {
  // Resolved here because image() reads the filesystem, which the interactive
  // screen below cannot do — otherwise every slot falls back to its SVG.
  const gifts = Object.fromEntries(membershipGifts.map((g) => [g.key, image(g.image)]));

  return (
    <>
      <ScreenBar title="Smira Club Membership" backHref="/profile" />
      <MembershipScreen
        hero={image('villa-hero-luxury')}
        helper={image('plan-helper')}
        compare={image('compare-landmarks')}
        gifts={gifts}
      />
    </>
  );
}
