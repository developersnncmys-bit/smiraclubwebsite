'use client';

import { useEffect } from 'react';
import { Loader2, Smartphone, X } from 'lucide-react';
import Portal from '@/components/ui/Portal';
import { inr } from '@/lib/format';
import { MERCHANT, upiLink } from '@/lib/payment';

/**
 * Paying Smira, by UPI.
 *
 * It is the only way offered. A card and a net banking login cannot be
 * taken on a page that is not a certified payment page, so those two
 * only ever asked the desk to send a link later — which is a slower way
 * of doing what the desk does anyway, dressed up as a payment option.
 * They are gone rather than left on the sheet looking like they work.
 *
 * UPI finishes here because nothing secret is typed: the phone's own app
 * takes it, and the account the money goes to travels inside the link
 * rather than being printed on the screen.
 *
 * Nothing here can tell whether money arrived — there is no gateway
 * listening. So nothing here says it did. There was an "I have paid"
 * button, and a button is not a receipt: whoever pressed it, paid or
 * not, the desk still had to go and look. Continue says the true thing
 * — which plan they want — and the membership is switched on when the
 * money is found.
 */

export default function PaySheet({ open, onClose, amount, note, busy, error, onPaid }) {
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
              Pay by UPI
            </p>

            <div className="mt-3 flex items-center gap-3.5 rounded-xl border border-action-500 bg-action-500/[0.06] px-4 py-3.5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-action-500 text-white">
                <Smartphone size={19} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-bold text-ink-900">UPI</span>
                <span className="block text-[12px] text-ink-500">GPay, PhonePe, Paytm, BHIM</span>
              </span>
            </div>

            <div className="mt-4 border-t border-surface-line pt-4">
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
            </div>

            {/* -- Telling us it is done ------------------------------- */}
            <div className="mt-5 border-t border-surface-line pt-4">
              {error && <p className="mb-3 text-[13px] font-semibold text-rose-600">{error}</p>}

              <button
                type="button"
                onClick={() => onPaid('UPI')}
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 py-4 text-[15px] font-bold uppercase tracking-wide text-white transition hover:brightness-110 disabled:opacity-60"
              >
                {busy && <Loader2 size={17} className="animate-spin" />}
                {busy ? 'Sending…' : 'Continue'}
              </button>

              <p className="mt-3 text-center text-[12px] leading-snug text-ink-400">
                We tell the desk which plan you want. Your membership starts once
                they see the payment in the account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
