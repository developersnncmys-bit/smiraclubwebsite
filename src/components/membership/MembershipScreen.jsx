'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Check, Crown, Gift, Info, ShieldCheck } from 'lucide-react';
import {
  membershipCoupon, membershipGiftConditions, membershipGifts, membershipIncluded,
  membershipCompareHero, membershipOffer, membershipPlans, membershipPrivileges,
  membershipSharing, membershipTabs,
} from '@/lib/content';
import Countdown from '@/components/ui/Countdown';
import MembershipQuiz from '@/components/membership/MembershipQuiz';
import MembershipCompare from '@/components/membership/MembershipCompare';
import { toSrc } from '@/lib/imageSlot';
import { inr } from '@/lib/format';
import { api } from '@/lib/api';
import { readAttribution } from '@/components/layout/Attribution';
import { completeProfileHref, isComplete, loadProfile, profileForBooking, useProfile } from '@/lib/profile';
import { saveMembership } from '@/lib/membership';

/** A ticked square in the chosen plan's own colour, as the Figma's grid draws them. */
function Tick({ on, colour = '#b8860b' }) {
  return (
    <span
      className="grid h-5 w-5 shrink-0 place-items-center rounded border-2 text-white transition"
      style={{ borderColor: colour, background: on ? colour : '#fff' }}
    >
      {on && <Check size={13} strokeWidth={3.5} />}
    </span>
  );
}

const years = (months) => {
  const y = Math.round((Number(months) || 0) / 12);
  return y >= 1 ? `${y} Year${y === 1 ? '' : 's'}` : `${months} Months`;
};

/**
 * One website plan with the admin panel's numbers laid over it. The Crown's
 * persons read "16+" on the Figma, so the top tier keeps its plus.
 */
function fromDesk(p, d) {
  const persons = Number(d.persons) || 0;
  const rooms = Number(d.rooms) || 0;
  const nights = Number(d.freeStay?.nights) || 0;
  const figures = {
    'Free Hotel Stay': nights ? `${nights} Days` : null,
    'Membership Validity': d.durationMonths ? years(d.durationMonths) : null,
    'Covered per stay': persons ? `${persons}${p.key === 'crown' ? '+' : ''} Persons` : null,
    'Allowed Per Booking': rooms ? `${rooms} Room${rooms === 1 ? '' : 's'}` : null,
  };
  return {
    ...p,
    fee: Number(d.price) || p.fee,
    popular: Boolean(d.popular),
    privileges: Number(d.privileges) || p.privileges,
    stats: p.stats.map((s) => ({ ...s, figure: figures[s.note] || s.figure })),
  };
}

/**
 * Smira Club Membership.
 *
 * Everything a member picks feeds one total, so it all lives in one
 * component: the tier, the privileges it lets you choose, whether you are
 * sharing the benefits, and the coupon. The bar at the bottom reads that
 * same total rather than keeping its own copy.
 */
export default function MembershipScreen({ hero, helper, compare, gifts: giftArt = {} }) {
  const router = useRouter();
  const [tab, setTab] = useState('plans');
  const [planKey, setPlanKey] = useState('gold');
  const [privileges, setPrivileges] = useState([]);
  const [gifts, setGifts] = useState(['jewellery']);
  const [sharing, setSharing] = useState(true);
  const [agreed, setAgreed] = useState(true);
  const [coupon, setCoupon] = useState('');
  const [applied, setApplied] = useState(membershipCoupon.code);
  const [note, setNote] = useState('');
  /** Sent here from a details page they could not open yet. */
  const [returning, setReturning] = useState(false);

  /**
   * The plans as the Smira desk has them set up on the admin panel — price,
   * free-stay days, validity, persons, rooms and preferred services — laid
   * over the website's own copy by tier name. The colours and wording stay the
   * website's; if the desk cannot be reached, the website's numbers stand.
   */
  const [plans, setPlans] = useState(membershipPlans);
  useEffect(() => {
    let live = true;
    api.websitePlans()
      .then((res) => {
        if (!live || !Array.isArray(res.data)) return;
        setPlans(membershipPlans.map((p) => {
          const desk = res.data.find((d) => d.name?.toLowerCase().startsWith(p.key));
          return desk ? fromDesk(p, desk) : p;
        }));
      })
      .catch(() => {});
    return () => { live = false; };
  }, []);

  const plan = plans.find((p) => p.key === planKey);
  const versus = tab === 'versus';

  /**
   * The tab is addressable — /membership?view=match opens the questionnaire.
   * Read once on mount rather than through the router, so the page can still
   * render statically and someone can send a link straight to the quiz.
   */
  useEffect(() => {
    const view = new URLSearchParams(window.location.search).get('view');
    if (membershipTabs.some((t) => t.key === view)) setTab(view);
    setReturning(Boolean(new URLSearchParams(window.location.search).get('next')));
  }, []);

  const goTo = (key) => {
    setTab(key);
    const q = new URLSearchParams(window.location.search);
    if (key === 'plans') q.delete('view');
    else q.set('view', key);
    const url = q.toString() ? `/membership?${q}` : '/membership';
    window.history.replaceState(null, '', url);
  };

  /** Changing tier changes how many privileges you may hold. */
  useEffect(() => {
    setPrivileges((list) => list.slice(0, plan.privileges));
  }, [plan.privileges]);

  const togglePrivilege = (key) =>
    setPrivileges((list) => {
      if (list.includes(key)) return list.filter((k) => k !== key);
      if (list.length >= plan.privileges) {
        setNote(`${plan.label} members choose up to ${plan.privileges}.`);
        return list;
      }
      setNote('');
      return [...list, key];
    });

  const discount = applied ? membershipCoupon.off : 0;
  const sharingPrice = sharing ? membershipSharing.price : 0;
  const total = useMemo(
    () => plan.fee - discount + sharingPrice,
    [plan.fee, discount, sharingPrice],
  );

  /**
   * Pay now: the profile has to be there (the desk needs to know who to call),
   * then the membership goes to the Smira desk and is recorded here, and the
   * member goes back to whatever sent them to join.
   */
  const { profile } = useProfile();
  const [joining, setJoining] = useState(false);
  const [failed, setFailed] = useState('');
  const join = async () => {
    if (joining || !agreed) return;
    // Read it now rather than trust the first render, which may not have it yet.
    const current = profile || loadProfile();
    if (!isComplete(current)) return router.push(completeProfileHref());
    setJoining(true);
    setFailed('');
    try {
      const d = current.details;
      const res = await api.joinMembership({
        name: d.name,
        phone: d.phone,
        email: d.email,
        plan: plan.label,
        total,
        gifts,
        privileges,
        sharing,
        coupon: applied || undefined,
        profile: profileForBooking(current),
        attribution: readAttribution(),
      });
      saveMembership({
        plan: plan.label,
        reference: res.data?.reference,
        since: new Date().toISOString(),
        expiresOn: res.data?.expiresOn,
        status: 'Payment pending',
      });
      const next = new URLSearchParams(window.location.search).get('next') || '';
      router.push(next.startsWith('/') && !next.startsWith('//') ? next : '/profile');
    } catch (err) {
      setJoining(false);
      setFailed(err?.status ? err.message : 'We could not reach our desk just now. Please try again in a moment.');
    }
  };

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (code === membershipCoupon.code) {
      setApplied(code);
      setNote('');
    } else {
      setNote(code ? `We could not find "${code}".` : 'Enter a code first.');
    }
  };

  return (
    <div className="pb-40 lg:pb-12">
      {/*
        The pitch. The comparison makes a different argument from the plans,
        so it gets its own banner rather than being sold the same way twice.
      */}
      <section className="relative overflow-hidden bg-[#123a63]">
        <div className="absolute inset-y-0 right-0 w-1/2">
          <Image
            src={toSrc(versus ? compare || 'compare-landmarks' : hero || 'villa-hero-luxury')}
            alt=""
            fill
            sizes="50vw"
            className="object-cover"
          />
        </div>
        <div className="relative shell py-8 lg:py-14">
          <div className="max-w-[15rem] sm:max-w-sm lg:max-w-md">
            <h1 className="text-[19px] font-bold leading-snug text-white lg:text-4xl">
              {versus ? membershipCompareHero.title : 'Explore Smira Club Membership plans'}
            </h1>
            <p className="mt-3 text-[13px] leading-snug text-white/85 lg:text-lg">
              {versus
                ? membershipCompareHero.body
                : 'Choose the plan that fits your travel style and enjoy exclusive benefits.'}
            </p>
          </div>
        </div>
      </section>

      {returning && (
        <div className="shell pt-4">
          <p role="status" className="rounded-xl border border-action-500/30 bg-brand-50 px-4 py-3 text-[14px] font-medium text-brand-700">
            Details and bookings are for Smira Club members. Choose a plan below and we will take you straight back.
          </p>
        </div>
      )}

      {/* -- Three ways to decide ---------------------------------- */}
      <div className="border-b border-surface-line bg-white">
        <div className="shell">
          <div className="rail gap-6">
            {membershipTabs.map((t) => {
              const on = t.key === tab;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => goTo(t.key)}
                  aria-pressed={on}
                  className={`w-[7.5rem] shrink-0 border-b-2 py-4 text-left text-[14px] font-semibold leading-snug transition lg:w-auto ${
                    on ? 'border-ink-900 text-ink-900' : 'border-transparent text-ink-500 hover:text-ink-700'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {tab === 'match' ? (
        <MembershipQuiz
          helper={helper}
          onPick={(key) => {
            if (key) setPlanKey(key);
            goTo('plans');
            window.scrollTo({ top: 0 });
          }}
        />
      ) : versus ? (
        <MembershipCompare />
      ) : (
        <div className="shell py-5 lg:grid lg:grid-cols-12 lg:items-start lg:gap-8">
          <div className="space-y-4 lg:col-span-8">
          {/* -- Pick a tier --------------------------------------- */}
          <div className="rail items-end gap-3 pt-4">
            {plans.map((p) => {
              const on = p.key === planKey;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setPlanKey(p.key)}
                  aria-pressed={on}
                  className={`relative w-[8.5rem] shrink-0 rounded-2xl bg-gradient-to-b px-3 text-white transition ${p.tone} ${
                    on ? 'py-9 shadow-lift' : 'py-6 opacity-90 hover:opacity-100'
                  }`}
                >
                  {p.popular && (
                    <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-ink-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide">
                      <Crown size={11} className="text-gold" fill="currentColor" strokeWidth={0} />
                      Most Popular
                    </span>
                  )}
                  <span className="block text-[15px] font-extrabold uppercase tracking-wide">
                    {p.label}
                  </span>
                  {!on && <span className="mt-1 block text-[13px] leading-tight">{p.audience}</span>}
                </button>
              );
            })}
          </div>

          {/* -- What that tier is ---------------------------------- */}
          <section className={`overflow-hidden rounded-2xl bg-gradient-to-b ${plan.tone} p-1.5 pt-3`}>
            <div className="rounded-2xl bg-white p-4 sm:p-5">
              <h2 className="text-xl font-bold" style={{ color: plan.accent }}>{plan.title}</h2>
              <p className="mt-1 text-[14px] leading-snug text-ink-700">{plan.blurb}</p>

              <dl className="mt-5 grid grid-cols-2 gap-3">
                {plan.stats.map((s) => (
                  <div key={s.note} className="rounded-xl p-3.5" style={{ background: plan.soft }}>
                    <dt className="text-[15px] font-bold" style={{ color: plan.accent }}>{s.figure}</dt>
                    <dd className="text-[13px] leading-snug text-ink-700">{s.note}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 flex items-center justify-between gap-4">
                <span className="text-[15px] font-semibold text-ink-900">Membership fee</span>
                <span className="text-xl font-extrabold text-ink-900">{inr(plan.fee)}</span>
              </div>

              <button
                type="button"
                className={`mt-4 w-full rounded-xl bg-gradient-to-b ${plan.tone} px-5 py-3.5 text-[15px] font-bold text-white transition hover:brightness-105`}
              >
                Select The Plan
              </button>
            </div>
          </section>

          {/* -- What's Included ------------------------------------ */}
          <section>
            <h2 className="text-lg font-bold text-ink-900">What&rsquo;s Included</h2>
            <ul className="card mt-3 divide-y divide-surface-line">
              {membershipIncluded.map((item) => (
                <li key={item.title} className="flex gap-3 p-4 sm:p-5">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-white" style={{ background: plan.accent }}>
                    <Check size={13} strokeWidth={3} />
                  </span>
                  <span>
                    <span className="block text-[15px] font-bold text-ink-900">{item.title}</span>
                    <span className="mt-1 block text-[14px] leading-relaxed text-ink-600">
                      {item.body}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* -- Pick your privileges ------------------------------- */}
          <section>
            <h2 className="text-lg font-bold text-ink-900">Smira Privilege Rate</h2>
            <p className="mt-0.5 text-[14px] text-ink-500">
              {plan.label} members choose up to {plan.privileges} of {membershipPrivileges.length}.
            </p>

            <div className="card mt-3 space-y-3 p-3 sm:p-4">
              {membershipPrivileges.map((p) => {
                const on = privileges.includes(p.key);
                return (
                  <label
                    key={p.key}
                    className={`flex cursor-pointer gap-3 rounded-xl p-3.5 transition ${
                      on ? 'bg-[#fdf3dd]' : 'bg-[#fdf9ef] hover:bg-[#fdf3dd]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => togglePrivilege(p.key)}
                      className="sr-only"
                    />
                    <Tick on={on} colour={plan.accent} />
                    <span className="min-w-0">
                      <span className="block text-[15px] font-bold text-ink-900">{p.label}</span>
                      <span className="mt-0.5 block text-[14px] leading-snug text-ink-600">
                        {p.body}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </section>

          {/* -- The offer on the clock ----------------------------- */}
          <section className="rounded-2xl bg-[#f1eefe] p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex min-w-0 gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white">
                  <Gift size={20} className="text-[#6d4bd8]" />
                </span>
                <div className="min-w-0">
                  <p className="text-lg font-bold leading-tight text-[#6d4bd8]">
                    {membershipOffer.title}
                  </p>
                  <p className="mt-1 text-[14px] leading-snug text-ink-800">
                    {membershipOffer.body}
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                <p className="mb-1.5 text-right text-[13px] text-ink-600">{membershipOffer.note}</p>
                <Countdown hours={membershipOffer.endsInHours} />
              </div>
            </div>
          </section>

          {/* -- Gifts ---------------------------------------------- */}
          <section className="card p-4 sm:p-5">
            <h2 className="text-lg font-bold text-action-500">Exclusive Gifts</h2>
            <p className="mt-1 text-[14px] leading-snug text-ink-700">
              Enjoy your premium gifts with your {plan.label} membership
            </p>

            <div className="mt-4 space-y-3">
              {membershipGifts.map((g) => {
                const on = gifts.includes(g.key);
                return (
                  <label
                    key={g.key}
                    className="flex cursor-pointer items-center gap-3.5 overflow-hidden rounded-xl bg-[#fdf9ef]"
                  >
                    <span className="relative h-[74px] w-[86px] shrink-0 overflow-hidden">
                      <Image src={toSrc(giftArt[g.key] || g.image)} alt="" fill sizes="86px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1 py-2">
                      <span className="block text-[15px] font-bold leading-snug text-ink-900">
                        {g.label}
                      </span>
                      {g.note && <span className="block text-[13px] text-ink-500">{g.note}</span>}
                    </span>
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() =>
                        setGifts((list) =>
                          list.includes(g.key) ? list.filter((k) => k !== g.key) : [...list, g.key],
                        )
                      }
                      className="sr-only"
                    />
                    <span className="pr-4">
                      <Tick on={on} colour={plan.accent} />
                    </span>
                  </label>
                );
              })}
            </div>

            {/* The coupon sits with the gifts, above their conditions. */}
            <h3 className="mt-6 text-[15px] font-bold text-ink-900">Have a Coupon Code?</h3>
            <div className="mt-2 flex gap-2">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Have a Coupon Code"
                aria-label="Coupon code"
                className="w-full min-w-0 rounded-xl border border-surface-line px-4 py-3.5 text-[14px] outline-none placeholder:text-ink-400 focus:border-action-500"
              />
              <button
                type="button"
                onClick={applyCoupon}
                className="shrink-0 rounded-xl bg-[#e8722a] px-6 text-[14px] font-bold text-white transition hover:bg-[#d3641f]"
              >
                Apply
              </button>
            </div>

            {note && <p className="mt-2 text-[13px] text-ink-500">{note}</p>}

            {discount > 0 && (
              <p className="mt-4 flex items-center gap-2.5 rounded-lg bg-[#e8f6ec] px-3.5 py-3 text-[14px] font-semibold text-green-700">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-green-600 text-white">
                  <Check size={14} strokeWidth={3} />
                </span>
                You saved {inr(discount)} on this purchase
              </p>
            )}

            <h3 className="mt-6 text-[15px] font-bold text-action-500">Gift Conditions</h3>
            <ul className="mt-2 space-y-2">
              {membershipGiftConditions.map((c) => (
                <li key={c} className="flex gap-2.5 text-[14px] leading-snug text-ink-600">
                  <Info size={17} className="mt-0.5 shrink-0 text-action-500" />
                  {c.replace('Gold', plan.label)}
                </li>
              ))}
            </ul>
          </section>

          {/* -- Sharing, and the terms ----------------------------- */}
          <section className="card p-4 sm:p-5">
            <label className="flex cursor-pointer gap-3">
              <input
                type="checkbox"
                checked={sharing}
                onChange={(e) => setSharing(e.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-action-500"
              />
              <span className="text-[15px] font-bold leading-snug text-ink-900">
                Share Your Membership Benefits With Your Relatives &amp; Friends
              </span>
            </label>

            <p className="mt-4 text-[15px] text-ink-900">
              Pay <span className="font-extrabold">{inr(membershipSharing.price)}</span>
            </p>
            <p className="text-[14px] text-ink-500">{membershipSharing.label}</p>
          </section>

          <section className="card p-4 sm:p-5">
            <label className="flex cursor-pointer gap-3">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-action-500"
              />
              <span className="text-[14px] leading-relaxed text-ink-900">
                I have read &amp; Understood the{' '}
                <a href="/more/terms" className="text-action-500">Terms &amp; Conditions</a>
              </span>
            </label>

            <a
              href="/more/terms"
              className="mt-5 block text-center text-[15px] font-semibold text-action-500 underline"
            >
              View Detailed Membership Guidelines
            </a>
          </section>

          {/* -- What it comes to ----------------------------------- */}
          <section className="card p-4 sm:p-5">
            <h2 className="text-lg font-bold text-ink-900">Price Summary</h2>


            <dl className="mt-4 text-[14px]">
              <div className="flex items-center justify-between gap-4 py-2.5">
                <dt className="text-ink-900">Membership Fees</dt>
                <dd className="font-semibold text-ink-900">{inr(plan.fee)}</dd>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between gap-4 py-2.5">
                  <dt className="text-green-600">Coupon Discount ({applied})</dt>
                  <dd className="font-semibold text-green-600">-{discount}</dd>
                </div>
              )}

              <div className="flex items-center justify-between gap-4 py-2.5">
                <dt className="text-ink-900">Membership Sharing Price</dt>
                <dd className="font-semibold text-ink-900">
                  {sharing ? inr(membershipSharing.price) : '-'}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-dashed border-surface-line py-2.5">
                <dt className="text-ink-900">Gift value</dt>
                <dd className="font-semibold text-ink-900">-</dd>
              </div>

              <div className="flex items-center justify-between gap-4 pt-3">
                <dt className="text-[15px] font-bold text-[#c0392b]">You Saved</dt>
                <dd className="text-[15px] font-bold text-[#c0392b]">{inr(discount)}</dd>
              </div>
            </dl>
          </section>

          <p className="flex items-center justify-center gap-2 py-4 text-[14px] text-ink-500">
            <ShieldCheck size={19} className="text-ink-400" />
            100% Secure Payments
          </p>
          </div>

          {/*
            What you are buying.

            A phone gets the pinned bar it has room for. A desktop gets this
            rail instead — a card floating across the middle of the page sits
            on top of the very plan you are reading.
          */}
          <aside className="hidden lg:col-span-4 lg:block lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl bg-white shadow-card">
              <p className={`flex items-center gap-2 bg-gradient-to-r ${plan.tone} px-5 py-3 text-[14px] font-semibold text-white transition-colors`}>
                <Check size={17} strokeWidth={3} />
                Selected Plan ({plan.label} Membership)
              </p>

              <div className="relative p-5">
                <span aria-hidden="true" className={`absolute inset-0 bg-gradient-to-b ${plan.tone} opacity-[0.08]`} />
                <div className="relative">
                <p className="text-[14px] text-ink-700">Total Amount</p>
                <p className="text-2xl font-extrabold text-ink-900">{inr(total)}</p>
                <p className="text-[13px] text-ink-500">(Taxes Included)</p>

                <button
                  type="button"
                  onClick={join}
                  disabled={!agreed || joining}
                  title={agreed ? undefined : 'Agree to the terms first'}
                  className={`mt-5 w-full rounded-lg bg-gradient-to-r ${plan.tone} py-4 text-[14px] font-bold uppercase tracking-wide text-white shadow-card transition hover:brightness-105 disabled:opacity-50`}
                >
                  {joining ? 'Sending…' : 'Pay now'}
                </button>
                {failed && <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[13px] font-medium text-red-600">{failed}</p>}
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/*
        What you are buying, pinned.

        Only over the plans. The questionnaire has no plan chosen yet, so a
        bar quoting a total there would be quoting something the member has
        not picked — the design leaves it off, and it is right to.
      */}
      {tab === 'plans' && (
      <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
        <div className="overflow-hidden border-t border-surface-line bg-white shadow-[0_-4px_16px_-8px_rgba(17,24,32,0.18)]">
          {/* Right by the button, where someone who just pressed it is looking. */}
          {failed && (
            <p role="alert" className="bg-red-50 px-4 py-2.5 text-[13px] font-medium text-red-600 sm:px-6">{failed}</p>
          )}
          <p className={`flex items-center gap-2 bg-gradient-to-r ${plan.tone} px-4 py-2.5 text-[14px] font-semibold text-white transition-colors sm:px-6`}>
            <Check size={17} strokeWidth={3} />
            Selected Plan ({plan.label} Membership)
          </p>

          <div
            className="flex items-center gap-4 px-4 py-3.5 sm:px-6"
            style={{ paddingBottom: 'max(0.875rem, env(safe-area-inset-bottom))' }}
          >
            <div className="min-w-0 flex-1">
              <p className="text-[14px] text-ink-700">Total Amount</p>
              <p className="text-xl font-extrabold text-ink-900">{inr(total)}</p>
              <p className="text-[13px] leading-tight text-ink-500">(Taxes Included)</p>
            </div>

            <button
              type="button"
              onClick={join}
              disabled={!agreed || joining}
              title={agreed ? undefined : 'Agree to the terms first'}
              className={`min-w-[10.5rem] shrink-0 rounded-lg bg-gradient-to-r ${plan.tone} px-8 py-4 text-[14px] font-bold uppercase tracking-wide text-white shadow-card transition hover:brightness-105 disabled:opacity-50`}
            >
              {joining ? 'Sending…' : 'Pay now'}
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
