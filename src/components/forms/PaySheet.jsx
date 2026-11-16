'use client';

import { useEffect, useState } from 'react';
import { Loader2, ShieldCheck, Smartphone, X } from 'lucide-react';
import Portal from '@/components/ui/Portal';
import { inr } from '@/lib/format';
import { MERCHANT, upiLink } from '@/lib/payment';

/**
 * Paying Smira, by UPI — one button.
 *
 * The sheet shows the amount and "Proceed to pay". Pressing it opens the
 * phone's UPI app with Smira's account and the amount already filled in, and
 * tells the desk which plan was bought so the payment has a membership
 * waiting for it. The UPI id is inside the link, never on the screen.
 *
 * A computer has no UPI app, so there it says to open the page on the phone.
 */
export default function PaySheet({ open, onClose, amount, note, busy, error, onPaid }) {
  const [phone, setPhone] = useState(true);

  useEffect(() => {
    if (!open) return undefined;
    setPhone(/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || ''));
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

  const pay = () => {
    if (busy) return;
    // The app first, then the desk is told while it is open.
    window.location.href = upiLink({ amount, note });
    onPaid('UPI');
  };

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
          className="w-full max-w-phone overflow-hidden rounded-t-3xl bg-white shadow-lift sm:rounded-3xl"
        >
          <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-ink-900/15 sm:hidden" />
          <header className="flex items-center justify-between px-5 pb-1 pt-3">
            <p className="text-[16px] font-bold text-ink-900">Complete your payment</p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-2 grid h-9 w-9 place-items-center rounded-full text-ink-500 transition hover:bg-surface-soft"
            >
              <X size={20} />
            </button>
          </header>

          <div className="px-5 pb-6 pt-3">
            <div className="rounded-2xl bg-gradient-to-br from-[#123a63] to-[#1d5a96] px-5 py-5 text-center text-white">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/70">Amount to pay</p>
              <p className="mt-1 text-[34px] font-extrabold leading-none">{inr(amount)}</p>
              {note && <p className="mt-2 text-[13px] text-white/80">{note}</p>}
              <p className="mt-1 text-[11px] text-white/60">to {MERCHANT.name}</p>
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 text-[12px] font-semibold text-ink-500">
              <span>GPay</span>
              <span className="h-1 w-1 rounded-full bg-ink-300" />
              <span>PhonePe</span>
              <span className="h-1 w-1 rounded-full bg-ink-300" />
              <span>Paytm</span>
              <span className="h-1 w-1 rounded-full bg-ink-300" />
              <span>BHIM</span>
            </div>

            {phone ? (
              <button
                type="button"
                onClick={pay}
                disabled={busy}
                className="btn-primary mt-4 w-full py-4 text-[16px] font-bold disabled:opacity-60"
              >
                {busy ? <Loader2 size={18} className="animate-spin" /> : <Smartphone size={18} />} Proceed to pay
              </button>
            ) : (
              <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-center text-[13px] font-semibold text-amber-900">
                UPI payment opens in your phone&apos;s UPI app. Please open this page on your phone to pay.
              </p>
            )}

            {error && <p className="mt-3 text-center text-[13px] font-semibold text-rose-600">{error}</p>}

            <p className="mt-4 flex items-start justify-center gap-1.5 text-center text-[12px] leading-snug text-ink-500">
              <ShieldCheck size={14} className="mt-0.5 shrink-0 text-green-600" />
              Your membership starts as soon as our team sees the payment.
            </p>
          </div>
        </div>
      </div>
    </Portal>
  );
}
