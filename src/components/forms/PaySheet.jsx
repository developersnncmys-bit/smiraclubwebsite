'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';
import { Check, Copy, Loader2, QrCode, Smartphone, X } from 'lucide-react';
import Portal from '@/components/ui/Portal';
import { inr } from '@/lib/format';
import { MERCHANT, referenceLooksWrong, upiLink } from '@/lib/payment';

/**
 * Paying Smira, in the two ways anybody actually pays.
 *
 * Scan the code, or copy the UPI id into your own app. Both go to the same
 * merchant account; the code simply saves typing the id and the amount.
 *
 * Nothing here can tell whether the money arrived — there is no gateway
 * listening, and a page has no way to ask a bank. So the sheet does not
 * pretend to: the member pays, hands back the reference their app shows
 * them, and the desk matches it against the account before the membership
 * is switched on. Saying "payment received" on the strength of somebody
 * having tapped a button would be a lie the desk later has to undo.
 */
export default function PaySheet({ open, onClose, amount, note, busy, error, onPaid }) {
  const [how, setHow] = useState('qr');
  const [qr, setQr] = useState('');
  const [copied, setCopied] = useState(false);
  const [reference, setReference] = useState('');
  const [wrong, setWrong] = useState('');

  const link = upiLink({ amount, note });

  // Drawn in the browser because the amount is only known here — it moves
  // with the plan, the coupon and whether they are sharing.
  useEffect(() => {
    if (!open) return;
    let dropped = false;
    QRCode.toDataURL(link, { width: 480, margin: 1, errorCorrectionLevel: 'M' })
      .then((url) => !dropped && setQr(url))
      .catch(() => !dropped && setQr(''));
    return () => { dropped = true; };
  }, [open, link]);

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

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(MERCHANT.upi);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — the id is on the screen to read either way.
    }
  };

  const confirm = () => {
    if (referenceLooksWrong(reference)) {
      setWrong('That does not look like a UPI reference — it is usually 12 digits.');
      return;
    }
    setWrong('');
    onPaid(reference.trim());
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
            {/* -- The two ways ------------------------------------------ */}
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-surface-soft p-1">
              {[
                { key: 'qr', label: 'Scan QR', icon: QrCode },
                { key: 'upi', label: 'UPI ID', icon: Smartphone },
              ].map(({ key, label, icon: Glyph }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setHow(key)}
                  className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-[14px] font-bold transition ${
                    how === key ? 'bg-white text-action-500 shadow-card' : 'text-ink-600'
                  }`}
                >
                  <Glyph size={16} /> {label}
                </button>
              ))}
            </div>

            {how === 'qr' ? (
              <div className="mt-4 text-center">
                <div className="mx-auto inline-flex rounded-2xl border border-surface-line p-3">
                  {qr ? (
                    <Image src={qr} alt="UPI QR code" width={224} height={224} unoptimized className="h-56 w-56" />
                  ) : (
                    <span className="grid h-56 w-56 place-items-center text-ink-400">
                      <Loader2 size={22} className="animate-spin" />
                    </span>
                  )}
                </div>
                <p className="mt-3 text-[14px] leading-snug text-ink-600">
                  Open any UPI app — GPay, PhonePe, Paytm, BHIM — and scan this.
                  The amount is already in it.
                </p>
              </div>
            ) : (
              <div className="mt-4">
                <p className="text-[13px] font-semibold text-ink-500">Pay to this UPI ID</p>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-surface-line bg-surface-soft px-4 py-3.5">
                  <span className="min-w-0 flex-1 truncate text-[16px] font-bold text-ink-900">
                    {MERCHANT.upi}
                  </span>
                  <button
                    type="button"
                    onClick={copy}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[13px] font-bold text-action-500 shadow-card transition hover:bg-surface-soft"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>

                {/* Only a phone has a UPI app to hand this to; on a desktop
                    it does nothing, which is why the id is above it. */}
                <a
                  href={link}
                  className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-action-500 py-3.5 text-[15px] font-bold text-white transition hover:brightness-105"
                >
                  <Smartphone size={17} /> Open my UPI app
                </a>

                <p className="mt-3 text-[13px] leading-snug text-ink-500">
                  Send {inr(amount)} to {MERCHANT.name}, then come back and enter the
                  reference below.
                </p>
              </div>
            )}

            {/* -- Telling us it is done --------------------------------- */}
            <div className="mt-5 border-t border-surface-line pt-4">
              <label className="block">
                <span className="text-[14px] font-semibold text-ink-900">
                  UPI reference number <span className="font-normal text-ink-500">(optional)</span>
                </span>
                <input
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="12-digit number from your UPI app"
                  inputMode="numeric"
                  className="mt-2 w-full rounded-xl border border-surface-line px-4 py-3.5 text-[15px] outline-none placeholder:text-ink-400 focus:border-action-500"
                />
              </label>
              {wrong && <p className="mt-2 text-[13px] font-semibold text-rose-600">{wrong}</p>}
              <p className="mt-2 text-[13px] leading-snug text-ink-500">
                It helps our desk find your payment straight away. Without it they
                will call you to check.
              </p>

              {error && <p className="mt-3 text-[13px] font-semibold text-rose-600">{error}</p>}

              <button
                type="button"
                onClick={confirm}
                disabled={busy}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 py-4 text-[15px] font-bold uppercase tracking-wide text-white transition hover:brightness-110 disabled:opacity-60"
              >
                {busy && <Loader2 size={17} className="animate-spin" />}
                {busy ? 'Sending…' : 'I have paid'}
              </button>

              <p className="mt-3 text-center text-[12px] leading-snug text-ink-400">
                Your membership starts once our desk sees the payment in the account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
