'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Info, TriangleAlert, X } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import { deactivateAccount as copy, membershipHelp } from '@/lib/content';

/** The recovery window, written into the copy wherever it is mentioned. */
const withDays = (text) => text.replaceAll('{days}', copy.recoveryDays);

/**
 * Deactivate Account.
 *
 * Deactivating is reversible for a window and then is not, so the screen
 * spells out what stops working before the button, and the button asks once
 * more. Nothing here is one click away from irreversible.
 *
 * There is no account system yet, so confirming says so rather than
 * pretending the account went anywhere.
 */
export default function DeactivateAccount() {
  const router = useRouter();
  const [asking, setAsking] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <div className="shell py-6">
      <h1 className="text-2xl font-bold text-brand-700">{copy.title}</h1>
      <p className="mt-3 text-[16px] leading-relaxed text-ink-700">{copy.lead}</p>

      {/* -- What stops working ------------------------------------- */}
      <ul className="mt-7 space-y-5">
        {copy.losing.map((item) => (
          <li key={item.key} className="flex items-center gap-4">
            <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50">
              <Icon name={item.icon} size={22} className="text-brand-700" strokeWidth={1.8} />
              <span className="absolute -bottom-1 -right-1 grid h-[18px] w-[18px] place-items-center rounded-full bg-action-500 text-white ring-2 ring-white">
                <X size={11} strokeWidth={3.5} />
              </span>
            </span>
            <span className="text-[16px] font-bold leading-snug text-ink-900">{item.label}</span>
          </li>
        ))}
      </ul>

      {/* -- What happens, and for how long ------------------------- */}
      <p className="mt-8 flex gap-3 rounded-xl bg-[#eaf1fe] p-4 text-[16px] leading-relaxed text-brand-700">
        <Info size={20} className="mt-0.5 shrink-0 text-action-500" />
        {withDays(copy.note)}
      </p>

      <div className="mt-4 flex gap-3 rounded-xl bg-[#fdf1e7] p-4">
        <TriangleAlert size={20} className="mt-0.5 shrink-0 text-[#d1541b]" />
        <div>
          <p className="text-[16px] font-bold text-[#d1541b]">{withDays(copy.warning.title)}</p>
          <p className="mt-1 text-[15px] leading-relaxed text-ink-700">
            {withDays(copy.warning.body)}
          </p>
        </div>
      </div>

      {/* -- The decision ------------------------------------------- */}
      {done ? (
        <p className="mt-10 rounded-xl bg-[#e8f6ec] p-5 text-[15px] leading-relaxed text-green-700">
          Accounts are not connected to a backend yet, so nothing has changed. To deactivate for
          real, contact the desk on{' '}
          <a href={`tel:${membershipHelp.phone.replace(/\s/g, '')}`} className="font-bold underline">
            {membershipHelp.phone}
          </a>{' '}
          and they will take it from there.
        </p>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setAsking(true)}
            className="btn-primary mt-10 w-full rounded-xl py-4 text-[17px]"
          >
            {copy.confirm}
          </button>

          <button
            type="button"
            onClick={() => router.push('/profile')}
            className="mt-5 block w-full text-center text-[16px] font-bold text-action-500"
          >
            {copy.cancel}
          </button>
        </>
      )}

      {asking && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="deactivate-title"
          className="fixed inset-0 z-50 grid place-items-end sm:place-items-center"
        >
          <div className="absolute inset-0 bg-ink-900/40" onClick={() => setAsking(false)} />

          <div className="relative w-full rounded-t-2xl bg-white p-6 shadow-lift sm:max-w-sm sm:rounded-2xl">
            <h2 id="deactivate-title" className="text-lg font-bold text-ink-900">
              Deactivate your account?
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
              You have {copy.recoveryDays} days to change your mind — just log in again. After that
              your account and data are deleted for good.
            </p>

            <div className="mt-5 flex gap-3">
              <button type="button" onClick={() => setAsking(false)} className="btn-quiet flex-1">
                Keep account
              </button>
              <button
                type="button"
                onClick={() => {
                  setAsking(false);
                  setDone(true);
                }}
                className="btn flex-1 bg-red-600 text-white hover:bg-red-700"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
