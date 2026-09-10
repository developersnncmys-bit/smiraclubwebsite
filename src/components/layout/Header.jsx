'use client';

import Link from 'next/link';
import { Bell, Heart, Search } from 'lucide-react';
import Logo from '@/components/ui/Logo';

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
  return (
    <header className="sticky top-0 z-40 border-b border-surface-line bg-white/95 backdrop-blur pt-safe">
      <div className="shell">
        {/* -- Phone ------------------------------------------------------ */}
        <div className="relative flex h-14 items-center justify-between lg:hidden">
          <Logo compact />

          <div className="flex items-center gap-1">
            <Link href="/wishlist" className="p-2" aria-label="Wishlist">
              <Heart size={21} className="text-ink-700" />
            </Link>

            <Link href="/notifications" className="relative -mr-1 p-2" aria-label="Notifications">
              <Bell size={21} className="text-ink-700" />
              <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                1
              </span>
            </Link>
          </div>
        </div>

        {/* -- Desktop ---------------------------------------------------- */}
        <div className="hidden h-[68px] items-center lg:flex">
          <Logo />

          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/search"
              className="grid h-10 w-10 place-items-center rounded-full border border-surface-line text-ink-600 transition hover:bg-surface-soft"
              aria-label="Search"
            >
              <Search size={18} />
            </Link>

            <Link
              href="/wishlist"
              className="grid h-10 w-10 place-items-center rounded-full border border-surface-line text-ink-600 transition hover:bg-surface-soft"
              aria-label="Wishlist"
            >
              <Heart size={18} />
            </Link>

            <Link
              href="/notifications"
              className="relative grid h-10 w-10 place-items-center rounded-full border border-surface-line text-ink-600 transition hover:bg-surface-soft"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </Link>

            <Link href="/profile" className="btn-primary py-2.5">
              My account
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
