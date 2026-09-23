'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Crown, Phone, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';
import { loadProfile, saveProfile } from '@/lib/profile';
import { saveMembership } from '@/lib/membership';
import { setSessionToken } from '@/lib/session';

/**
 * Signing in with a mobile number and the code sent to it.
 *
 * There is no password: the desk knows members by their number, so the code
 * proves the number and the answer brings back what the desk holds — their
 * details and their membership — onto whatever phone or computer they are on.
 * A number the desk has never seen signs in too, with the profile to fill in.
 */

/** The desk's fields laid onto the shape Complete Your Profile saves. */
function profileFrom(member, existing) {
  const day = (v) => (v ? String(v).slice(0, 10) : '');
  const [line1 = '', ...rest] = String(member.address || '').split(',').map((s) => s.trim());
  return {
    ...(existing || {}),
    details: { name: member.name || '', email: member.email || '', phone: member.phone || '' },
    birthdays: member.dob
      ? [{ name: member.name || 'Me', dob: day(member.dob), relationship: 'Self' }]
      : existing?.birthdays || [{ name: '', dob: '', relationship: '' }],
    anniversary: member.anniversary ? { date: day(member.anniversary), years: '' } : existing?.anniversary || { date: '', years: '' },
    address: {
      ...(existing?.address || { line1: '', line2: '', city: '', state: 'Karnataka', pincode: '', useForAll: true }),
      ...(line1 ? { line1, line2: rest.join(', ') } : {}),
      ...(member.city ? { city: member.city } : {}),
    },
  };
}

export default function MemberLogin() {
  const router = useRouter();
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [demoCode, setDemoCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState('');
  const [next, setNext] = useState('/profile');
  const codeBox = useRef(null);

  // Where to go afterwards — the page that sent them here, if any.
  useEffect(() => {
    const to = new URLSearchParams(window.location.search).get('next') || '';
    if (to.startsWith('/') && !to.startsWith('//')) setNext(to);
  }, []);

  useEffect(() => {
    if (step === 'code') codeBox.current?.focus();
  }, [step]);

  const askForCode = async (e) => {
    e?.preventDefault();
    if (busy) return;
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, '').slice(-10))) {
      return setFailed('Enter your 10-digit mobile number.');
    }
    setBusy(true);
    setFailed('');
    try {
      const res = await api.memberOtpRequest(phone);
      setDemoCode(res.data?.devCode || '');
      setStep('code');
    } catch (err) {
      setFailed(err?.status ? err.message : 'We could not reach Smira just now. Please try again in a moment.');
    }
    setBusy(false);
  };

  const signIn = async (e) => {
    e?.preventDefault();
    if (busy) return;
    if (code.replace(/\D/g, '').length !== 6) return setFailed('Enter the 6-digit code.');
    setBusy(true);
    setFailed('');
    try {
      const res = await api.memberVerify(phone, code);
      const { member, membership, token } = res.data || {};
      // The token is what later lets the site ask for their own bookings.
      setSessionToken(token || '');
      saveProfile(profileFrom(member || {}, loadProfile()));
      if (membership) {
        saveMembership({
          plan: membership.plan,
          reference: membership.reference,
          since: new Date().toISOString(),
          expiresOn: membership.expiresOn,
          status: membership.status,
        });
      }
      // A full load, so the header and every members-only door read the new session.
      window.location.assign(res.data?.isNew || !member?.name ? '/profile/edit' : next);
    } catch (err) {
      setBusy(false);
      setFailed(err?.status ? err.message : 'We could not reach Smira just now. Please try again in a moment.');
    }
  };

  return (
    <div className="shell py-8 lg:py-14">
      <div className="mx-auto w-full max-w-md">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-50">
          <Crown size={26} className="text-action-500" />
        </span>
        <h1 className="mt-4 text-center text-2xl font-bold text-ink-900">Log in to Smira Club</h1>
        <p className="mt-2 text-center text-[14px] text-ink-500">
          {step === 'phone'
            ? 'Your mobile number is your account. We will send a code to confirm it.'
            : `Enter the 6-digit code we sent to ${phone}.`}
        </p>

        <form onSubmit={step === 'phone' ? askForCode : signIn} className="card mt-6 space-y-4 p-5 sm:p-6">
          {step === 'phone' ? (
            <label className="block">
              <span className="text-[14px] font-semibold text-ink-900">Mobile number</span>
              <span className="relative mt-2 block">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your mobile number"
                  className="w-full rounded-xl border border-surface-line bg-white py-3.5 pl-11 pr-4 text-[15px] text-ink-900 outline-none transition focus:border-action-500"
                />
              </span>
            </label>
          ) : (
            <>
              <label className="block">
                <span className="text-[14px] font-semibold text-ink-900">Verification code</span>
                <input
                  ref={codeBox}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="6-digit code"
                  className="mt-2 w-full rounded-xl border border-surface-line bg-white px-4 py-3.5 text-center text-[20px] font-bold tracking-[0.4em] text-ink-900 outline-none transition focus:border-action-500"
                />
              </label>

              {demoCode && (
                <p className="rounded-xl bg-brand-50 px-4 py-3 text-center text-[13px] font-semibold text-brand-700">
                  Demo code: {demoCode} — texting is not wired up yet
                </p>
              )}

              <div className="flex items-center justify-between text-[13px]">
                <button type="button" onClick={() => { setStep('phone'); setCode(''); setFailed(''); }} className="font-semibold text-ink-500">
                  Change number
                </button>
                <button type="button" onClick={askForCode} disabled={busy} className="font-semibold text-action-500 disabled:opacity-50">
                  Send again
                </button>
              </div>
            </>
          )}

          {failed && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600">{failed}</p>}

          <button type="submit" disabled={busy} className="btn-primary w-full gap-2 rounded-xl py-3.5 text-[15px] normal-case tracking-normal disabled:opacity-60">
            {busy ? 'Please wait…' : step === 'phone' ? 'Send code' : 'Log in'}
            {!busy && <ArrowRight size={17} />}
          </button>

          <p className="flex items-center justify-center gap-2 text-[12px] text-ink-500">
            <ShieldCheck size={14} className="text-green-600" />
            We only use your number to find your bookings and membership.
          </p>
        </form>

        <p className="mt-5 text-center text-[14px] text-ink-500">
          New to Smira Club?{' '}
          <Link href="/membership" className="font-semibold text-action-500">
            Explore membership plans
          </Link>
        </p>
      </div>
    </div>
  );
}
