import ScreenBar from '@/components/ui/ScreenBar';
import MembershipScreen from '@/components/membership/MembershipScreen';
import { deskOffers, deskPlans } from '@/lib/desk';
import { image } from '@/lib/images';
import { privilegeArt } from '@/lib/privilegeArt';
import { membershipPrivileges } from '@/lib/content';

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
  /**
   * The plans, read here rather than in the browser.
   *
   * They used to be fetched after the page had already painted, so every
   * visitor saw the built-in copy first and the desk's wording a moment
   * later — and anything that reads the page without running scripts only
   * ever saw the built-in copy. Now what the desk wrote is what renders.
   */
  const desk = await deskPlans();

  /**
   * The coupon codes the desk has live, so the box below is not a guess.
   *
   * Only the ones with a code to type and only the ones a membership may
   * use. Read here with the plans rather than in the browser, so the
   * offers are on the page when it paints.
   */
  const all = await deskOffers();
  const offers = all.filter(
    (o) => o.coupon && (!o.appliesTo?.length || o.appliesTo.includes('Membership')),
  );

  return (
    <>
      <ScreenBar title="Smira Club Membership" backHref="/profile" />
      <MembershipScreen
        hero={image('villa-hero-luxury')}
        helper={image('plan-helper')}
        compare={image('compare-landmarks')}
        desk={desk}
        offers={offers}
        /*
         * The privileges’ own illustrations, resolved here because
         * reading the filesystem is a server job and this screen runs
         * in the browser.
         */
        privilegeArt={privilegeArt(membershipPrivileges.map((x) => x.key))}
      />
    </>
  );
}
