import IdentityRow from '@/components/profile/IdentityRow';
import MembershipCard from '@/components/profile/MembershipCard';
import PlanMyTrip from '@/components/profile/PlanMyTrip';
import PartnerCard from '@/components/profile/PartnerCard';
import Tiles from '@/components/profile/Tiles';
import InfoList from '@/components/profile/InfoList';
import LogoutButton from '@/components/profile/LogoutButton';
import { profileSettings, profileTiles } from '@/lib/content';

export const metadata = { title: 'Profile' };

/**
 * Profile, in the order the design runs it.
 *
 * Who you are, what you hold, then everything you can open — four
 * across, in three groups. It used to be five stacked cards and
 * eighteen full-width rows, which was a scroll and a half of chevrons
 * to reach Saved Payments.
 *
 * Settings and the paperwork stay a list at the foot. Nobody hunts for
 * the refund policy at a glance, and three of those have no other home.
 *
 * From `lg` up the same pieces split into a sticky account rail and a
 * wider column for the tiles. Nothing is added or dropped between the
 * two, only moved.
 */
export default function Page() {
  const [holdings, earned, managed] = profileTiles;

  return (
    <div className="shell py-2 lg:py-8">
      <div className="mx-auto max-w-phone lg:grid lg:max-w-none lg:grid-cols-12 lg:items-start lg:gap-8">
        {/* -- Who you are, and what you hold ---------------------------- */}
        <div className="space-y-2.5 lg:sticky lg:top-24 lg:col-span-5 lg:space-y-4 xl:col-span-4">
          <IdentityRow />
          <MembershipCard />
        </div>

        {/* -- Everything you can open ----------------------------------- */}
        <div className="mt-2.5 space-y-2.5 lg:col-span-7 lg:mt-0 lg:space-y-4 xl:col-span-8">
          <Tiles items={holdings} />

          {/* The two things the screen asks of you, side by side. */}
          <div className="grid grid-cols-2 gap-2 lg:gap-3">
            <PlanMyTrip />
            <PartnerCard />
          </div>

          <Tiles items={earned} />
          <Tiles items={managed} />

          <section className="pt-1">
            <h2 className="px-1 pb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-ink-400">
              Settings
            </h2>
            <InfoList items={profileSettings} />
          </section>

          <div className="pt-1 lg:max-w-xs">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
