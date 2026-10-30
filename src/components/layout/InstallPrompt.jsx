'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Download, Share, X } from 'lucide-react';

const DISMISS_KEY = 'smira:install-dismissed';
const QUIET_DAYS = 14;
const FIRST_DELAY_MS = 6000;

/** Already running as the installed app — nothing to offer. */
const installed = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;

/** iPhone and iPad Safari, which has no install prompt to call. */
const isIOS = () =>
  /iphone|ipad|ipod/i.test(window.navigator.userAgent) ||
  (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);

const dismissedRecently = () => {
  try {
    const at = Number(window.localStorage.getItem(DISMISS_KEY) || 0);
    return at && Date.now() - at < QUIET_DAYS * 86400000;
  } catch {
    return false;
  }
};

/**
 * "Install Smira Club" — offered to anyone who comes to the website.
 *
 * On Chrome and Android the browser hands over its own install prompt, and
 * the Install button opens it. Safari on an iPhone has no such prompt, so
 * it says the two taps that do the same. It waits until the visitor has had
 * a moment on the page and no other dialog (the sign-in sheet) is open, and
 * once closed it stays away for two weeks.
 */
export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('prompt'); // 'prompt' | 'ios' | 'menu'
  const deferred = useRef(null);

  useEffect(() => {
    if (installed() || dismissedRecently()) return undefined;

    const onPrompt = (e) => {
      // Keep the browser's prompt for our button instead of its own mini-bar.
      e.preventDefault();
      deferred.current = e;
      setMode('prompt');
    };
    const onInstalled = () => setShow(false);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);

    // After a moment, and only once no dialog is in the way.
    let timer = setTimeout(function tryShow() {
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) {
        timer = setTimeout(tryShow, 3000);
        return;
      }
      if (!deferred.current) setMode(isIOS() ? 'ios' : 'menu');
      setShow(true);
    }, FIRST_DELAY_MS);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const close = () => {
    setShow(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* storage blocked: it simply asks again next visit */
    }
  };

  const install = async () => {
    const e = deferred.current;
    if (!e) return;
    e.prompt();
    const choice = await e.userChoice.catch(() => null);
    deferred.current = null;
    if (choice?.outcome === 'accepted') setShow(false);
    else close();
  };

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Install Smira Club"
      className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+5.25rem)] z-[45] mx-auto max-w-md rounded-2xl border border-surface-line bg-white p-3.5 shadow-lift lg:inset-x-auto lg:bottom-6 lg:left-6"
    >
      <div className="flex items-start gap-3">
        <Image src="/icons/icon-192.png" alt="" width={44} height={44} className="h-11 w-11 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-bold text-ink-900">Install the Smira Club app</p>
          <p className="mt-0.5 text-[12.5px] leading-snug text-ink-600">
            {mode === 'ios' ? (
              <>
                Tap <Share size={13} className="mx-0.5 inline align-[-2px]" /> <b>Share</b> below, then{' '}
                <b>Add to Home Screen</b>.
              </>
            ) : mode === 'menu' ? (
              <>Open your browser menu <b>⋮</b> and choose <b>Install app</b> or <b>Add to Home screen</b>.</>
            ) : (
              'Free stays, bookings and offers — one tap from your home screen.'
            )}
          </p>
        </div>
        <button type="button" onClick={close} className="-mr-1 -mt-1 p-1 text-ink-400 hover:text-ink-700" aria-label="Not now">
          <X size={18} />
        </button>
      </div>

      {mode === 'prompt' && (
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={install} className="btn-primary flex-1 justify-center py-2.5 text-[13px]">
            <Download size={15} /> Install
          </button>
          <button type="button" onClick={close} className="btn-quiet px-4 py-2.5 text-[13px]">
            Not now
          </button>
        </div>
      )}
    </div>
  );
}
