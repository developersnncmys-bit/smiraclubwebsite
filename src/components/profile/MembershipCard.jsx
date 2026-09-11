import Link from 'next/link';
import { ChevronRight, Crown } from 'lucide-react';
import { member } from '@/lib/content';

/** The tier card, with the expiry tab the design hangs off its top corner. */
export default function MembershipCard() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2c3e4c] via-[#63798a] to-[#a9bcc7] px-5 pb-5 pt-12 text-white shadow-card sm:px-6 sm:pb-6 sm:pt-14">
      <span className="absolute right-0 top-0 rounded-bl-xl bg-ink-900 px-4 py-2 text-[13px] font-semibold">
        Valid Till {member.validTill}
      </span>

      <div className="flex items-center gap-3.5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink-900/35">
          <Crown size={22} className="text-white" fill="currentColor" strokeWidth={1.5} />
        </span>

        <div className="min-w-0">
          <h2 className="text-xl font-bold leading-tight sm:text-[19px]">{member.tier}</h2>
          <p className="mt-0.5 text-[14px] text-white/85">Member ID: {member.memberId}</p>
        </div>
      </div>

      <Link
        href="/membership"
        className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-white px-5 py-3.5 text-[14px] font-bold text-ink-900 transition hover:bg-surface-soft"
      >
        Explore membership Benefits
        <ChevronRight size={18} className="shrink-0 text-ink-500" />
      </Link>
    </section>
  );
}
