'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, ChevronRight, Crown } from 'lucide-react';
import { isMember, useMembership } from '@/lib/membership';
import { api } from '@/lib/api';
import { useSavings } from '@/lib/savings';
import { inr } from '@/lib/format';
import { privilegeInfo } from '@/lib/privileges';
import Icon from '@/components/ui/Icon';

const validTill = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

/** "No utility fee — Stay without paying extra" → a bold title and a line under it. */
const splitBenefit = (text) => {
  const [title, ...rest] = String(text).split(/\s+[—–-]\s+/);
  return { title: title.trim(), body: rest.join(' — ').trim() };
};

const yearsOf = (months) =>
  months % 12 === 0 ? `${months / 12} year${months === 12 ? '' : 's'}` : `${months} months`;

/**
 * The benefits of the plan this member bought, and its headline figures.
 *
 * The desk's answer for the member carries them. Until every server sends
 * that, the plan is looked up among the published ones by name, so the
 * card still shows them — and shows nothing rather than guess.
 */
function usePlanBenefits(membership, member) {
  const [found, setFound] = useState(null);
  const own = member && Array.isArray(membership?.benefits) ? membership : null;

  useEffect(() => {
    if (!member || own) return undefined;
    let alive = true;
    const name = String(membership?.planName || membership?.plan || '').trim().toLowerCase();
    api
      .websitePlans()
      .then((res) => {
        const plans = Array.isArray(res?.data) ? res.data : [];
        const plan =
          plans.find((p) => String(p.name || '').trim().toLowerCase() === name) ||
          plans.find((p) => name && String(p.name || '').toLowerCase().startsWith(name.split(' ')[0]));
        if (!alive || !plan) return;
        setFound({
          benefits: (plan.features || []).filter(Boolean),
          planFacts: {
            freeStayNights: Number(plan.freeStay?.nights) || 0,
            months: Number(plan.durationMonths) || 0,
            persons: Number(plan.persons) || 0,
            rooms: Number(plan.rooms) || 0,
          },
        });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [member, own, membership?.planName, membership?.plan]);

  const source = own || found;
  const f = source?.planFacts || {};
  const facts = [
    f.freeStayNights ? { label: 'Free hotel stay', value: `${f.freeStayNights} nights` } : null,
    f.months ? { label: 'Validity', value: yearsOf(f.months) } : null,
    f.persons ? { label: 'Covered per stay', value: `${f.persons} persons` } : null,
    f.rooms ? { label: 'Per booking', value: `${f.rooms} room${f.rooms === 1 ? '' : 's'}` } : null,
  ].filter(Boolean);
  return { benefits: (source?.benefits || []).map(splitBenefit), facts };
}

/** How many benefits show before "Show all". */
const FIRST = 3;

/**
 * The tier card, with the expiry tab the design hangs off its top corner.
 * It shows the membership this member actually took; someone who has not
 * joined yet gets the way in instead.
 */
export default function MembershipCard() {
  const { membership } = useMembership();
  const member = isMember(membership);
  const { total, across } = useSavings();

  /*
   * The services this membership actually bought.
   *
   * A plan sells a number and the member picks which, and until now the
   * choice went to the desk and was never shown back to them. Somebody
   * on Silver could not find out what their one privilege was.
   */
  const held = (member && membership.privileges) || [];
  const allowed = membership?.privilegesAllowed ?? held.length;

  // Only once the membership is theirs: someone still paying sees none.
  const { benefits, facts } = usePlanBenefits(membership, member);
  const [allShown, setAllShown] = useState(false);
  const shownBenefits = allShown ? benefits : benefits.slice(0, FIRST);

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2c3e4c] via-[#63798a] to-[#a9bcc7] px-3.5 pb-3.5 pt-8 text-white shadow-card sm:px-5 sm:pb-4 sm:pt-10 lg:px-4 lg:pb-4 lg:pt-10">
      <span className="absolute right-0 top-0 rounded-bl-xl bg-ink-900 px-3 py-1.5 text-[12px] font-semibold">
        {member ? (membership.expiresOn ? `Valid Till ${validTill(membership.expiresOn)}` : 'Payment pending') : 'Not a member yet'}
      </span>

      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink-900/35 lg:h-9 lg:w-9">
          <Crown size={18} className="text-white" fill="currentColor" strokeWidth={1.5} />
        </span>

        <div className="min-w-0">
          <h2 className="truncate text-[14px] font-bold leading-tight sm:text-[16px] lg:text-[15px]">
            {member ? `${membership.plan} Member` : 'Become a Smira Club Member'}
          </h2>
          <p className="mt-0.5 text-[11.5px] leading-snug text-white/85">
            {member
              ? `Member ID: ${membership.reference}${membership.status ? ` · ${membership.status}` : ''}`
              : 'Members see full details and book stays'}
          </p>
        </div>
      </div>

      {/* -- What their plan gives them ----------------------------------- */}
      {member && (facts.length > 0 || benefits.length > 0) && (
        <div className="mt-4 rounded-xl bg-ink-900/20 p-3.5">
          <p className="text-[12px] font-bold uppercase tracking-wide text-white/70">
            Your {membership.planName || membership.plan} benefits
          </p>

          {facts.length > 0 && (
            <dl className="mt-2.5 grid grid-cols-2 gap-1.5">
              {facts.map((x) => (
                <div key={x.label} className="rounded-lg bg-white/15 px-2.5 py-2">
                  <dt className="text-[10.5px] font-semibold uppercase tracking-wide text-white/70">{x.label}</dt>
                  <dd className="num mt-0.5 text-[14px] font-extrabold">{x.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {benefits.length > 0 && (
            <ul className="mt-3 space-y-2.5">
              {shownBenefits.map((b) => (
                <li key={b.title} className="flex gap-2.5">
                  <span className="mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full bg-white text-ink-900">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-bold leading-snug">{b.title}</span>
                    {b.body && <span className="mt-0.5 block text-[12px] leading-snug text-white/75">{b.body}</span>}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {benefits.length > FIRST && (
            <button
              type="button"
              onClick={() => setAllShown((v) => !v)}
              className="mt-2.5 text-[12px] font-bold text-white underline underline-offset-2"
            >
              {allShown ? 'Show fewer' : `Show all ${benefits.length} benefits`}
            </button>
          )}
        </div>
      )}

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

      {/*
        What the membership has saved them, inside the card making the
        case for it. On its own it was a pale blue box reading zero,
        which is an odd thing to show somebody who has not joined.
      */}
      <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-ink-900/20 px-3.5 py-2.5">
        <span className="min-w-0">
          <span className="block text-[12px] font-bold">Your Smira Club savings</span>
          <span className="mt-0.5 block text-[11px] leading-snug text-white/75">
            {across > 0
              ? `Across ${across} ${across === 1 ? 'booking' : 'bookings'}`
              : 'Book as a member to start saving'}
          </span>
        </span>
        <span className="num shrink-0 text-[17px] font-extrabold">{inr(total)}</span>
      </div>

      <Link
        href="/membership"
        className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-white px-3.5 py-2 text-[12.5px] font-bold text-ink-900 transition hover:bg-surface-soft lg:mt-3.5 lg:py-2.5"
      >
        {member ? 'Explore membership Benefits' : 'Explore Membership Plans'}
        <ChevronRight size={18} className="shrink-0 text-ink-500" />
      </Link>
    </section>
  );
}
