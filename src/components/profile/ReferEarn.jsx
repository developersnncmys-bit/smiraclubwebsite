'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Check, Copy, Info, MessageCircle, Share2 } from 'lucide-react';
import { membershipHelp, referral } from '@/lib/content';
import { toSrc } from '@/lib/imageSlot';
import { inr } from '@/lib/format';
import { api } from '@/lib/api';
import { getSessionToken } from '@/lib/session';

/** Where a referral has got to, and what to call it. */
const STAGE = {
  Enquiry: { label: 'Referred', tone: 'bg-[#eef1f5] text-ink-600' },
  Qualified: { label: 'Interested', tone: 'bg-[#fdf3dd] text-[#a97810]' },
  Booked: { label: 'Booked', tone: 'bg-[#e8f6ec] text-green-700' },
  Member: { label: 'Joined', tone: 'bg-[#e8f6ec] text-green-700' },
  Lost: { label: 'Did not go ahead', tone: 'bg-[#fdecea] text-red-600' },
};

/** The notched lavender band the rewards sit on. */
const RIBBON = { clipPath: 'polygon(0 0, 100% 0, 97% 50%, 100% 100%, 0 100%, 3% 50%)' };

/** One person and what they get out of it. */
function Reward({ image, who, amount, art }) {
  return (
    <div className="flex flex-1 flex-col items-center px-3 text-center">
      <span className="relative h-14 w-14 overflow-hidden rounded-full">
        <Image src={toSrc(art || image)} alt="" fill sizes="56px" className="object-cover" />
      </span>
      <p className="mt-2 text-[14px] text-ink-700">{who}</p>
      <p className="text-[15px] font-bold text-ink-900">{inr(amount)} SmiraCash</p>
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

  /**
   * The member's own code, and who they have referred.
   *
   * There was one code written into the site, the same one for
   * everybody, so a referral could not be attributed to the person who
   * made it — which is the entire point of the screen. The code is now
   * theirs, made once and kept on their record.
   */
  const [mine, setMine] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sending, setSending] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    const token = getSessionToken();
    if (!token) return undefined;
    let live = true;
    api
      .memberReferrals(token)
      .then((res) => live && setMine(res.data || null))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  const code = mine?.code || '';

  const refer = async (e) => {
    e.preventDefault();
    const token = getSessionToken();
    if (!token || sending) return;
    setSending(true);
    setNote('');
    try {
      const res = await api.referSomeone(token, { name: name.trim(), phone: phone.trim() });
      setNote(res.message || 'Referred — our desk will call them');
      setName('');
      setPhone('');
      const fresh = await api.memberReferrals(token);
      setMine(fresh.data || null);
    } catch (err) {
      setNote(err?.message || 'We could not send that just now. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const perReferral = referral.steps.reduce(
    (sum, step) =>
      sum + (step.single?.amount ?? 0) + (step.split?.[0]?.amount ?? 0),
    0,
  );

  const share = code
    ? `Join me on Smira Club and we both earn SmiraCash. Use my code ${code}.`
    : 'Join me on Smira Club and we both earn SmiraCash.';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
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
        <p className="mt-2 text-[15px] text-ink-700">
          Get up to {inr(referral.cap)} in {referral.steps.length} easy steps
        </p>
      </header>

      {referral.steps.map((step) => (
        <section key={step.key} className="mt-10">
          <p className="text-center text-[14px] font-bold uppercase tracking-[0.08em] text-ink-500">
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
              <p className="min-w-0 text-[15px] leading-snug text-ink-900">
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

      <p className="mt-8 text-center text-[15px] leading-snug text-ink-900">
        <span className="font-bold">NOTE</span> {referral.note}
      </p>
      <p className="mt-1 text-center text-[13px] text-ink-500">
        That is {inr(perReferral)} a referral, up to {inr(referral.cap)}.
      </p>

      <a
        href={`${membershipHelp.whatsapp}?text=${encodeURIComponent(share)}`}
        target="_blank"
        rel="noreferrer"
        className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border-2 border-action-500 px-5 py-4 text-[15px] font-bold uppercase tracking-wide text-ink-900 transition hover:bg-brand-50"
      >
        <MessageCircle size={22} className="text-[#25d366]" fill="currentColor" strokeWidth={0} />
        Refer via WhatsApp
      </a>

      <div className="card mt-4 flex items-center gap-3 p-4 sm:p-5">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-ink-600">
            Referral code
          </p>
          <p className="mt-1 text-xl font-bold text-ink-900">
            {code || <span className="text-[15px] font-semibold text-ink-500">Sign in to get yours</span>}
          </p>
        </div>

        {code && (
          <>
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
          </>
        )}
      </div>

      {/* -- Referring somebody by hand, rather than hoping they type a code -- */}
      {code && (
        <form onSubmit={refer} className="card mt-4 p-4 sm:p-5">
          <p className="text-[15px] font-bold text-ink-900">Refer someone directly</p>
          <p className="mt-1 text-[13px] text-ink-600">
            Give us their name and number and our desk will call them.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Their name"
              aria-label="Their name"
              className="w-full min-w-0 rounded-xl border border-surface-line px-4 py-3.5 text-[14px] outline-none placeholder:text-ink-400 focus:border-action-500"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Their mobile number"
              aria-label="Their mobile number"
              inputMode="numeric"
              className="w-full min-w-0 rounded-xl border border-surface-line px-4 py-3.5 text-[14px] outline-none placeholder:text-ink-400 focus:border-action-500"
            />
          </div>
          <button
            type="submit"
            disabled={sending || !name.trim() || !phone.trim()}
            className="btn-primary mt-3 w-full rounded-xl py-3.5 text-[14px] uppercase tracking-wide disabled:opacity-60"
          >
            {sending ? 'Sending…' : 'Refer them'}
          </button>
          {note && <p className="mt-3 text-center text-[14px] font-semibold text-ink-700">{note}</p>}
        </form>
      )}

      {/* -- What they have referred, and what it has earned ----------------- */}
      {mine?.referrals?.length > 0 && (
        <div className="card mt-4 p-4 sm:p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-[15px] font-bold text-ink-900">Your referrals</p>
            <p className="text-[13px] text-ink-600">
              <b className="text-green-700">{inr(mine.earned)}</b> earned
              {mine.pending > 0 && <> · {inr(mine.pending)} on the way</>}
            </p>
          </div>
          <ul className="mt-3 divide-y divide-surface-line">
            {mine.referrals.map((r) => {
              const stage = STAGE[r.status] || STAGE.Enquiry;
              return (
                <li key={r.id} className="flex items-center gap-3 py-3">
                  <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-ink-900">{r.name}</span>
                  {r.reward > 0 && (
                    <span className="shrink-0 text-[13px] font-bold text-ink-700">
                      {inr(r.reward)}
                      {r.paid ? '' : ' pending'}
                    </span>
                  )}
                  <span className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-bold ${stage.tone}`}>
                    {stage.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {copied && (
        <p className="mt-3 text-center text-[14px] font-semibold text-green-700">
          Code copied.
        </p>
      )}
    </div>
  );
}
