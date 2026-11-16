'use client';

import { useEffect, useState } from 'react';
import { Check, Copy, Loader2, Smartphone, X } from 'lucide-react';
import Portal from '@/components/ui/Portal';
import { inr } from '@/lib/format';
import { MERCHANT, upiLink } from '@/lib/payment';

/**
 * Paying Smira, by UPI — in two steps.
 *
 * 1. Pay: scan the bank's QR (works from a laptop screen too), open the UPI
 *    app on this phone with the amount filled in, or copy the UPI id and pay
 *    from any app.
 * 2. Tell us: the 12-digit UTR / transaction id from the app, so the desk can
 *    find the money in the account and activate the membership.
 *
 * Nothing is sent until step 2. It used to send the membership and leave
 * for the profile page the moment "Pay" was tapped — the UPI app was still
 * opening, nothing was shown on a computer, and the desk never got a
 * reference to match the money to.
 *
 * The QR is the bank's own merchant QR, saved as /public/upi-qr.png. UPI
 * apps trust that one; if it is not there yet the QR box simply stays out.
 */
const QR_SRC = process.env.NEXT_PUBLIC_UPI_QR || '/upi-qr.png';

function CopyRow({ label, value, shown }) {
  const [done, setDone] = useState(false);
  return (
    <div className="flex items-center gap-3 rounded-xl border border-surface-line px-3.5 py-2.5">
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-wide text-ink-400">{label}</p>
        <p className="truncate text-[15px] font-bold text-ink-900">{shown || value}</p>
      </div>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(String(value));
            setDone(true);
            setTimeout(() => setDone(false), 1800);
          } catch {
            setDone(false);
          }
        }}
        className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-surface-line px-2.5 py-1.5 text-[12px] font-bold text-ink-700"
      >
        {done ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
        {done ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

export default function PaySheet({ open, onClose, amount, note, busy, error, onPaid }) {
  const [qrOk, setQrOk] = useState(true);
  const [utr, setUtr] = useState('');
  const [why, setWhy] = useState('');

  // Escape closes it, and the page behind it stays still.
  useEffect(() => {
    if (!open) return undefined;
    setWhy('');
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

  const clean = utr.replace(/[^A-Za-z0-9]/g, '');
  const submit = () => {
    if (clean.length < 10) {
      setWhy('Enter the 12-digit UTR / transaction ID from your UPI app.');
      return;
    }
    setWhy('');
    onPaid('UPI', clean);
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
            <p className="text-[13px] font-bold uppercase tracking-[0.1em] text-ink-400">Step 1 · Pay by UPI</p>

            {qrOk && (
              <div className="mt-3 flex flex-col items-center rounded-xl border border-surface-line p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={QR_SRC}
                  alt="Smira UPI QR code"
                  className="h-52 w-52 object-contain"
                  onError={() => setQrOk(false)}
                />
                <p className="mt-1 text-center text-[12px] text-ink-500">
                  Scan with GPay, PhonePe, Paytm or BHIM and pay <b className="text-ink-900">{inr(amount)}</b>
                </p>
              </div>
            )}

            <a
              href={upiLink({ amount, note })}
              className="btn-primary mt-3 w-full py-3.5 text-[15px] font-bold sm:hidden"
            >
              <Smartphone size={17} /> Open UPI app on this phone
            </a>

            <div className="mt-3 space-y-2">
              <CopyRow label="UPI ID" value={MERCHANT.upi} />
              <CopyRow label="Amount" value={Math.round(amount || 0)} shown={inr(amount)} />
            </div>
            <p className="mt-2 text-[12px] leading-snug text-ink-500">
              If your app says the payment was declined, scan the QR instead, or open your UPI app, choose
              “Pay to UPI ID”, paste the ID above and type the amount.
            </p>

            <div className="mt-5 border-t border-surface-line pt-4">
              <p className="text-[13px] font-bold uppercase tracking-[0.1em] text-ink-400">Step 2 · Tell us you have paid</p>
              <label className="mt-2 block">
                <span className="text-[13px] font-semibold text-ink-700">UTR / transaction ID</span>
                <input
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  inputMode="numeric"
                  placeholder="12 digits, e.g. 431234567890"
                  className="mt-1 w-full rounded-xl border border-surface-line px-3.5 py-3 text-[15px] tracking-wider outline-none focus:border-action-500"
                />
              </label>
              <p className="mt-1 text-[12px] text-ink-500">
                In your UPI app open the payment — it shows the UTR (or UPI Ref No / Transaction ID).
              </p>

              <button
                type="button"
                onClick={submit}
                disabled={busy}
                className="btn-primary mt-3 w-full py-3.5 text-[15px] font-bold disabled:opacity-60"
              >
                {busy ? <Loader2 size={17} className="animate-spin" /> : <Check size={17} />} I have paid — submit
              </button>
              {(why || error) && <p className="mt-2 text-[13px] font-semibold text-rose-600">{why || error}</p>}

              <button
                type="button"
                onClick={() => onPaid('UPI', '')}
                disabled={busy}
                className="mt-3 w-full text-center text-[13px] font-semibold text-ink-500 underline disabled:opacity-60"
              >
                Payment did not go through — ask Smira to call me
              </button>
              <p className="mt-3 text-[12px] leading-snug text-ink-500">
                Your membership starts as soon as our desk sees the payment in the account — usually within a few
                hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
