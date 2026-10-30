'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { isMember, useMembership } from '@/lib/membership';
import { useProfile } from '@/lib/profile';
import ProfileDot from '@/components/layout/ProfileDot';
import HeaderSearch, { HeaderSearchBox } from '@/components/layout/HeaderSearch';
import { api } from '@/lib/api';
import { getSessionToken } from '@/lib/session';

/**
 * One header, two shapes.
 *
 * The mark, and the few things you reach from anywhere. The category links
 * and the city picker used to live here and no longer do: the four tabs over
 * the search panel already carry the categories, and More carries the rest,
 * so a second set of links along the top was only saying the same thing
 * twice.
 */
export default function Header() {

  /**
   * How many notifications they have not seen.
   *
   * The badge said 1, to everybody, for ever — including people with
   * nothing waiting and people with six things waiting. Nought hides it.
   */
  const [unread, setUnread] = useState(0);
  useEffect(() => {
    const token = getSessionToken();
    if (!token) return undefined;
    let live = true;
    api
      .memberNotifications(token)
      .then((res) => live && setUnread(Number(res.unread || 0)))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);
  /**
   * The badge: the member's own tier, where they hold one; where they
   * have asked for one and not paid, that, said plainly; otherwise the
   * way to become one. It used to read "<Plan> Member" the moment the
   * payment sheet had been opened, which is not the same thing at all.
   */
  const { membership } = useMembership();
  /**
   * Two states, not three.
   *
   * There was a Payment pending badge between them, which is the desk's
   * word for a membership it has not been paid for — true, and not what
   * a member wants read back to them at the top of every page. Until the
   * money is in they are not a member yet, so the badge says the thing
   * that is both accurate and worth tapping.
   */
  const memberBadge = isMember(membership)
    ? { label: `${membership.plan} Member`, href: '/membership' }
    : { label: 'Become Member', href: '/membership' };
  const { profile } = useProfile();

  return (
    <header className="sticky top-0 z-40 border-b border-surface-line bg-white/95 backdrop-blur pt-safe">
      {/* A slim bar: the mark sits nearer the edge and the row is shorter,
          so the page underneath starts higher up. */}
      <div className="shell px-3 lg:px-5">
        {/*
          -- Phone ------------------------------------------------------
          The mark on the left, a size larger; on the right search (and the
          bell when it has something), then Become Member, and the profile
          in the corner — the order a member's eye runs along the top.
        */}
        <div className="relative flex h-14 items-center justify-between gap-2 lg:hidden">
          <Logo compact />

          <div className="flex items-center gap-2">
            {/* The page's own search, on the pages that have one. */}
            <HeaderSearch />

            {/*
              The bell only when it has something to ring about. An icon
              that is always there and never has anything behind it is a
              button people learn to stop pressing.
            */}
            {unread > 0 && (
              <Link href="/notifications" className="relative p-1.5" aria-label={`Notifications (${unread} unread)`}>
                <Bell size={21} className="text-ink-700" />
                <span className="absolute right-0.5 top-0.5 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unread > 9 ? '9+' : unread}
                </span>
              </Link>
            )}

            <Link
              href={memberBadge.href}
              className="whitespace-nowrap rounded-full bg-gradient-to-r from-[#d8a41f] to-[#b8860b] px-2.5 py-1 text-[11px] font-bold leading-tight text-white shadow-sm transition hover:brightness-105"
            >
              {memberBadge.label}
            </Link>

            {/* Who you are, and how much of that this site knows — in the corner. */}
            <ProfileDot profile={profile} />
          </div>
        </div>

        {/* -- Desktop: the same order, with room to breathe. -------------- */}
        <div className="hidden h-16 items-center lg:flex">
          <Logo />

          <div className="ml-auto flex items-center gap-3">
            <HeaderSearch desktop />

            {unread > 0 && (
              <Link
                href="/notifications"
                className="relative grid h-10 w-10 place-items-center rounded-full border border-surface-line text-ink-600 transition hover:bg-surface-soft"
                aria-label={`Notifications (${unread} unread)`}
              >
                <Bell size={18} />
                <span className="absolute right-1.5 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unread > 9 ? '9+' : unread}
                </span>
              </Link>
            )}

            <Link
              href={memberBadge.href}
              className="whitespace-nowrap rounded-full bg-gradient-to-r from-[#d8a41f] to-[#b8860b] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:brightness-105"
            >
              {memberBadge.label}
            </Link>

            {/*
              The profile is the way into the account, signed in or not, so
              it takes the corner; the separate Account button beside it said
              the same thing twice.
            */}
            <ProfileDot profile={profile} size={40} />
          </div>
        </div>
      </div>

      {/* Where, when and how many — opened by either icon, drawn once. */}
      <HeaderSearchBox />
    </header>
  );
}
