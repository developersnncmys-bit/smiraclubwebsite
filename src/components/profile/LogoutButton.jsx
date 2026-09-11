'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

/**
 * Logging out asks first, because the design puts this at the end of a long
 * scroll where a stray tap is easy.
 *
 * Cancel is the filled button and Yes, Log Out the outlined one — the design
 * has it that way round, and it is right to: the safe choice should be the
 * one your thumb lands on.
 *
 * There is no session to clear yet. When auth lands, drop the token clear
 * into `confirmLogout` and nothing else here needs to change.
 */
export default function LogoutButton() {
  const router = useRouter();
  const [asking, setAsking] = useState(false);

  const close = () => setAsking(false);

  const confirmLogout = () => {
    close();
    router.push('/');
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setAsking(true)}
        className="w-full rounded-xl border-2 border-red-500 bg-white px-5 py-3.5 text-[14px] font-bold uppercase tracking-wide text-red-600 transition hover:bg-red-50 active:scale-[0.99]"
      >
        Logout
      </button>

      {asking && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
          className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center"
        >
          <div className="absolute inset-0 bg-ink-900/45" onClick={close} />

          {/* The round close button the design floats above the sheet. */}
          <div className="relative flex justify-center pb-4">
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="grid h-12 w-12 place-items-center rounded-full bg-white text-ink-900 shadow-lift transition hover:bg-surface-soft"
            >
              <X size={22} />
            </button>
          </div>

          <div className="relative w-full overflow-hidden rounded-t-2xl bg-white sm:mx-auto sm:max-w-md sm:rounded-2xl">
            <h2
              id="logout-title"
              className="px-6 py-7 text-[17px] font-bold leading-snug text-ink-900"
            >
              Are You Sure You Want To Log Out?
            </h2>

            <div
              className="flex gap-4 border-t border-surface-line p-5"
              style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
            >
              <button
                type="button"
                onClick={close}
                className="flex-1 rounded-xl bg-brand-700 py-4 text-[15px] font-bold text-white transition hover:bg-brand-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmLogout}
                className="flex-1 rounded-xl border-2 border-action-500 bg-white py-4 text-[15px] font-bold text-action-500 transition hover:bg-brand-50"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
