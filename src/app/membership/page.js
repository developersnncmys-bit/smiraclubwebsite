import ScreenBar from '@/components/ui/ScreenBar';
import MembershipScreen from '@/components/membership/MembershipScreen';
import { membershipGifts } from '@/lib/content';
import { deskPlans } from '@/lib/desk';
import { image } from '@/lib/images';

/** The desk's plans are re-read a minute at a time, like the rest of the site. */
export const revalidate = 60;

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
export default async function Page() {
  // Resolved here because image() reads the filesystem, which the interactive
  // screen below cannot do — otherwise every slot falls back to its SVG.
  const gifts = Object.fromEntries(membershipGifts.map((g) => [g.key, image(g.image)]));

  /**
   * The plans, read here rather than in the browser.
   *
   * They used to be fetched after the page had already painted, so every
   * visitor saw the built-in copy first and the desk's wording a moment
   * later — and anything that reads the page without running scripts only
   * ever saw the built-in copy. Now what the desk wrote is what renders.
   */
  const desk = await deskPlans();

  return (
    <>
      <ScreenBar title="Smira Club Membership" backHref="/profile" />
      <MembershipScreen
        hero={image('villa-hero-luxury')}
        helper={image('plan-helper')}
        compare={image('compare-landmarks')}
        gifts={gifts}
        desk={desk}
      />
    </>
  );
}
