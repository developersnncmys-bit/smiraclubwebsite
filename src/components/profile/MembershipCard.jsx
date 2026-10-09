'use client';

import Link from 'next/link';
import { ChevronRight, Crown } from 'lucide-react';
import { isMember, useMembership } from '@/lib/membership';
import { privilegeInfo } from '@/lib/privileges';
import Icon from '@/components/ui/Icon';

const validTill = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

/**
 * The tier card, with the expiry tab the design hangs off its top corner.
 * It shows the membership this member actually took; someone who has not
 * joined yet gets the way in instead.
 */
export default function MembershipCard() {
  const { membership } = useMembership();
  const member = isMember(membership);

  /*
   * The services this membership actually bought.
   *
   * A plan sells a number and the member picks which, and until now the
   * choice went to the desk and was never shown back to them. Somebody
   * on Silver could not find out what their one privilege was.
   */
  const held = (member && membership.privileges) || [];
  const allowed = membership?.privilegesAllowed ?? held.length;

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2c3e4c] via-[#63798a] to-[#a9bcc7] px-5 pb-5 pt-12 text-white shadow-card sm:px-6 sm:pb-6 sm:pt-14">
      <span className="absolute right-0 top-0 rounded-bl-xl bg-ink-900 px-4 py-2 text-[13px] font-semibold">
        {member ? (membership.expiresOn ? `Valid Till ${validTill(membership.expiresOn)}` : 'Payment pending') : 'Not a member yet'}
      </span>

      <div className="flex items-center gap-3.5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink-900/35">
          <Crown size={22} className="text-white" fill="currentColor" strokeWidth={1.5} />
        </span>

        <div className="min-w-0">
          <h2 className="text-xl font-bold leading-tight sm:text-[19px]">
            {member ? `${membership.plan} Member` : 'Become a Smira Club Member'}
          </h2>
          <p className="mt-0.5 text-[14px] text-white/85">
            {member
              ? `Member ID: ${membership.reference}${membership.status ? ` · ${membership.status}` : ''}`
              : 'Members see full details and book stays'}
          </p>
        </div>
      </div>

      {held.length > 0 && (
        <div className="mt-4 rounded-xl bg-ink-900/20 p-3.5">
          <p className="text-[12px] font-bold uppercase tracking-wide text-white/70">
            Your privileges · {held.length} of {allowed}
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {held.map((key) => {
              const info = privilegeInfo(key);
              return (
                <li
                  key={key}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1.5 text-[13px] font-semibold"
                >
                  <Icon name={info?.icon || 'Check'} size={14} strokeWidth={2} />
                  {info?.label || key}
                </li>
              );
            })}
          </ul>
          {allowed > held.length && (
            <p className="mt-2 text-[12px] text-white/70">
              {allowed - held.length} still to choose.
            </p>
          )}
        </div>
      )}

      <Link
        href="/membership"
        className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-white px-5 py-3.5 text-[14px] font-bold text-ink-900 transition hover:bg-surface-soft"
      >
        {member ? 'Explore membership Benefits' : 'Explore Membership Plans'}
        <ChevronRight size={18} className="shrink-0 text-ink-500" />
      </Link>
    </section>
  );
}
