import Link from 'next/link';
import { ChevronRight, Info } from 'lucide-react';
import { member } from '@/lib/content';
import { inr } from '@/lib/format';

/** What the membership has actually saved, which is the whole argument. */
export default function SavingsCard() {
  return (
    <section className="flex h-full flex-col rounded-2xl bg-gradient-to-br from-[#eaf1fe] via-[#dde9fc] to-[#c6dbfa] p-5 shadow-card sm:p-6">
      <h2 className="flex items-center gap-2 text-[15px] font-bold text-ink-900">
        Your Smira Club Savings
        <span
          title="The difference between what members pay and the public rate, added up across your bookings."
          className="grid h-[18px] w-[18px] place-items-center rounded-full text-ink-900"
        >
          <Info size={16} />
        </span>
      </h2>

      <p className="mt-2 text-2xl font-extrabold text-action-500">{inr(member.savings)}</p>

      <p className="mt-1 text-[14px] leading-relaxed text-ink-700">
        Saved on your bookings across {member.savedAcross} bookings
      </p>

      <Link
        href="/profile/savings"
        className="mt-auto inline-flex items-center gap-1 pt-4 text-[14px] font-bold text-action-500 transition hover:text-action-600"
      >
        View Savings Details
        <ChevronRight size={17} />
      </Link>
    </section>
  );
}
