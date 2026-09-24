'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import Portal from '@/components/ui/Portal';
import AuthFlow from '@/components/auth/AuthFlow';
import { isComplete, loadProfile } from '@/lib/profile';
import { isMember, loadMembership } from '@/lib/membership';

/**
 * The way in, over whatever page they are on.
 *
 * The sheet only holds the form — AuthFlow is the form itself, shared with
 * the /login page — so signing in never takes anybody off the page they were
 * reading, and somebody new finishes signing up in here too.
 *
 * Opens on its own once on the home page for anybody signed out, and from Log
 * in anywhere else:
 *   window.dispatchEvent(new Event(OPEN_AUTH))
 */

export const OPEN_AUTH = 'smira:auth';
const DISMISSED = 'smira:auth-dismissed';

export default function AuthPopup() {
  const [open, setOpen] = useState(false);
  const panel = useRef(null);

  const close = useCallback(() => {
    setOpen(false);
    try {
      window.sessionStorage.setItem(DISMISSED, '1');
    } catch {
      /* storage blocked — it may ask again on the next page */
    }
  }, []);

  // Asked for from the header, the tab bar, or the account card. Log in and
  // Register both land on the same form, so there is nothing to tell apart.
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(OPEN_AUTH, show);
    return () => window.removeEventListener(OPEN_AUTH, show);
  }, []);

  /** Once a visit, on the home page, and never to somebody already signed in. */
  useEffect(() => {
    if (window.location.pathname !== '/') return undefined;
    let dismissed = false;
    try {
      dismissed = window.sessionStorage.getItem(DISMISSED) === '1';
    } catch {
      dismissed = false;
    }
    if (dismissed || isComplete(loadProfile()) || isMember(loadMembership())) return undefined;
    const timer = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Escape closes it, and the page behind it stays still.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[60] flex items-end justify-center bg-ink-900/50 sm:items-center sm:p-6"
        onMouseDown={(e) => {
          if (!panel.current?.contains(e.target)) close();
        }}
      >
        <div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Log in or create your account"
          className="flex max-h-[92vh] w-full max-w-phone flex-col overflow-hidden rounded-t-2xl bg-white shadow-lift sm:rounded-2xl"
        >
          <header className="flex shrink-0 justify-end px-3 pt-3">
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="grid h-9 w-9 place-items-center rounded-lg text-ink-500 transition hover:bg-surface-soft"
            >
              <X size={20} />
            </button>
          </header>

          <div className="overflow-y-auto px-5 pb-6 pt-1">
            <AuthFlow
              onDone={() => window.location.reload()}
              footer={
                <p className="mt-3 text-center text-[13px] text-ink-500">
                  Browsing for now?{' '}
                  <button type="button" onClick={close} className="font-semibold text-action-500">
                    Keep looking around
                  </button>
                  {' · '}
                  <Link href="/membership" onClick={close} className="font-semibold text-action-500">
                    Membership plans
                  </Link>
                </p>
              }
            />
          </div>
        </div>
      </div>
    </Portal>
  );
}
