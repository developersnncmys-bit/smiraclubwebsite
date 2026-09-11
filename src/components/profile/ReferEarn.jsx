'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check, Copy, Info, MessageCircle, Share2 } from 'lucide-react';
import { membershipHelp, referral } from '@/lib/content';
import { toSrc } from '@/lib/imageSlot';
import { inr } from '@/lib/format';

/** The notched lavender band the rewards sit on. */
const RIBBON = { clipPath: 'polygon(0 0, 100% 0, 97% 50%, 100% 100%, 0 100%, 3% 50%)' };

/** One person and what they get out of it. */
function Reward({ image, who, amount, art }) {
  return (
    <div className="flex flex-1 flex-col items-center px-3 text-center">
      <span className="relative h-14 w-14 overflow-hidden rounded-full">
        <Image src={toSrc(art || image)} alt="" fill sizes="56px" className="object-cover" />
      </span>
      <p className="mt-2 text-[15px] text-ink-700">{who}</p>
      <p className="text-[16px] font-bold text-ink-900">{inr(amount)} SmiraCash</p>
    </div>
  );
}

/**
 * Refer & Earn.
 *
 * The headline total is added up from the steps rather than written out, so
 * changing what a referral pays cannot leave the promise at the top saying
 * something the steps no longer add to.
 */
export default function ReferEarn({ art = {} }) {
  const [copied, setCopied] = useState(false);

  const perReferral = referral.steps.reduce(
    (sum, step) =>
      sum + (step.single?.amount ?? 0) + (step.split?.[0]?.amount ?? 0),
    0,
  );

  const share = `Join me on Smira Club and we both earn SmiraCash. Use my code ${referral.code}.`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(referral.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the code is on screen to read either way.
    }
  };

  const send = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: referral.title, text: share });
        return;
      } catch {
        // Cancelled or unsupported — fall through to the copy.
      }
    }
    copy();
  };

  return (
    <div className="shell py-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-action-500">{referral.title}</h1>
        <p className="mt-2 text-[17px] text-ink-700">
          Get up to {inr(referral.cap)} in {referral.steps.length} easy steps
        </p>
      </header>

      {referral.steps.map((step) => (
        <section key={step.key} className="mt-10">
          <p className="text-center text-[15px] font-bold uppercase tracking-[0.08em] text-ink-500">
            {step.label}
          </p>
          <h2 className="mt-2 text-center text-xl font-bold leading-snug text-ink-900">
            {step.headline}
          </h2>

          {step.split && (
            <div className="mt-5 flex items-stretch bg-[#eeeafb] py-5" style={RIBBON}>
              <Reward {...step.split[0]} art={art[step.split[0].image]} />
              <span aria-hidden="true" className="w-px border-l border-dashed border-ink-400/50" />
              <Reward {...step.split[1]} art={art[step.split[1].image]} />
            </div>
          )}

          {step.single && (
            <div className="mt-5 flex items-center gap-4 bg-[#eeeafb] px-7 py-5" style={RIBBON}>
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={toSrc(art[step.single.image] || step.single.image)}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </span>
              <p className="min-w-0 text-[16px] leading-snug text-ink-900">
                {step.single.who}
                <br />
                <span className="font-bold">{inr(step.single.amount)} SmiraCash</span>
                <span title={step.single.note} className="ml-1.5 inline-block align-middle">
                  <Info size={15} className="text-ink-500" />
                </span>
              </p>
            </div>
          )}
        </section>
      ))}

      <p className="mt-8 text-center text-[16px] leading-snug text-ink-900">
        <span className="font-bold">NOTE</span> {referral.note}
      </p>
      <p className="mt-1 text-center text-[14px] text-ink-500">
        That is {inr(perReferral)} a referral, up to {inr(referral.cap)}.
      </p>

      <a
        href={`${membershipHelp.whatsapp}?text=${encodeURIComponent(share)}`}
        target="_blank"
        rel="noreferrer"
        className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border-2 border-action-500 px-5 py-4 text-[17px] font-bold uppercase tracking-wide text-ink-900 transition hover:bg-brand-50"
      >
        <MessageCircle size={22} className="text-[#25d366]" fill="currentColor" strokeWidth={0} />
        Refer via WhatsApp
      </a>

      <div className="card mt-4 flex items-center gap-3 p-4 sm:p-5">
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold uppercase tracking-[0.06em] text-ink-600">
            Referral code
          </p>
          <p className="mt-1 text-xl font-bold text-ink-900">{referral.code}</p>
        </div>

        <button
          type="button"
          onClick={copy}
          aria-label="Copy referral code"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-action-500 transition hover:bg-brand-50"
        >
          {copied ? <Check size={21} strokeWidth={3} className="text-green-600" /> : <Copy size={21} />}
        </button>

        <button
          type="button"
          onClick={send}
          aria-label="Share referral code"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-action-500 transition hover:bg-brand-50"
        >
          <Share2 size={21} />
        </button>
      </div>

      {copied && (
        <p className="mt-3 text-center text-[15px] font-semibold text-green-700">
          Code copied.
        </p>
      )}
    </div>
  );
}
