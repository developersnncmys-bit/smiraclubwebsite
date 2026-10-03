'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AuthFlow from '@/components/auth/AuthFlow';

/**
 * The same way in, on a page of its own, for a link sent straight to it.
 *
 * It is the sheet's form in a card — one form for signing in and for opening
 * an account, finishing here either way. Afterwards they carry on wherever
 * they were headed, never onto a profile screen to fill in.
 */
export default function MemberLogin() {
  const [next, setNext] = useState('/');

  // Where to go afterwards — the page that sent them here, if any.
  useEffect(() => {
    const to = new URLSearchParams(window.location.search).get('next') || '';
    if (to.startsWith('/') && !to.startsWith('//')) setNext(to);
  }, []);

  return (
    <div className="shell py-8 lg:py-14">
      <div className="mx-auto w-full max-w-md">
        <div className="card p-5 sm:p-6">
          <AuthFlow
            autoFocus
            // A full load, so the header and every members-only door read the
            // new session.
            onDone={() => window.location.assign(next)}
            footer={
              <p className="mt-4 text-center text-[14px] text-ink-500">
                New to Smira Club?{' '}
                <Link href="/membership" className="font-semibold text-action-500">
                  Explore membership plans
                </Link>
              </p>
            }
          />
        </div>
      </div>
    </div>
  );
}
