'use client';

import { useEffect, useState } from 'react';
import { Building2, ChevronRight, CreditCard, Loader2, Smartphone, X } from 'lucide-react';
import Portal from '@/components/ui/Portal';
import { inr } from '@/lib/format';
import { MERCHANT, upiLink } from '@/lib/payment';

/**
 * Choosing how to pay Smira.
 *
 * Three ways, as any payment page lists them: UPI, a card, or net
 * banking. UPI is the only one that can be finished from here, because it
 * is the only one where nothing secret is typed — the phone's own app
 * takes it, and the account the money goes to travels inside the link
 * rather than being printed on the screen.
 *
 * A card number and a net banking login are not ours to take. Typing
 * either into a page that is not a certified payment page is how card
 * details get stolen, and no amount of care in this file would make it
 * safe. So those two ask the desk for a payment link instead, which is
 * what the desk already sends.
 *
 * Nothing here can tell whether money arrived — there is no gateway
 * listening. So nothing here says it did. There was an "I have paid"
 * button, and a button is not a receipt: whoever pressed it, paid or
 * not, the desk still had to go and look. Continue says the true thing
 * — which plan they want and how they are paying for it — and the
 * membership is switched on when the money is found.
 */

const WAYS = [
  {
    key: 'UPI',
    label: 'UPI',
    note: 'GPay, PhonePe, Paytm, BHIM',
    icon: Smartphone,
  },
  {
    key: 'Card',
    label: 'Cards',
    note: 'Credit or debit',
    icon: CreditCard,
  },
  {
    key: 'Netbanking',
    label: 'Net banking',
    note: 'All major banks',
    icon: Building2,
  },
];

export default function PaySheet({ open, onClose, amount, note, busy, error, onPaid }) {
  const [how, setHow] = useState('UPI');

  useEffect(() => {
    if (open) setHow('UPI');
  }, [open]);

  // Escape closes it, and the page behind it stays still.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  const upi = how === 'UPI';

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[70] flex items-end justify-center bg-ink-900/55 sm:items-center sm:p-6"
        onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Pay Smira Club"
          className="flex max-h-[92vh] w-full max-w-phone flex-col overflow-hidden rounded-t-2xl bg-white shadow-lift sm:rounded-2xl"
        >
          <header className="flex shrink-0 items-center justify-between border-b border-surface-line px-5 py-3.5">
            <div className="min-w-0">
              <p className="text-[15px] font-bold text-ink-900">Pay {inr(amount)}</p>
              <p className="truncate text-[12px] text-ink-500">to {MERCHANT.name}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-2 grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-500 transition hover:bg-surface-soft"
            >
              <X size={20} />
            </button>
          </header>

          <div className="overflow-y-auto px-5 pb-6 pt-4">
            <p className="text-[13px] font-bold uppercase tracking-[0.1em] text-ink-400">
              Payment options
            </p>

            {/* -- The three ways -------------------------------------- */}
            <div className="mt-3 space-y-2">
              {WAYS.map(({ key, label, note: under, icon: Glyph }) => {
                const on = key === how;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setHow(key)}
                    aria-pressed={on}
                    className={`flex w-full items-center gap-3.5 rounded-xl border px-4 py-3.5 text-left transition ${
                      on
                        ? 'border-action-500 bg-action-500/[0.06]'
                        : 'border-surface-line hover:border-ink-300'
                    }`}
                  >
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${
                        on ? 'bg-action-500 text-white' : 'bg-surface-soft text-ink-600'
                      }`}
                    >
                      <Glyph size={19} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-bold text-ink-900">{label}</span>
                      <span className="block text-[12px] text-ink-500">{under}</span>
                    </span>
                    <ChevronRight
                      size={18}
                      className={on ? 'rotate-90 text-action-500 transition' : 'text-ink-400 transition'}
                    />
                  </button>
                );
              })}
            </div>

            {/* -- What that way means --------------------------------- */}
            <div className="mt-4 border-t border-surface-line pt-4">
              {upi ? (
                <>
                  {/*
                    The account is inside the link, not on the screen. The
                    phone hands it to whichever UPI app is installed, with
                    the amount already filled in, so there is nothing to
                    read off and nothing to mistype.
                  */}
                  <a
                    href={upiLink({ amount, note })}
                    className="flex items-center justify-center gap-2 rounded-xl bg-action-500 py-3.5 text-[15px] font-bold text-white transition hover:brightness-105"
                  >
                    <Smartphone size={17} /> Open my UPI app
                  </a>
                  <p className="mt-3 text-[13px] leading-snug text-ink-500">
                    {inr(amount)} is already filled in. Approve it in your app, then
                    come back and tell us.
                  </p>
                </>
              ) : (
                <p className="rounded-xl bg-surface-soft px-4 py-3.5 text-[13px] leading-relaxed text-ink-700">
                  Our desk sends you a secure payment link to finish
                  {how === 'Card' ? ' by card' : ' on your bank'}. Card numbers and
                  bank logins are never typed here — only on your bank&rsquo;s own page.
                </p>
              )}
            </div>

            {/* -- Telling us it is done ------------------------------- */}
            <div className="mt-5 border-t border-surface-line pt-4">
              {error && <p className="mb-3 text-[13px] font-semibold text-rose-600">{error}</p>}

              <button
                type="button"
                onClick={() => onPaid(how)}
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 py-4 text-[15px] font-bold uppercase tracking-wide text-white transition hover:brightness-110 disabled:opacity-60"
              >
                {busy && <Loader2 size={17} className="animate-spin" />}
                {busy ? 'Sending…' : upi ? 'Continue' : 'Send me the payment link'}
              </button>

              <p className="mt-3 text-center text-[12px] leading-snug text-ink-400">
                {upi
                  ? 'We tell the desk which plan you want. Your membership starts once they see the payment in the account.'
                  : 'Your membership starts once the link is paid.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
