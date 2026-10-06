'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Crown, Info, Lock, LockOpen } from 'lucide-react';
import NeedHelp from '@/components/ui/NeedHelp';
import { member, rewards, rewardsHero, rewardsNote } from '@/lib/content';
import { toSrc } from '@/lib/imageSlot';
import { api } from '@/lib/api';
import { getSessionToken } from '@/lib/session';
import { inr } from '@/lib/format';

/** How each state announces itself, and in what colour. */
const STATES = {
  unlocked: { label: 'Unlocked', tone: 'bg-[#e8f6ec] text-green-700', icon: LockOpen },
  locked: { label: 'Locked', tone: 'bg-[#fdecea] text-red-600', icon: Lock },
  progress: { label: 'In progress', tone: 'bg-[#fdf3dd] text-[#a97810]', icon: null },
  new: { label: 'Not started', tone: 'bg-[#eef1f5] text-ink-600', icon: null },
};

/**
 * Claim Your Gifts.
 *
 * `state` drives the whole card — the chip, what it says under the
 * requirement and which button appears — so a gift is described in one place
 * rather than four branches scattered through the markup.
 *
 * A signed-in member sees the gifts actually on their account, and
 * claiming one tells the desk. The ladder below — what each milestone
 * unlocks — is what the agency offers, so it stands whether or not
 * anybody is signed in; what it no longer does is show somebody a
 * made-up "2 of 3 completed" against their own name.
 */
export default function RewardsScreen({ hero, art = {} }) {
  /** The gifts on this member's account, or null until we know. */
  const [mine, setMine] = useState(null);
  const [busy, setBusy] = useState('');
  const [failed, setFailed] = useState('');

  useEffect(() => {
    const token = getSessionToken();
    if (!token) return undefined;
    let live = true;
    api
      .memberRewards(token)
      .then((res) => live && setMine(res.data || []))
      .catch(() => live && setMine([]));
    return () => {
      live = false;
    };
  }, []);

  const claim = async (id) => {
    const token = getSessionToken();
    if (!token || busy) return;
    setBusy(id);
    setFailed('');
    try {
      await api.claimReward(token, id);
      setMine((list) => (list || []).map((g) => (g.id === id ? { ...g, claimed: true } : g)));
    } catch (err) {
      setFailed(err?.message || 'We could not claim that just now. Please try again.');
    } finally {
      setBusy('');
    }
  };

  return (
    <div className="pb-10">
      {/* -- The nudge --------------------------------------------- */}
      <section className="relative overflow-hidden bg-[#5c7b93]">
        <div className="absolute inset-y-0 right-0 w-[55%]">
          <Image
            src={toSrc(hero || rewardsHero.image)}
            alt=""
            fill
            sizes="55vw"
            className="object-cover"
          />
        </div>
        <div className="relative shell py-8 lg:py-12">
          <div className="max-w-[13rem] sm:max-w-xs lg:max-w-md">
            <h1 className="text-[18px] font-extrabold uppercase leading-snug text-white lg:text-3xl">
              {rewardsHero.title}
            </h1>
            <p className="mt-3 text-[13px] leading-snug text-white/90 lg:text-base">
              {rewardsHero.body}
            </p>
          </div>
        </div>
      </section>

      {/* -- Who is claiming --------------------------------------- */}
      <section className="bg-[#231a4d]">
        <div className="shell flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/15">
              <Crown size={21} className="text-gold" fill="currentColor" strokeWidth={1.5} />
            </span>
            <div className="min-w-0">
              <p className="text-[15px] font-bold uppercase tracking-wide text-white">
                {member.tier}
              </p>
              <p className="text-[13px] text-white/75">Member ID: {member.memberId}</p>
            </div>
          </div>

          <span className="shrink-0 rounded-full bg-white/15 px-4 py-2 text-[13px] font-medium text-white">
            Valid Till {member.validTill}
          </span>
        </div>
      </section>

      {/* -- What is actually on this account ---------------------- */}
      {mine !== null && (
        <div className="shell pt-6">
          <h2 className="text-lg font-bold text-ink-900">Your gifts</h2>
          {mine.length === 0 ? (
            <p className="mt-2 flex gap-2.5 rounded-xl bg-surface-soft px-4 py-3.5 text-[14px] leading-snug text-ink-600">
              <Info size={18} className="mt-0.5 shrink-0 text-ink-400" />
              Nothing on your account yet. The gifts below unlock as you book.
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {mine.map((g) => (
                <li key={g.id} className="card flex flex-wrap items-center gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-bold text-ink-900">{g.gift}</p>
                    <p className="text-[13px] text-ink-600">
                      {g.kind}
                      {g.value > 0 && <> · worth {inr(g.value)}</>}
                      {g.eligibility && <> · {g.eligibility}</>}
                    </p>
                  </div>

                  {g.stage === 'Delivered' ? (
                    <span className="shrink-0 rounded-full bg-[#e8f6ec] px-3.5 py-1.5 text-[13px] font-bold text-green-700">
                      Delivered
                    </span>
                  ) : g.stage === 'Cancelled' ? (
                    <span className="shrink-0 rounded-full bg-[#fdecea] px-3.5 py-1.5 text-[13px] font-bold text-red-600">
                      No longer available
                    </span>
                  ) : g.claimed ? (
                    <span className="shrink-0 rounded-full bg-[#e8f6ec] px-3.5 py-1.5 text-[13px] font-bold text-green-700">
                      {g.stage === 'Out for delivery' ? 'On its way' : 'Claimed'}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => claim(g.id)}
                      disabled={busy === g.id}
                      className="btn-primary shrink-0 rounded-xl px-5 py-2.5 text-[14px] disabled:opacity-60"
                    >
                      {busy === g.id ? 'Claiming…' : 'Claim'}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          {failed && <p className="mt-3 text-[13px] font-semibold text-rose-600">{failed}</p>}
        </div>
      )}

      {/* -- What the agency offers, and how each is unlocked ------ */}
      <div className="shell space-y-5 py-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:space-y-0">
        {rewards.map((gift) => {
          const state = STATES[gift.state];
          const Glyph = state.icon;
          const pct = gift.progress
            ? Math.round((gift.progress.done / gift.progress.of) * 100)
            : 0;

          return (
            <article key={gift.key} className="card relative mt-3 p-4 pt-7 sm:p-5 sm:pt-8">
              <span
                className={`absolute -top-3 left-4 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-bold uppercase tracking-wide sm:left-5 ${state.tone}`}
              >
                {Glyph && <Glyph size={14} strokeWidth={2.5} />}
                {state.label}
              </span>

              <div className="flex gap-4">
                <span className="relative h-[104px] w-[104px] shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={toSrc(art[gift.key] || gift.image)}
                    alt=""
                    fill
                    sizes="104px"
                    className="object-cover"
                  />
                </span>

                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold leading-tight text-ink-900">{gift.label}</h2>
                  <p className="mt-1 text-[14px] text-ink-600">{gift.requirement}</p>

                  {gift.state === 'unlocked' && (
                    <p className="mt-3 flex items-center gap-2 text-[14px] text-ink-900">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-green-600 text-white">
                        <Check size={13} strokeWidth={3} />
                      </span>
                      Requirement Completed
                    </p>
                  )}

                  {gift.state === 'progress' && (
                    <div className="mt-3">
                      <p className="text-[15px] font-bold text-ink-900">
                        {gift.progress.done}/{gift.progress.of} {gift.progress.noun} Completed
                      </p>
                      <p className="mt-2 flex items-center gap-3">
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-line">
                          <span
                            className="block h-full rounded-full bg-action-500"
                            style={{ width: `${pct}%` }}
                          />
                        </span>
                        <span className="shrink-0 text-[14px] font-bold text-action-500">
                          {pct}%
                        </span>
                      </p>
                      <p className="mt-2 text-[14px] text-ink-700">
                        {gift.progress.of - gift.progress.done} more left to claim
                      </p>
                    </div>
                  )}

                  {(gift.state === 'locked' || gift.state === 'new') && (
                    <p className="mt-3 flex gap-2 text-[14px] leading-snug text-ink-600">
                      <Info size={17} className="mt-0.5 shrink-0 text-ink-400" />
                      Complete the Requirement to unlock this gift.
                    </p>
                  )}
                </div>
              </div>

              {/* The way on, whatever that is for this gift. */}
              {/*
                A link where there is somewhere to go. There was a Claim
                button here too, which added the gift to a list in the
                browser and told the member the desk would be in touch —
                and the desk was never told anything. Claiming happens
                above, against a gift that exists on the account.
              */}
              {gift.cta.href && (
                <Link
                  href={gift.cta.href}
                  className="btn-primary mt-5 w-full rounded-xl py-3.5 text-[14px] uppercase tracking-wide"
                >
                  {gift.cta.label}
                </Link>
              )}
            </article>
          );
        })}

        <p className="flex gap-2.5 pt-2 text-[14px] leading-snug text-ink-500">
          <Info size={18} className="mt-0.5 shrink-0 text-ink-400" />
          {rewardsNote}
        </p>

        <NeedHelp className="mt-6" />
      </div>
    </div>
  );
}
