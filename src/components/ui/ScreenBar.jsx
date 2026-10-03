'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell } from 'lucide-react';
import InnerScreen from '@/components/layout/InnerScreen';

/**
 * The app-style bar the Figma puts at the top of an inner screen: a way back
 * and the screen's name. A desktop has the site header and its own heading,
 * so this is the phone's alone.
 */
export default function ScreenBar({ title, backHref }) {
  const router = useRouter();

  const goBack = () => {
    if (backHref) router.push(backHref);
    else router.back();
  };

  return (
    <>
      {/* The header stands down for this on a phone — see InnerScreen. */}
      <InnerScreen />
      <div className="sticky top-0 z-40 border-b border-surface-line bg-white pt-safe lg:hidden">
        <div className="relative flex h-14 items-center justify-center px-3">
          <button
            type="button"
            onClick={goBack}
            aria-label="Go back"
            className="absolute left-1 grid h-10 w-10 place-items-center rounded-full text-ink-900 transition hover:bg-surface-soft"
          >
            <ArrowLeft size={22} />
          </button>

          <h1 className="truncate px-12 text-[15px] font-bold text-ink-900">{title}</h1>

          {/* Carried over from the header this bar replaces, so a phone does
              not lose its way to notifications on every inner screen. */}
          <Link
            href="/notifications"
            aria-label="Notifications"
            className="absolute right-1 grid h-10 w-10 place-items-center rounded-full text-ink-700 transition hover:bg-surface-soft"
          >
            <Bell size={20} />
          </Link>
        </div>
      </div>
    </>
  );
}
