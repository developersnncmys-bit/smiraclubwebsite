import IdentityCard from '@/components/profile/IdentityCard';
import MembershipCard from '@/components/profile/MembershipCard';
import ProfileCompletion from '@/components/profile/ProfileCompletion';
import PlanMyTrip from '@/components/profile/PlanMyTrip';
import SavingsCard from '@/components/profile/SavingsCard';
import PartnerCard from '@/components/profile/PartnerCard';
import InfoList from '@/components/profile/InfoList';
import LogoutButton from '@/components/profile/LogoutButton';
import { profileMenu } from '@/lib/content';

export const metadata = { title: 'Profile' };

/**
 * Profile, in both shapes.
 *
 * The design is a phone screen, so the phone is the literal one: a single
 * column in the design's order. From `lg` up the same cards split into a
 * sticky account rail — who you are, what you hold, how far through you are —
 * and a wider column for everything you can do with it, where the two "Your
 * Information" groups sit side by side instead of stacking into a very long
 * scroll. Nothing is added or dropped between the two, only moved.
 */
export default function Page() {
  const [account, support] = profileMenu;

  return (
    <div className="shell py-4 lg:py-8">
      <div className="mx-auto max-w-phone lg:grid lg:max-w-none lg:grid-cols-12 lg:items-start lg:gap-8">
        {/* -- The account rail: who you are, and what you hold ----------- */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:col-span-5 lg:space-y-5 xl:col-span-4">
          <IdentityCard />
          <MembershipCard />
          <ProfileCompletion />
        </div>

        {/* -- Everything you can do with it ------------------------------ */}
        <div className="mt-4 space-y-4 lg:col-span-7 lg:mt-0 lg:space-y-5 xl:col-span-8">
          <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-5 lg:space-y-0">
            <PlanMyTrip />
            <SavingsCard />
          </div>

          <PartnerCard />

          <section className="pt-2">
            <h2 className="px-1 pb-3 text-[13px] font-bold uppercase tracking-[0.12em] text-ink-400">
              Your Information
            </h2>

            <div className="space-y-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-5 lg:space-y-0">
              <InfoList items={account.items} />
              <InfoList items={support.items} />
            </div>
          </section>

          <div className="pt-2 lg:max-w-xs">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
