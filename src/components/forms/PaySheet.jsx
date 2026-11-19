'use client';

import { useEffect } from 'react';
import { Loader2, Lock, ShieldCheck, X } from 'lucide-react';
import Portal from '@/components/ui/Portal';
import { inr } from '@/lib/format';
import { MERCHANT } from '@/lib/payment';

/**
 * Paying Smira, through Razorpay — one button.
 *
 * The sheet shows the amount and "Pay securely". Pressing it raises the
 * membership and opens Razorpay's Checkout, where the member pays by UPI,
 * card, net banking or wallet, on a phone or a computer. Once Razorpay
 * confirms, the membership activates by itself.
 */
export default function PaySheet({ open, onClose, amount, note, busy, error, onPay }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && !busy && onClose();
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose, busy]);

  if (!open) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[70] flex items-end justify-center bg-ink-900/55 sm:items-center sm:p-6"
        onMouseDown={(e) => e.target === e.currentTarget && !busy && onClose()}
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
              disabled={busy}
              aria-label="Close"
              className="-mr-2 grid h-9 w-9 place-items-center rounded-full text-ink-500 transition hover:bg-surface-soft disabled:opacity-40"
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

            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[12px] font-semibold text-ink-500">
              <span>UPI</span>
              <span className="h-1 w-1 rounded-full bg-ink-300" />
              <span>Cards</span>
              <span className="h-1 w-1 rounded-full bg-ink-300" />
              <span>Net banking</span>
              <span className="h-1 w-1 rounded-full bg-ink-300" />
              <span>Wallets</span>
            </div>

            <button
              type="button"
              onClick={() => !busy && onPay()}
              disabled={busy}
              className="btn-primary mt-4 w-full py-4 text-[16px] font-bold disabled:opacity-60"
            >
              {busy ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />} {busy ? 'Opening payment…' : 'Pay securely'}
            </button>

            {error && <p className="mt-3 text-center text-[13px] font-semibold text-rose-600">{error}</p>}

            <p className="mt-4 flex items-start justify-center gap-1.5 text-center text-[12px] leading-snug text-ink-500">
              <ShieldCheck size={14} className="mt-0.5 shrink-0 text-green-600" />
              Secured by Razorpay. Your membership starts as soon as the payment goes through.
            </p>
          </div>
        </div>
      </div>
    </Portal>
  );
}
