'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/Icon';
import { primaryNav } from '@/lib/content';
import { isMember, useMembership } from '@/lib/membership';
import { useProfile } from '@/lib/profile';
import { OPEN_AUTH } from '@/components/auth/AuthPopup';

/**
 * Screens that pin their own price bar to the bottom: a property's page and
 * Review Booking. The design gives those the bottom edge outright, and it is
 * right to — two stacked bars is one too many, and the tab bar undercuts the
 * one action the screen is asking for.
 */
const OWNS_THE_BOTTOM = [
  /^\/(hotels|villas)\/(?!hourly$)[^/]+(\/book)?$/,
  // An hourly hotel and its Review Booking; the hourly list keeps the tabs.
  /^\/hotels\/hourly\/[^/]+(\/book)?$/,
  // A free stay hotel and its Review Booking; the free stay list keeps the tabs.
  /^\/free-stay\/(?!results$)[^/]+(\/book)?$/,
  // Detail pages that pin Book Ticket / Book a Table / Book Tickets. A game
  // zone and a package pin one too, so the tabs would sit over the button.
  /^\/(parks|restaurants|activities|spa|luxury|group-departures|games|packages)\/(?!international$)[^/]+(\/book)?$/,
  /^\/profile\/edit$/,
  /^\/membership$/,
];

/** The phone's tab bar. It leaves the page entirely on a desktop. */
export default function BottomNav() {
  const pathname = usePathname();
  // Account is the way in until somebody is signed in, and the way to their
  // own screens after — the same as Log in / My account on a desktop. Read
  // before the early return, because hooks cannot be skipped.
  const { profile } = useProfile();
  const { membership } = useMembership();
  const signedIn = Boolean(profile?.details?.name?.trim() || isMember(membership));
  const asAccount = (item) =>
    item.key === 'account' && !signedIn ? { ...item, label: 'Log in', href: '/login' } : item;

  if (OWNS_THE_BOTTOM.some((route) => route.test(pathname))) return null;

  // The longest matching path wins, so My Booking (/profile/bookings) lights
  // on its own rather than alongside Account (/profile).
  const activeKey = primaryNav
    .flatMap((item) => [item.href, ...(item.also || [])].map((href) => ({ key: item.key, href })))
    .filter(({ href }) => (href === '/' ? pathname === '/' : pathname.startsWith(href)))
    .sort((a, b) => b.href.length - a.href.length)[0]?.key;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-surface-line bg-white shadow-nav lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Main"
    >
      <ul className="mx-auto flex max-w-phone items-stretch">
        {primaryNav.map(asAccount).map((item) => {
          const active = item.key === activeKey;
          if (item.center) {
            // AI Search: a raised round button in the middle of the bar.
            return (
              <li key={item.key} className="flex flex-1 justify-center">
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className="-mt-5 flex flex-col items-center gap-1 whitespace-nowrap text-[10px] font-semibold min-[400px]:text-[11px]"
                >
                  <span
                    className={`grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-action-500 to-brand-700 text-white shadow-lift ring-4 ring-white transition active:scale-95 ${
                      active ? 'brightness-110' : ''
                    }`}
                  >
                    <Icon name={item.icon} size={24} strokeWidth={2.2} />
                  </span>
                  <span className={active ? 'text-action-500' : 'text-ink-700'}>{item.label}</span>
                </Link>
              </li>
            );
          }
          const face = (
            <>
              <Icon name={item.icon} size={22} strokeWidth={active ? 2.4 : 2} />
              {item.label}
            </>
          );
          const look = `flex w-full flex-col items-center gap-1 whitespace-nowrap py-2.5 text-[10px] font-semibold transition min-[400px]:text-[11px] ${
            active ? 'text-action-500' : 'text-ink-500'
          }`;

          // Signed out, Account is Log in — and that opens the sheet rather
          // than taking the visitor away from what they were reading.
          return (
            <li key={item.key} className="flex-1">
              {item.key === 'account' && !signedIn ? (
                <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_AUTH))} className={look}>
                  {face}
                </button>
              ) : (
                <Link href={item.href} aria-current={active ? 'page' : undefined} className={look}>
                  {face}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
