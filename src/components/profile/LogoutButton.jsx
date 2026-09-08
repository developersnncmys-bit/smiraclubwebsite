'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Logging out asks first, because the design puts this at the end of a long
 * scroll where a stray tap is easy. There is no session to clear yet — when
 * auth lands, drop the token clear into `confirmLogout` and nothing else here
 * needs to change.
 */
export default function LogoutButton() {
  const router = useRouter();
  const [asking, setAsking] = useState(false);

  const confirmLogout = () => {
    setAsking(false);
    router.push('/');
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setAsking(true)}
        className="w-full rounded-xl border-2 border-red-500 bg-white px-5 py-3.5 text-[15px] font-bold uppercase tracking-wide text-red-600 transition hover:bg-red-50 active:scale-[0.99]"
      >
        Logout
      </button>

      {asking && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
          className="fixed inset-0 z-50 grid place-items-end sm:place-items-center"
        >
          <div className="absolute inset-0 bg-ink-900/40" onClick={() => setAsking(false)} />

          <div className="relative w-full rounded-t-2xl bg-white p-6 shadow-lift sm:max-w-sm sm:rounded-2xl">
            <h2 id="logout-title" className="text-lg font-bold text-ink-900">
              Log out of Smira Club?
            </h2>
            <p className="mt-2 text-[15px] text-ink-500">
              You will need your phone number to sign back in.
            </p>

            <div className="mt-5 flex gap-3">
              <button type="button" onClick={() => setAsking(false)} className="btn-quiet flex-1">
                Stay
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="btn flex-1 bg-red-600 text-white hover:bg-red-700"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
