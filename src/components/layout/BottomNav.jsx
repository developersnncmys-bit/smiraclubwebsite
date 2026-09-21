'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/Icon';
import { primaryNav } from '@/lib/content';

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
  // Detail pages that pin Book Ticket / Book a Table / Book Tickets.
  /^\/(parks|restaurants|activities|spa|luxury|group-departures)\/[^/]+(\/book)?$/,
  /^\/profile\/edit$/,
  /^\/membership$/,
];

/** The phone's tab bar. It leaves the page entirely on a desktop. */
export default function BottomNav() {
  const pathname = usePathname();

  if (OWNS_THE_BOTTOM.some((route) => route.test(pathname))) return null;

  // The longest matching href wins, so My Booking (/profile/bookings) lights
  // on its own rather than alongside Profile (/profile).
  const activeKey = primaryNav
    .filter((item) => (item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)))
    .sort((a, b) => b.href.length - a.href.length)[0]?.key;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-surface-line bg-white shadow-nav lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Main"
    >
      <ul className="mx-auto flex max-w-phone items-stretch">
        {primaryNav.map((item) => {
          const active = item.key === activeKey;
          return (
            <li key={item.key} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`flex flex-col items-center gap-1 whitespace-nowrap py-2.5 text-[10px] font-semibold transition min-[400px]:text-[11px] ${
                  active ? 'text-action-500' : 'text-ink-500'
                }`}
              >
                <Icon name={item.icon} size={22} strokeWidth={active ? 2.4 : 2} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
