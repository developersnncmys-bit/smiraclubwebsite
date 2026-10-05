'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Check, Crown, Gift, Info, ShieldCheck, Ticket } from 'lucide-react';
import {
  membershipGiftConditions,
  membershipCompareHero, membershipOffer, membershipPlans, membershipPrivileges,
  membershipSharing, membershipTabs,
} from '@/lib/content';
import Countdown from '@/components/ui/Countdown';
import MembershipQuiz from '@/components/membership/MembershipQuiz';
import MembershipCompare from '@/components/membership/MembershipCompare';
import { toSrc } from '@/lib/imageSlot';
import { inr, shortDate } from '@/lib/format';
import { api } from '@/lib/api';
import { readAttribution } from '@/components/layout/Attribution';
import PaySheet from '@/components/forms/PaySheet';
import { MERCHANT } from '@/lib/payment';
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
 * The colours a plan may wear, named on the admin panel and drawn here. The
 * website's own tier colours stay the fallback, so a plan the desk has never
 * given a colour looks exactly as it always did.
 */
/**
 * The tier colours, as pairs the page paints with.
 *
 * They are values rather than Tailwind classes because the desk can now type
 * a colour of its own on the panel, and a class like `from-[#123456]` only
 * exists if Tailwind saw it when the site was built. A colour that arrives
 * from the database never has.
 */
const ACCENTS = {
  // The five the site was designed in, to the exact value.
  silver: { from: '#8e969d', to: '#c4c9cd', accent: '#5f686f', soft: '#f1f3f4' },
  gold: { from: '#b8860b', to: '#dca72a', accent: '#b8860b', soft: '#fdf6e3' },
  platinum: { from: '#4f6c80', to: '#8ea3b1', accent: '#4f6c80', soft: '#eef2f5' },
  diamond: { from: '#1f8f98', to: '#4cbcc1', accent: '#1f8f98', soft: '#e8f7f8' },
  crown: { from: '#3a1348', to: '#a4501c', accent: '#6e2a4f', soft: '#f7eef2' },
  // And a few more, for a plan that is not one of the five.
  slate: { from: '#8e969d', to: '#c4c9cd', accent: '#5f686f', soft: '#f1f3f4' },
  amber: { from: '#b8860b', to: '#dca72a', accent: '#b8860b', soft: '#fdf6e3' },
  violet: { from: '#5b4a9c', to: '#8f7fd4', accent: '#5b4a9c', soft: '#f3f0fb' },
  brand: { from: '#1b3a6b', to: '#2f6fb8', accent: '#1b3a6b', soft: '#eef3fa' },
  sky: { from: '#0f6f8c', to: '#4bb3cf', accent: '#0f6f8c', soft: '#ecf7fa' },
  emerald: { from: '#12674a', to: '#3fa981', accent: '#12674a', soft: '#ecf7f2' },
  rose: { from: '#9c2a4f', to: '#d76a8c', accent: '#9c2a4f', soft: '#fcf0f4' },
};

/** #abc and #aabbcc both, to [r, g, b]. Anything else is not a colour. */
function rgbOf(hex) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(hex || '').trim());
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1];
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));
const hexOf = ([r, g, b]) => `#${[r, g, b].map((v) => clamp(v).toString(16).padStart(2, '0')).join('')}`;
/** Towards white by `amount`, which is how the five pairs were built. */
const lighten = (rgb, amount) => hexOf(rgb.map((v) => v + (255 - v) * amount));

/**
 * The palette for whatever the desk put in the colour box.
 *
 * One of the names gives the designed pair exactly. A hex code gives a pair
 * built from it — a lighter partner for the gradient and a very pale tint
 * for the stat tiles — so a colour nobody anticipated still produces a card
 * that looks like the others rather than a flat block.
 */
export function paletteFor(accent, fallback = 'brand') {
  const key = String(accent || '').trim().toLowerCase();
  if (ACCENTS[key]) return ACCENTS[key];
  const rgb = rgbOf(key);
  if (rgb) {
    return {
      from: hexOf(rgb),
      to: lighten(rgb, 0.38),
      accent: hexOf(rgb),
      soft: lighten(rgb, 0.92),
    };
  }
  return ACCENTS[fallback] || ACCENTS.brand;
}

/** The gradient the cards and the buttons are painted with. */
export const gradientOf = (pal) => `linear-gradient(to bottom, ${pal.from}, ${pal.to})`;
export const gradientAcrossOf = (pal) => `linear-gradient(to right, ${pal.from}, ${pal.to})`;

/**
 * One website plan with the admin panel's plan laid over it.
 *
 * Whatever the desk has filled in wins — the name, the tagline, the price,
 * the colour, the features and the gifts — and whatever it has left empty
 * falls back to the website's own copy, so no field is ever blank because
 * nobody has got round to it. The Crown's persons read "16+" on the Figma,
 * so the top tier keeps its plus.
 */
/**
 * The bundled copy, painted the same way as a plan from the desk.
 *
 * It is what the page draws before the desk's answer arrives, and what it
 * keeps if the answer never comes, so it has to carry a gradient too.
 */
function withPalette(p) {
  const pal = paletteFor(p.key);
  return { ...p, ...pal, gradient: gradientOf(pal), gradientAcross: gradientAcrossOf(pal) };
}

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

  // Whatever the desk typed in the colour box — one of the tier names, or
  // a hex code of its own — becomes this card's palette.
  const pal = paletteFor(d.accent, p.key);

  return {
    ...p,
    ...pal,
    gradient: gradientOf(pal),
    gradientAcross: gradientAcrossOf(pal),
    /**
     * The chip wants one short word — three of "Gold Voyager" across a phone
     * wraps to two lines each and shoulders the third tier off the screen —
     * so the desk sets that separately from the full name, which heads the
     * card below where there is room for it.
     */
    label: d.shortLabel?.trim() || p.label,
    title: d.name?.trim() || p.title,
    audience: d.tagline?.trim() || p.audience,
    blurb: d.blurb?.trim() || p.blurb,
    fee: Number(d.price) || p.fee,
    discount: Number(d.discount) || 0,
    /**
     * Sharing this plan with family, and what it costs.
     *
     * It used to be one price written into this file and charged on every
     * tier, so Silver and Crown cost the same to share quite different
     * benefits and the desk could not change either. Nought means this
     * plan is not shared, and the question is left off the page.
     */
    sharing: {
      price: Number(d.sharing?.price) || 0,
      label: d.sharing?.label?.trim() || membershipSharing.label,
    },
    popular: Boolean(d.popular),
    privileges: Number(d.privileges) || p.privileges,
    features: Array.isArray(d.features) ? d.features.filter(Boolean) : [],
    gifts: Array.isArray(d.gifts) ? d.gifts.filter(Boolean) : [],
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
export default function MembershipScreen({ hero, helper, compare, desk = [], offers = [] }) {
  const router = useRouter();
  const [tab, setTab] = useState('plans');
  // Nothing is chosen until they choose: the card below falls back to the
  // highlighted plan, which survives the desk renaming or hiding any of them.
  const [planKey, setPlanKey] = useState('');
  const [privileges, setPrivileges] = useState([]);
  // The gifts and the benefits are the plan's, read from whatever the desk
  // has typed against it rather than held as a choice the member makes.
  const [sharing, setSharing] = useState(true);
  const [agreed, setAgreed] = useState(true);

  /**
   * The coupon, as the desk has it on the Offers page.
   *
   * It used to be one code written into this file and applied before
   * anybody typed anything, so everybody got five hundred rupees off a
   * code they had never been given, and the desk could not add a second
   * one or retire that one. Nothing is applied until it is typed and the
   * desk has agreed it holds.
   */
  const [coupon, setCoupon] = useState('');
  /** What the desk said: { code, off, name, gives } — or nothing yet. */
  const [applied, setApplied] = useState(null);
  const [checking, setChecking] = useState(false);
  const [note, setNote] = useState('');
  /** Sent here from a details page they could not open yet. */
  const [returning, setReturning] = useState(false);
  /** Where they were headed, carried on to the sign-in link as well. */
  const [nextTo, setNextTo] = useState('');

  /**
   * The plans as the Smira desk has them set up on the admin panel — price,
   * free-stay days, validity, persons, rooms and preferred services — laid
   * over the website's own copy by tier name. The colours and wording stay the
   * website's; if the desk cannot be reached, the website's numbers stand.
   */
  /**
   * The website's five tiers, wearing whatever the desk has filled in.
   *
   * Matched by tier name where the desk has kept one — "Gold Voyager" is
   * our gold — and otherwise by position, cheapest first, so a plan the
   * desk has renamed outright still lands somewhere sensible. Where the
   * desk has nothing to say, the built-in copy stands.
   */
  /**
   * The plans, as the desk has them.
   *
   * The desk's list is the list. It used to be the other way round — five
   * built-in tiers with whatever the desk had laid over the top — which
   * meant hiding a plan did not remove it: the empty slot fell through to
   * the next plan along and the page showed Gold twice.
   *
   * Each one still borrows a built-in tier for the wording the desk has
   * not filled in, matched by name where it can be and by position
   * otherwise. With nothing from the desk at all, the built-in five stand
   * so the page is never blank.
   */
  const plans = useMemo(() => {
    if (!desk.length) return membershipPlans.map(withPalette);
    return desk.map((d, i) => {
      const name = (d.name || '').toLowerCase();
      const base =
        membershipPlans.find((m) => name.includes(m.key)) ||
        membershipPlans[i] ||
        membershipPlans[membershipPlans.length - 1];
      // Its own identity, so two plans borrowing one tier stay distinct.
      return { ...fromDesk(base, d), key: d.code || String(d._id || `plan-${i}`) };
    });
  }, [desk]);
  const plan =
    plans.find((p) => p.key === planKey) || plans.find((p) => p.popular) || plans[0];
  const versus = tab === 'versus';

  /** The gifts the desk has put on this plan. Not a choice the member makes. */
  const gifts = useMemo(() => (plan.gifts || []).filter(Boolean), [plan]);

  /**
   * What's Included, from the features the desk typed against the plan.
   *
   * Written as "Title — the detail" it draws as a heading with a sentence
   * under it, which is how the section was laid out when the three lines
   * were written into the site. A plain line is just the heading.
   */
  const included = useMemo(
    () =>
      (plan.features || []).filter(Boolean).map((f) => {
        const [title, ...rest] = String(f).split(/s+[—–-]s+/);
        return { title: title.trim(), body: rest.join(' — ').trim() };
      }),
    [plan],
  );

  /**
   * The tab is addressable — /membership?view=match opens the questionnaire.
   * Read once on mount rather than through the router, so the page can still
   * render statically and someone can send a link straight to the quiz.
   */
  useEffect(() => {
    const view = new URLSearchParams(window.location.search).get('view');
    if (membershipTabs.some((t) => t.key === view)) setTab(view);
    const to = new URLSearchParams(window.location.search).get('next') || '';
    setReturning(Boolean(to));
    if (to.startsWith('/') && !to.startsWith('//')) setNextTo(to);
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

  // Only offered where the desk has put a price on it.
  const canShare = plan.sharing?.price > 0;
  const sharingPrice = sharing && canShare ? plan.sharing.price : 0;
  /** What the coupon comes off: the fee and the sharing, before any code. */
  const gross = plan.fee + sharingPrice;
  const discount = Math.min(applied?.off || 0, gross);
  const total = useMemo(() => gross - discount, [gross, discount]);

  /**
   * Pay now: the profile has to be there (the desk needs to know who to call),
   * then the membership goes to the Smira desk and is recorded here, and the
   * member goes back to whatever sent them to join.
   */
  const { profile } = useProfile();
  const [joining, setJoining] = useState(false);
  const [failed, setFailed] = useState('');
  const [paying, setPaying] = useState(false);

  /**
   * Pay now opens the payment sheet rather than sending the membership.
   *
   * It used to send it straight off and tell the member their membership
   * was pending, without ever asking them for money — so "Pay now" was the
   * one thing the button did not do. The sheet shows the QR and the UPI
   * id; the membership is raised when they come back and say they have
   * paid, with their reference on it for the desk to match.
   *
   * The profile is still checked first: there is no point taking somebody
   * to a payment screen when we cannot tell them who it was for.
   */
  const payNow = () => {
    if (joining || !agreed) return;
    const current = profile || loadProfile();
    if (!isComplete(current)) return router.push(completeProfileHref());
    setFailed('');
    return setPaying(true);
  };

  const join = async (paidVia = 'UPI') => {
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
        coupon: applied?.code || undefined,
        paidVia,
        // Only a UPI payment goes to the account directly; the other two
        // are a link the desk raises, so there is no account to name.
        paidTo: paidVia === 'UPI' ? MERCHANT.upi : undefined,
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

  /**
   * Apply: ask the desk, and say what it says.
   *
   * The desk decides — whether the code exists, whether it is running,
   * whether this spend reaches its minimum and what it is worth. Working
   * any of that out here would only be a guess the server has to check
   * again anyway.
   */
  const applyCoupon = async (picked) => {
    const code = String(picked || coupon).trim().toUpperCase();
    if (!code) return setNote('Enter a code first.');
    if (checking) return;
    setChecking(true);
    setNote('');
    try {
      const res = await api.checkCoupon(code, gross, 'Membership');
      const c = res.data || {};
      if (c.valid) {
        setApplied({ code: c.code, off: c.off || 0, name: c.name || '', gives: c.gives || '' });
        setCoupon('');
        setNote('');
      } else {
        setApplied(null);
        setNote(c.reason || `We could not find "${code}".`);
      }
    } catch {
      setNote('We could not check that code just now. Please try again in a moment.');
    } finally {
      setChecking(false);
    }
  };

  /**
   * An offer in a line: what it takes off, and anything that has to be
   * true before it will. The desk's own description is used where the
   * offer is not money off, because a gift has no percentage to show.
   */
  const offerLine = (o) => {
    const parts = [];
    if (o.kind === 'Percent off') {
      parts.push(`${o.value}% off`);
      if (o.maxDiscount) parts.push(`up to ${inr(o.maxDiscount)}`);
    } else if (o.kind === 'Flat off') {
      parts.push(`${inr(o.value)} off`);
    } else {
      parts.push(o.description || o.name || o.kind);
    }
    if (o.minSpend) parts.push(`on ${inr(o.minSpend)} and over`);
    return parts.join(', ');
  };

  const dropCoupon = () => {
    setApplied(null);
    setNote('');
  };

  /**
   * A percentage is worth a different amount on a different plan, and a
   * code with a minimum spend may not reach it any more. Changing tier or
   * dropping the sharing re-asks rather than quietly keeping the old sum.
   */
  const appliedCode = applied?.code;
  useEffect(() => {
    if (!appliedCode) return undefined;
    let dropped = false;
    api
      .checkCoupon(appliedCode, gross, 'Membership')
      .then((res) => {
        if (dropped) return;
        const c = res.data || {};
        if (c.valid) setApplied({ code: c.code, off: c.off || 0, name: c.name || '', gives: c.gives || '' });
        else {
          setApplied(null);
          setNote(c.reason || 'That code no longer applies.');
        }
      })
      .catch(() => {});
    return () => {
      dropped = true;
    };
  }, [appliedCode, gross]);

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
            Details and bookings are for Smira Club members. Choose a plan below and we will take you straight back.{' '}
            <a href={`/login?next=${encodeURIComponent(nextTo || '/profile')}`} className="font-bold underline">Already a member? Log in</a>
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
                  style={{ backgroundImage: p.gradient }}
                  className={`relative w-[8.5rem] shrink-0 rounded-2xl px-3 text-white transition ${
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
          <section
            style={{ backgroundImage: plan.gradient }}
            className="overflow-hidden rounded-2xl p-1.5 pt-3"
          >
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

              {/*
                What's Included is not listed here as well. The section
                directly below this card draws the same features from the
                same plan, so the card was printing the list twice down one
                screen.
              */}

              {plan.gifts?.length > 0 && (
                <>
                  <h3 className="mt-6 text-[15px] font-bold text-ink-900">Gifts for members</h3>
                  <ul className="mt-2.5 flex flex-wrap gap-2">
                    {plan.gifts.map((g) => (
                      <li
                        key={g}
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold"
                        style={{ background: plan.soft, color: plan.accent }}
                      >
                        <Gift size={14} /> {g}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div className="mt-6 flex items-center justify-between gap-4">
                <span className="text-[15px] font-semibold text-ink-900">Membership fee</span>
                <span className="text-xl font-extrabold text-ink-900">{inr(plan.fee)}</span>
              </div>

              <button
                type="button"
                style={{ backgroundImage: plan.gradient }}
                className="mt-4 w-full rounded-xl px-5 py-3.5 text-[15px] font-bold text-white transition hover:brightness-105"
              >
                Select The Plan
              </button>
            </div>
          </section>

          {/*
            What's Included — whatever the desk has put on this plan.

            It used to be three lines written into the site, the same three
            on every tier, which meant the desk could add a benefit on the
            panel and nobody reading this page would ever learn about it.
            Each line is now a feature typed against the plan, so what is
            listed here is what the desk says the plan gives. A plan with
            none listed simply has no section.
          */}
          {included.length > 0 && (
            /* The footer's Member benefits link lands here. */
            <section id="benefits" className="scroll-mt-24">
              <h2 className="text-lg font-bold text-ink-900">What&rsquo;s Included</h2>
              <ul className="card mt-3 divide-y divide-surface-line">
                {included.map((item) => (
                  <li key={item.title} className="flex gap-3 p-4 sm:p-5">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-white" style={{ background: plan.accent }}>
                      <Check size={13} strokeWidth={3} />
                    </span>
                    <span>
                      <span className="block text-[15px] font-bold text-ink-900">{item.title}</span>
                      {item.body && (
                        <span className="mt-1 block text-[14px] leading-relaxed text-ink-600">
                          {item.body}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

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

          {/*
            Exclusive Gifts — whatever the desk has put on this plan.

            There were four fixed ones here with tick boxes beside them, as
            if the member were choosing which gifts to take. They were not
            choosing: the list was the same on every tier, nothing was
            priced, and the Gift value line below always read "-". What a
            plan comes with is the desk's to say, so these are the gifts
            typed against this plan on the panel, listed rather than
            offered.
          */}
          <section className="card p-4 sm:p-5">
            {gifts.length > 0 && (
              <>
                <h2 className="text-lg font-bold text-action-500">Exclusive Gifts</h2>
                <p className="mt-1 text-[14px] leading-snug text-ink-700">
                  Enjoy your premium gifts with your {plan.label} membership
                </p>

                <ul className="mt-4 space-y-3">
                  {gifts.map((g) => (
                    <li key={g} className="flex items-center gap-3.5 rounded-xl bg-[#fdf9ef] p-3.5">
                      <span
                        className="grid h-12 w-12 shrink-0 place-items-center rounded-xl"
                        style={{ background: plan.soft, color: plan.accent }}
                      >
                        <Gift size={21} />
                      </span>
                      <span className="min-w-0 text-[15px] font-bold leading-snug text-ink-900">{g}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* The coupon sits with the gifts, above their conditions. */}
            <h3 className="mt-6 text-[15px] font-bold text-ink-900">Have a Coupon Code?</h3>

            {applied ? (
              <div className="mt-2 flex items-center gap-3 rounded-xl border border-dashed border-green-600/40 bg-[#e8f6ec] px-3.5 py-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-green-600 text-white">
                  <Check size={14} strokeWidth={3} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-bold text-green-700">{applied.code} applied</p>
                  <p className="truncate text-[13px] text-ink-600">
                    {applied.off > 0
                      ? `You saved ${inr(applied.off)} on this purchase`
                      : applied.gives || applied.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={dropCoupon}
                  className="shrink-0 text-[13px] font-semibold text-ink-500 underline underline-offset-2 transition hover:text-ink-900"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  applyCoupon();
                }}
                className="mt-2 flex gap-2"
              >
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  placeholder="Have a Coupon Code"
                  aria-label="Coupon code"
                  autoCapitalize="characters"
                  spellCheck={false}
                  className="w-full min-w-0 rounded-xl border border-surface-line px-4 py-3.5 text-[14px] uppercase outline-none placeholder:normal-case placeholder:text-ink-400 focus:border-action-500"
                />
                <button
                  type="submit"
                  disabled={checking}
                  className="shrink-0 rounded-xl bg-[#e8722a] px-6 text-[14px] font-bold text-white transition hover:bg-[#d3641f] disabled:opacity-60"
                >
                  {checking ? 'Checking…' : 'Apply'}
                </button>
              </form>
            )}

            {note && <p className="mt-2 text-[13px] text-ink-500">{note}</p>}

            {/*
              The codes the desk has running, rather than a box you have to
              already know the answer to. Tapping one applies it, which is
              the same check as typing it — nothing here decides what an
              offer is worth.
            */}
            {!applied && offers.length > 0 && (
              <div className="mt-4">
                <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-ink-400">
                  Offers for you
                </p>
                <ul className="mt-2 space-y-2">
                  {offers.map((o) => (
                    <li
                      key={o.id || o.coupon}
                      className="flex items-center gap-3 rounded-xl border border-dashed border-action-500/40 bg-action-500/[0.04] px-3.5 py-3"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-action-500/10 text-action-500">
                        <Ticket size={18} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-bold tracking-wide text-ink-900">
                          {o.coupon}
                        </p>
                        <p className="truncate text-[13px] text-ink-600">{offerLine(o)}</p>
                        {o.endsOn && (
                          <p className="text-[12px] text-ink-400">Ends {shortDate(o.endsOn)}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => applyCoupon(o.coupon)}
                        disabled={checking}
                        className="shrink-0 rounded-lg border border-action-500 px-3.5 py-1.5 text-[13px] font-bold text-action-500 transition hover:bg-action-500 hover:text-white disabled:opacity-60"
                      >
                        Apply
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {gifts.length > 0 && (
              <>
                <h3 className="mt-6 text-[15px] font-bold text-action-500">Gift Conditions</h3>
                <ul className="mt-2 space-y-2">
                  {membershipGiftConditions.map((c) => (
                    <li key={c} className="flex gap-2.5 text-[14px] leading-snug text-ink-600">
                      <Info size={17} className="mt-0.5 shrink-0 text-action-500" />
                      {c.replace('Gold', plan.label)}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>

          {/* -- Sharing, where this plan is shared at all ---------- */}
          {canShare && (
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
                Pay <span className="font-extrabold">{inr(plan.sharing.price)}</span>
              </p>
              <p className="text-[14px] text-ink-500">{plan.sharing.label}</p>
            </section>
          )}

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
                  <dt className="text-green-600">Coupon Discount ({applied?.code})</dt>
                  <dd className="font-semibold text-green-600">-{inr(discount)}</dd>
                </div>
              )}

                {canShare && (
                <div className="flex items-center justify-between gap-4 border-b border-dashed border-surface-line py-2.5">
                  <dt className="text-ink-900">Membership Sharing Price</dt>
                  <dd className="font-semibold text-ink-900">
                    {sharing ? inr(plan.sharing.price) : '-'}
                  </dd>
                </div>
                )}

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
              <p
                style={{ backgroundImage: plan.gradientAcross }}
                className="flex items-center gap-2 px-5 py-3 text-[14px] font-semibold text-white transition-colors"
              >
                <Check size={17} strokeWidth={3} />
                Selected Plan ({plan.label} Membership)
              </p>

              <div className="relative p-5">
                <span aria-hidden="true" style={{ backgroundImage: plan.gradient }} className="absolute inset-0 opacity-[0.08]" />
                <div className="relative">
                <p className="text-[14px] text-ink-700">Total Amount</p>
                <p className="text-2xl font-extrabold text-ink-900">{inr(total)}</p>
                <p className="text-[13px] text-ink-500">(Taxes Included)</p>

                <button
                  type="button"
                  onClick={payNow}
                  disabled={!agreed || joining}
                  title={agreed ? undefined : 'Agree to the terms first'}
                  style={{ backgroundImage: plan.gradientAcross }}
                  className="mt-5 w-full rounded-lg py-4 text-[14px] font-bold uppercase tracking-wide text-white shadow-card transition hover:brightness-105 disabled:opacity-50"
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
          <p
            style={{ backgroundImage: plan.gradientAcross }}
            className="flex items-center gap-2 px-4 py-2.5 text-[14px] font-semibold text-white transition-colors sm:px-6"
          >
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
              onClick={payNow}
              disabled={!agreed || joining}
              title={agreed ? undefined : 'Agree to the terms first'}
              style={{ backgroundImage: plan.gradientAcross }}
              className="min-w-[10.5rem] shrink-0 rounded-lg px-8 py-4 text-[14px] font-bold uppercase tracking-wide text-white shadow-card transition hover:brightness-105 disabled:opacity-50"
            >
              {joining ? 'Sending…' : 'Pay now'}
            </button>
          </div>
        </div>
      </div>
      )}

      {/* The QR and the UPI id, over whatever they were reading. */}
      <PaySheet
        open={paying}
        onClose={() => setPaying(false)}
        amount={total}
        note={`Smira ${plan.label} membership`}
        busy={joining}
        error={failed}
        onPaid={(paidVia) => join(paidVia)}
      />
    </div>
  );
}
