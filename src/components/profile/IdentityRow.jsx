'use client';

import Link from 'next/link';
import { ChevronRight, LogIn, Pencil, User, UserPlus } from 'lucide-react';
import { member } from '@/lib/content';
import { OPEN_AUTH } from '@/components/auth/AuthPopup';
import { useAccount } from '@/lib/account';
import { profileCompletion, useProfile } from '@/lib/profile';

const RADIUS = 28;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Who you are, in one line.
 *
 * This was two cards — a blue one with the name and a second with a
 * ring and a paragraph about completing your profile — and between
 * them they took a third of the first screen to say a name, a number
 * and a percentage. The ring is drawn around the photograph, where it
 * is about the person rather than about itself.
 */
export default function IdentityRow() {
  const { signedIn, profile: account } = useAccount();
  const { profile } = useProfile();
  const pct = Math.min(100, Math.max(0, profileCompletion(profile)));

  const name = account?.details?.name?.trim() || (signedIn ? member.name : 'there');
  const phone = account?.details?.phone?.trim() || (signedIn ? member.phone : 'Not signed in');
  const photo = account?.photo;

  return (
    <section className="flex items-center gap-3 rounded-2xl border border-surface-line bg-white p-3 lg:gap-4 lg:p-4">
      {/* The photograph, with how far through the profile is around it. */}
      <span className="relative grid h-[60px] w-[60px] shrink-0 place-items-center lg:h-16 lg:w-16">
        <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="32" cy="32" r={RADIUS} fill="none" stroke="#e6eaef" strokeWidth="4" />
          <circle
            cx="32"
            cy="32"
            r={RADIUS}
            fill="none"
            stroke="#1273e6"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - pct / 100)}
          />
        </svg>

        <span className="grid h-[46px] w-[46px] place-items-center overflow-hidden rounded-full bg-brand-50 lg:h-[50px] lg:w-[50px]">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" className="h-full w-full object-cover" />
          ) : (
            <User size={24} className="text-brand-500" fill="currentColor" strokeWidth={0} />
          )}
        </span>

        <span
          className="absolute -bottom-0.5 rounded-full bg-action-500 px-1.5 text-[9px] font-bold text-white"
          aria-label={`Profile ${pct} percent complete`}
        >
          {pct}%
        </span>
      </span>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[15px] font-extrabold leading-tight text-ink-900 lg:text-[17px]">
          {name}
        </h1>
        <p className="mt-0.5 truncate text-[12px] text-ink-500 lg:text-[13px]">{phone}</p>

        {signedIn ? (
          <Link
            href="/profile/edit"
            className="mt-1 inline-flex items-center text-[12px] font-bold text-action-500 transition hover:text-action-600 lg:text-[13px]"
          >
            {pct === 100 ? 'Edit profile' : 'Complete profile'}
            <ChevronRight size={15} />
          </Link>
        ) : (
          // Both ways in, side by side — each opens the sheet on its own tab.
          <span className="mt-1.5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event(OPEN_AUTH))}
              className="inline-flex items-center gap-1.5 rounded-lg bg-action-500 px-3 py-1.5 text-[12px] font-bold text-white transition hover:bg-action-600"
            >
              <LogIn size={14} />
              Log in
            </button>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event(OPEN_AUTH))}
              className="inline-flex items-center gap-1.5 rounded-lg border border-surface-line px-3 py-1.5 text-[12px] font-bold text-ink-700 transition hover:bg-surface-soft"
            >
              <UserPlus size={14} />
              Register
            </button>
          </span>
        )}
      </div>

      {signedIn && (
        <Link
          href="/profile/edit"
          aria-label="Edit profile"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-surface-line text-ink-500 transition hover:bg-surface-soft"
        >
          <Pencil size={15} />
        </Link>
      )}
    </section>
  );
}
