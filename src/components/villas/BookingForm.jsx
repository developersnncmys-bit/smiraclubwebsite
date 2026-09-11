'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Info, Mail, User } from 'lucide-react';
import { inr } from '@/lib/format';

const BLANK = { name: '', email: '', phone: '' };

/** "SM-2026091142" — the reference the confirmation screen reads back. */
function bookingRef() {
  const now = new Date();
  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('');
  return `SM-${stamp}${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`;
}

/**
 * Everything on Review Booking that a member actually touches: the coupon,
 * who the booking is for, GST, the terms, and Continue.
 *
 * The price summary is worked out here too, so the sticky bar and the
 * breakdown can never disagree — they read the same numbers.
 *
 * Continue validates and goes to the confirmation screen. There is no
 * payment step in between yet; when there is, it slots in there and nothing
 * else on this screen has to change.
 *
 * `baseNote` is the small line under Base price. `bar` says what the pinned
 * bar quotes: a villa quotes the nightly rate it was advertised at, a hotel
 * quotes the total for the stay, so `bar.mode` picks between them and
 * `bar.notes` carries the lines underneath. `confirm` is what the
 * confirmation screen reads back.
 */
export default function BookingForm({
  price,
  was,
  taxes,
  discount,
  baseNote,
  showEmptyDiscount = false,
  bar = { mode: 'per-night', notes: [] },
  confirm = {},
  /** The read-back cards above the form, so they share the left column. */
  children,
}) {
  const router = useRouter();
  const [coupon, setCoupon] = useState('');
  const [couponNote, setCouponNote] = useState('');
  const [who, setWho] = useState('myself');
  const [guests, setGuests] = useState([{ ...BLANK }]);
  const [gst, setGst] = useState(false);
  const [gstin, setGstin] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [errors, setErrors] = useState({});

  const afterDiscount = price - discount;
  const total = afterDiscount + taxes;

  const setGuest = (i, field, value) =>
    setGuests((list) => list.map((g, n) => (n === i ? { ...g, [field]: value } : g)));

  const applyCoupon = () => {
    setCouponNote(
      coupon.trim()
        ? `We could not check "${coupon.trim()}" — coupons go live with the payments work.`
        : 'Enter a code first.',
    );
  };

  const submit = (e) => {
    e.preventDefault();
    const found = {};
    const lead = guests[0];
    if (!lead.name.trim()) found.name = 'Tell us who is staying.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(lead.email.trim())) found.email = 'That email does not look right.';
    if (!/^\d{10}$/.test(lead.phone.replace(/\D/g, ''))) found.phone = 'A 10-digit mobile number, please.';
    if (gst && !gstin.trim()) found.gstin = 'Add the GST number, or untick the box.';
    if (!agreed) found.agreed = 'The terms have to be agreed before booking.';

    setErrors(found);
    if (Object.keys(found).length !== 0) return;

    // No payment step yet, so a clean form goes straight to confirmation.
    const query = new URLSearchParams({
      ref: bookingRef(),
      name: confirm.name || '',
      slot: confirm.slot || '',
      nights: confirm.nights || '',
      total: String(total),
      kind: confirm.kind || 'stay',
    });
    router.push(`/booking/confirmed?${query.toString()}`);
  };

  const field = 'w-full rounded-xl border border-surface-line bg-white px-4 py-3.5 text-[15px] text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-action-500';

  /**
   * The price breakdown. Declared once and mounted twice — in the flow on a
   * phone, in the sticky rail on a desktop — because the two places want the
   * same numbers and a second copy of this markup would be a second place for
   * them to go wrong.
   */
  const Summary = () => (
    <section className="card p-4 sm:p-5">
      <h2 className="text-lg font-bold text-ink-900">Price Summary</h2>

      <dl className="mt-4 text-[15px]">
        <div className="flex items-start justify-between gap-4 border-b border-dashed border-surface-line pb-3">
          <dt>
            <span className="block font-semibold text-ink-900">Base price</span>
            {baseNote && <span className="block text-[14px] text-ink-500">{baseNote}</span>}
          </dt>
          <dd className="shrink-0 font-semibold text-ink-900">{inr(price)}</dd>
        </div>

        {(discount > 0 || showEmptyDiscount) && (
          <div className="flex items-center justify-between gap-4 border-b border-dashed border-surface-line py-3">
            <dt className="text-green-600">Discount By Property</dt>
            <dd className="shrink-0 font-semibold text-green-600">
              {discount > 0 ? `-${discount}` : '-'}
            </dd>
          </div>
        )}

        {discount > 0 && (
          <div className="flex items-center justify-between gap-4 border-b border-dashed border-surface-line py-3">
            <dt className="font-semibold text-ink-900">Price after Discount</dt>
            <dd className="shrink-0 font-semibold text-ink-900">{inr(afterDiscount)}</dd>
          </div>
        )}

        <div className="flex items-center justify-between gap-4 border-b border-dashed border-surface-line py-3">
          <dt className="flex items-center gap-1.5 text-ink-700">
            Taxes &amp; Service Fees
            <span title="Government taxes and the platform service fee.">
              <Info size={15} className="text-ink-400" />
            </span>
          </dt>
          <dd className="shrink-0 font-semibold text-ink-900">{inr(taxes)}</dd>
        </div>

        <div className="flex items-center justify-between gap-4 pt-3">
          <dt className="text-[16px] font-bold text-ink-900">Total Amount to be paid</dt>
          <dd className="shrink-0 text-[16px] font-bold text-ink-900">{inr(total)}</dd>
        </div>
      </dl>
    </section>
  );

  return (
    <form onSubmit={submit} className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-8">
      {/*
        A phone reads this top to bottom. A desktop splits it: what you fill
        in on the left, what it costs pinned on the right, so the total stays
        in view while you work down the form instead of being a card floating
        over the middle of the page.
      */}
      <div className="space-y-4 lg:col-span-7">
        {children}

      {/* On a phone the summary reads here, as the design has it. */}
      <div className="lg:hidden">
        <Summary />
      </div>

      {/* -- Coupons -------------------------------------------------- */}
      <section className="card p-4 sm:p-5">
        <h2 className="text-lg font-bold text-ink-900">Coupon Codes</h2>

        <div className="mt-3 flex gap-2">
          <input
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Have a Coupon Code"
            aria-label="Coupon code"
            className={`${field} flex-1`}
          />
          <button
            type="button"
            onClick={applyCoupon}
            className="shrink-0 rounded-xl bg-[#e8722a] px-6 text-[15px] font-bold text-white transition hover:bg-[#d3641f]"
          >
            Apply
          </button>
        </div>

        {couponNote && <p className="mt-2 text-[14px] text-ink-500">{couponNote}</p>}

        <button type="button" className="mt-3 text-[15px] font-semibold text-action-500 underline">
          View Coupons
        </button>
      </section>

      {/* -- Who is this for ------------------------------------------ */}
      <section className="card p-4 sm:p-5">
        <h2 className="text-lg font-bold text-ink-900">I am booking for</h2>

        <div className="mt-4 flex flex-wrap gap-6">
          {[
            { key: 'myself', label: 'Myself' },
            { key: 'other', label: 'Someone Else' },
          ].map((o) => (
            <label key={o.key} className="flex cursor-pointer items-center gap-2.5 text-[15px] font-medium text-ink-900">
              <input
                type="radio"
                name="bookingFor"
                value={o.key}
                checked={who === o.key}
                onChange={() => setWho(o.key)}
                className="h-5 w-5 accent-action-500"
              />
              {o.label}
            </label>
          ))}
        </div>

        {guests.map((guest, i) => (
          <div key={i} className={i > 0 ? 'mt-6 border-t border-surface-line pt-5' : 'mt-5'}>
            {i > 0 && (
              <p className="mb-3 text-[14px] font-bold uppercase tracking-[0.08em] text-ink-400">
                Guest {i + 1}
              </p>
            )}

            <label className="block">
              <span className="text-[15px] font-semibold text-ink-900">
                Full Name <span className="text-red-500">*</span>
              </span>
              <span className="relative mt-2 block">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  value={guest.name}
                  onChange={(e) => setGuest(i, 'name', e.target.value)}
                  placeholder="Enter your full name"
                  className={`${field} pl-11`}
                />
              </span>
            </label>
            {i === 0 && errors.name && <p className="mt-1.5 text-[13px] text-red-600">{errors.name}</p>}

            <label className="mt-4 block">
              <span className="text-[15px] font-semibold text-ink-900">
                Email ID <span className="text-red-500">*</span>
              </span>
              <span className="relative mt-2 block">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="email"
                  value={guest.email}
                  onChange={(e) => setGuest(i, 'email', e.target.value)}
                  placeholder="Enter your Email ID"
                  className={`${field} pl-11`}
                />
              </span>
            </label>
            {i === 0 && errors.email && <p className="mt-1.5 text-[13px] text-red-600">{errors.email}</p>}

            <div className="mt-4">
              <span className="text-[15px] font-semibold text-ink-900">
                Contact Number <span className="text-red-500">*</span>
              </span>
              <div className="mt-2 flex items-stretch overflow-hidden rounded-xl border border-surface-line bg-white">
                <select
                  aria-label="Country code"
                  className="shrink-0 cursor-pointer border-0 bg-transparent px-3 text-[15px] font-medium text-ink-900 outline-none"
                  defaultValue="+91"
                >
                  <option>+91</option>
                  <option>+971</option>
                  <option>+44</option>
                  <option>+1</option>
                </select>
                <input
                  inputMode="numeric"
                  value={guest.phone}
                  onChange={(e) => setGuest(i, 'phone', e.target.value)}
                  placeholder="Enter your  Mobile Number"
                  aria-label="Mobile number"
                  className="w-full min-w-0 border-0 px-2 py-3.5 text-[15px] text-ink-900 outline-none placeholder:text-ink-400"
                />
              </div>
            </div>
            {i === 0 && errors.phone && <p className="mt-1.5 text-[13px] text-red-600">{errors.phone}</p>}
          </div>
        ))}

        <button
          type="button"
          onClick={() => setGuests((g) => [...g, { ...BLANK }])}
          className="mt-5 text-[15px] font-semibold text-action-500"
        >
          + Add Another Guest
        </button>
      </section>

      {/* -- GST ------------------------------------------------------ */}
      <section className="card p-4 sm:p-5">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={gst}
            onChange={(e) => setGst(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-action-500"
          />
          <span>
            <span className="block text-[16px] font-bold text-ink-900">Add GST number</span>
            <span className="block text-[14px] text-action-500">
              Claim 18% credit using GST invoice
            </span>
          </span>
        </label>

        {gst && (
          <>
            <input
              value={gstin}
              onChange={(e) => setGstin(e.target.value.toUpperCase())}
              placeholder="Enter your GSTIN"
              aria-label="GST number"
              className={`${field} mt-4`}
            />
            {errors.gstin && <p className="mt-1.5 text-[13px] text-red-600">{errors.gstin}</p>}
          </>
        )}
      </section>

      {/* -- Terms ---------------------------------------------------- */}
      <section className="card p-4 sm:p-5">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-action-500"
          />
          <span className="text-[15px] leading-relaxed text-ink-900">
            By Proceeding, I agree to Smira Club&rsquo;s{' '}
            <a href="/more/terms" className="text-action-500 underline">User Agreement</a>,{' '}
            <a href="/more/terms" className="text-action-500 underline">Terms of Service</a> and{' '}
            <a href="/more/cancellation" className="text-action-500 underline">
              Cancellation &amp; Hotel Booking Policies.
            </a>
          </span>
        </label>
        {errors.agreed && <p className="mt-2 text-[13px] text-red-600">{errors.agreed}</p>}
      </section>

      {/*
        The bar that carries Continue.

        It sits flush to the bottom rather than clearing a tab bar, because
        Review Booking hides the tab bar — see BottomNav.
      */}
      <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
        <div className="border-t border-surface-line bg-white shadow-[0_-4px_16px_-8px_rgba(17,24,32,0.18)]">
          <div
            className="flex items-center gap-4 px-4 py-3.5 sm:px-6"
            style={{ paddingBottom: 'max(0.875rem, env(safe-area-inset-bottom))' }}
          >
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-baseline gap-2">
                <span className="text-xl font-extrabold text-ink-900">
                  {inr(bar.mode === 'total' ? total : price)}
                </span>
                {bar.mode !== 'total' && was && (
                  <span className="text-[15px] font-semibold text-red-500 line-through">
                    {inr(was)}
                  </span>
                )}
              </p>
              {bar.notes.map((note) => (
                <p key={note} className="text-[13px] leading-tight text-ink-500">
                  {note}
                </p>
              ))}
            </div>

            {/*
              The minimum width is what keeps this the same size as Book Room
              on the screen before it — "Continue" is the shorter word, so
              left to size itself it renders visibly smaller than the button
              it follows, and the flow looks like it is winding down.
            */}
            <button
              type="submit"
              className="btn-primary min-w-[10.5rem] shrink-0 rounded-lg px-8 py-4 text-[15px] uppercase tracking-wide"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
      </div>

      {/* -- The rail: what it costs, and the way on ----------------- */}
      <aside className="hidden lg:col-span-5 lg:block lg:sticky lg:top-24 lg:space-y-4">
        <Summary />

        <div className="card p-5">
          <p className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-[16px] font-bold text-ink-900">
              {bar.mode === 'total' ? 'Total' : 'Per night'}
            </span>
            <span className="text-2xl font-extrabold text-ink-900">
              {inr(bar.mode === 'total' ? total : price)}
            </span>
          </p>

          {bar.notes.map((note) => (
            <p key={note} className="text-right text-[13px] leading-tight text-ink-500">
              {note}
            </p>
          ))}

          <button
            type="submit"
            className="btn-primary mt-4 w-full rounded-lg py-4 text-[15px] uppercase tracking-wide"
          >
            Continue
          </button>
        </div>
      </aside>
    </form>
  );
}
