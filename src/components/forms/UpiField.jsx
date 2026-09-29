'use client';

import { Info } from 'lucide-react';

/**
 * Where the money will come from.
 *
 * Nothing is charged on this site — there is no gateway yet — so this is
 * not a payment box and it does not pretend to be one. It is the handle
 * the desk raises a collect request against, which beats ringing to ask
 * for it and then ringing again to say it has been sent.
 *
 * It is optional on purpose. Somebody who would rather pay by card, or
 * transfer, or in the branch, should not be stopped at the last step of a
 * booking over a field we cannot use yet; the desk asks them instead, and
 * the note on the booking says so.
 */
export default function UpiField({ value, onChange, note }) {
  const shaped = !value.trim() || /^[\w.\-]{2,}@[a-z]{2,}$/i.test(value.trim());

  return (
    <section className="card p-4 sm:p-5">
      <h2 className="text-lg font-bold text-ink-900">Payment</h2>
      <p className="mt-0.5 text-[13px] text-ink-600">
        {note || 'Nothing is charged now. Leave your UPI ID and our desk sends the request to approve.'}
      </p>

      <label className="mt-3 block">
        <span className="mb-1.5 block text-[13px] font-semibold text-ink-700">
          UPI ID <span className="font-medium text-ink-400">(optional)</span>
        </span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="yourname@okhdfcbank"
          inputMode="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          aria-label="Your UPI ID"
          aria-invalid={!shaped}
          className={`w-full rounded-xl border px-3.5 py-3 text-[15px] outline-none transition ${
            shaped ? 'border-surface-line focus:border-action-500' : 'border-red-400'
          }`}
        />
      </label>

      {!shaped && (
        <p role="alert" className="mt-1.5 text-[13px] font-medium text-red-600">
          A UPI ID looks like yourname@okhdfcbank.
        </p>
      )}

      <p className="mt-3 flex gap-2 rounded-xl bg-[#e8f2fe] p-3 text-[12px] leading-snug text-brand-700">
        <Info size={15} className="mt-0.5 shrink-0 text-action-500" />
        No money moves until you approve the request on your own UPI app. Prefer
        to pay another way? Leave this blank and the desk will ask.
      </p>
    </section>
  );
}

/** Blank is fine; anything typed has to look like a handle. */
export const upiLooksWrong = (value) =>
  Boolean(value.trim()) && !/^[\w.\-]{2,}@[a-z]{2,}$/i.test(value.trim());
