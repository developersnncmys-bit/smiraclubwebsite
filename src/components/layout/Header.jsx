'use client';

import Link from 'next/link';
import { Bell } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { isMember, useMembership } from '@/lib/membership';
import { useProfile } from '@/lib/profile';
import ProfileDot from '@/components/layout/ProfileDot';

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
    : { label: 'Become a Member', href: '/membership' };
  const { profile } = useProfile();

  return (
    <header className="sticky top-0 z-40 border-b border-surface-line bg-white/95 backdrop-blur pt-safe">
      {/* A slim bar: the mark sits nearer the edge and the row is shorter,
          so the page underneath starts higher up. */}
      <div className="shell px-3 lg:px-5">
        {/* -- Phone ------------------------------------------------------ */}
        <div className="relative flex h-12 items-center justify-between lg:hidden">
          <Logo compact />

          <div className="flex items-center gap-2">
            <Link
              href={memberBadge.href}
              className="rounded-full bg-gradient-to-r from-[#d8a41f] to-[#b8860b] px-2 py-0.5 text-[10px] font-bold text-white transition hover:brightness-105"
            >
              {memberBadge.label}
            </Link>

            {/* Who you are, and how much of that this site knows. */}
            <ProfileDot profile={profile} />

            <Link href="/notifications" className="relative -mr-2 p-2" aria-label="Notifications">
              <Bell size={21} className="text-ink-700" />
              <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                1
              </span>
            </Link>
          </div>
        </div>

        {/* -- Desktop ---------------------------------------------------- */}
        <div className="hidden h-14 items-center lg:flex">
          <Logo />

          <div className="ml-auto flex items-center gap-3">
            <Link
              href={memberBadge.href}
              className="rounded-full bg-gradient-to-r from-[#d8a41f] to-[#b8860b] px-2 py-0.5 text-[10px] font-bold text-white transition hover:brightness-105"
            >
              {memberBadge.label}
            </Link>

            <ProfileDot profile={profile} size={36} />

            <Link
              href="/notifications"
              className="relative grid h-10 w-10 place-items-center rounded-full border border-surface-line text-ink-600 transition hover:bg-surface-soft"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </Link>

            {/*
              One way in, signed in or not: the account page. Logging in and
              registering happen there, and in the sheet — a header that says
              "Log in" is a third place to keep in step with the other two,
              and it went out of step.
            */}
            <Link href="/profile" className="btn-primary py-2.5">
              Account
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
