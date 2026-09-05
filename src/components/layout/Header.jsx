'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Menu, X, Search } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import CityPicker from './CityPicker';
import { site, desktopNav } from '@/lib/content';

/**
 * One header, two shapes. On a phone it is the design's row — city, mark,
 * bell. From the large breakpoint up it becomes a proper site header with the
 * navigation a desktop expects, since a bottom tab bar is a phone idea.
 */
export default function Header() {
  const pathname = usePathname();
  const [city, setCity] = useState(site.city);
  const [menuOpen, setMenuOpen] = useState(false);

  const isOn = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-surface-line bg-white/95 backdrop-blur pt-safe">
      <div className="shell">
        {/* -- Phone ------------------------------------------------------ */}
        <div className="flex h-14 items-center justify-between lg:hidden">
          <CityPicker city={city} onChange={setCity} />

          <Logo className="absolute left-1/2 -translate-x-1/2" compact />

          <Link href="/notifications" className="relative -mr-1 p-2" aria-label="Notifications">
            <Bell size={21} className="text-ink-700" />
            <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              1
            </span>
          </Link>
        </div>

        {/* -- Desktop ---------------------------------------------------- */}
        <div className="hidden h-[68px] items-center gap-8 lg:flex">
          <Logo />

          <nav className="flex items-center gap-1">
            {desktopNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isOn(item.href) ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-surface-soft hover:text-ink-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <CityPicker city={city} onChange={setCity} />

            <Link
              href="/search"
              className="grid h-10 w-10 place-items-center rounded-full border border-surface-line text-ink-600 transition hover:bg-surface-soft"
              aria-label="Search"
            >
              <Search size={18} />
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

      {/* -- The tablet gap: a drawer, so the middle sizes are not stranded */}
      <div className="hidden md:block lg:hidden">
        <button
          onClick={() => setMenuOpen(true)}
          className="absolute right-14 top-3 grid h-9 w-9 place-items-center rounded-lg text-ink-600"
          aria-label="Open the menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/40" onClick={() => setMenuOpen(false)} />
          <nav className="absolute right-0 top-0 h-full w-72 bg-white p-5 shadow-lift">
            <div className="flex items-center justify-between">
              <Logo />
              <button onClick={() => setMenuOpen(false)} className="p-2" aria-label="Close the menu">
                <X size={20} className="text-ink-600" />
              </button>
            </div>
            <ul className="mt-6 space-y-1">
              {desktopNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-3 text-[15px] font-semibold text-ink-700 hover:bg-surface-soft"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
