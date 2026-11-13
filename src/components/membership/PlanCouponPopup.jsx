'use client';

import { useEffect, useRef, useState } from 'react';
import { Copy, Check, Ticket, X } from 'lucide-react';
import Portal from '@/components/ui/Portal';
import { api } from '@/lib/api';
import { inr } from '@/lib/format';

/**
 * The coupon popup on a membership plan.
 *
 * When someone opens a plan that has a coupon the desk has made for it, a
 * card pops up — "70% OFF, use this coupon" — with the code to copy or apply.
 * The code is checked with the desk first, every time, so a coupon the admin
 * has made inactive (or that has run out) never pops up, even on a page that
 * was built a minute earlier. Each plan's popup shows once per visit.
 */
const big = (o) =>
  o.kind === 'Percent off' ? `${o.value}% OFF` : o.kind === 'Flat off' ? `${inr(o.value)} OFF` : o.name || o.kind;

/** The best one first: the biggest percentage, then the biggest flat amount. */
const worth = (o) => (o.kind === 'Percent off' ? 1e6 + (o.value || 0) : o.kind === 'Flat off' ? o.value || 0 : -1);

export default function PlanCouponPopup({ plan, offers, spend, onApply }) {
  const [show, setShow] = useState(null);
  const [copied, setCopied] = useState(false);
  const seen = useRef(new Set());

  useEffect(() => {
    if (!plan?.key || seen.current.has(plan.key)) return undefined;
    const best = [...(offers || [])].filter((o) => o.coupon).sort((a, b) => worth(b) - worth(a))[0];
    if (!best) return undefined;
    let gone = false;
    // Asked fresh: an inactive or used-up code says no here and stays hidden.
    api
      .checkCoupon(best.coupon, spend, 'Membership', plan.key)
      .then((res) => {
        if (gone || !res?.data?.valid) return;
        seen.current.add(plan.key);
        setCopied(false);
        setShow({ ...best, off: res.data.off || 0, planLabel: plan.label });
      })
      .catch(() => {});
    return () => {
      gone = true;
    };
  }, [plan?.key, plan?.label, offers, spend]);

  useEffect(() => {
    if (!show) return undefined;
    const esc = (e) => e.key === 'Escape' && setShow(null);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [show]);

  if (!show) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(show.coupon);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Portal>
      <style>{`
        @keyframes smira-pop { 0% { opacity: 0; transform: scale(.6) translateY(30px) } 60% { opacity: 1; transform: scale(1.04) } 100% { transform: scale(1) } }
        @keyframes smira-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes smira-shine { 0% { transform: translateX(-120%) rotate(20deg) } 100% { transform: translateX(320%) rotate(20deg) } }
        @keyframes smira-pulse { 0%, 100% { transform: scale(1) } 50% { transform: scale(1.06) } }
        @keyframes smira-fall { 0% { transform: translateY(-20px) rotate(0); opacity: 1 } 100% { transform: translateY(260px) rotate(540deg); opacity: 0 } }
      `}</style>
      <div
        className="fixed inset-0 z-[120] grid place-items-center bg-ink-900/55 px-4"
        style={{ animation: 'smira-fade .2s ease-out both' }}
        onClick={() => setShow(null)}
        role="dialog"
        aria-modal="true"
        aria-label={`${big(show)} coupon`}
      >
        <div
          className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white text-center shadow-lift"
          style={{ animation: 'smira-pop .55s cubic-bezier(.2,.9,.3,1.2) both' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* A little confetti */}
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              aria-hidden
              className="pointer-events-none absolute top-0 h-2 w-1.5 rounded-sm"
              style={{
                left: `${(i * 7 + 4) % 100}%`,
                background: ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#a855f7'][i % 5],
                animation: `smira-fall ${1.6 + (i % 4) * 0.35}s ease-in ${(i % 5) * 0.15}s both`,
              }}
            />
          ))}

          <button
            type="button"
            onClick={() => setShow(null)}
            className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/80 text-ink-500 hover:text-ink-900"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <div className="relative overflow-hidden bg-gradient-to-br from-[#123a63] via-[#1d5a96] to-[#f59e0b] px-6 pb-7 pt-8 text-white">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-white/25 blur-md"
              style={{ animation: 'smira-shine 2.2s ease-in-out .5s infinite' }}
            />
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/80">
              Special offer · {show.planLabel} plan
            </p>
            <p
              className="mt-2 text-5xl font-extrabold leading-none drop-shadow"
              style={{ animation: 'smira-pulse 1.6s ease-in-out .6s infinite' }}
            >
              {big(show)}
            </p>
            {show.off > 0 && (
              <p className="mt-2 text-sm font-semibold text-white/90">You save {inr(show.off)} on this plan</p>
            )}
          </div>

          <div className="px-6 pb-6 pt-5">
            <p className="text-sm font-semibold text-ink-700">Use this coupon</p>
            <div className="mt-2 flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-action-500/60 bg-action-500/[0.05] px-4 py-3">
              <Ticket size={18} className="text-action-500" />
              <span className="text-xl font-extrabold tracking-[0.12em] text-ink-900">{show.coupon}</span>
            </div>
            {(show.description || show.maxDiscount > 0 || show.endsOn) && (
              <p className="mt-2 text-[12px] text-ink-500">
                {[
                  show.description,
                  show.maxDiscount > 0 && `Up to ${inr(show.maxDiscount)}`,
                  show.endsOn && `Ends ${new Date(show.endsOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            )}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={copy}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-ink-900/15 px-3 py-2.5 text-sm font-bold text-ink-800 hover:bg-ink-900/[0.03]"
              >
                {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                {copied ? 'Copied' : 'Copy code'}
              </button>
              <button
                type="button"
                onClick={() => {
                  onApply?.(show.coupon);
                  setShow(null);
                }}
                className="rounded-xl bg-action-500 px-3 py-2.5 text-sm font-bold text-white hover:opacity-90"
              >
                Apply coupon
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
