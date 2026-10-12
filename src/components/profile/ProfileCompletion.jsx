'use client';

import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { profileCompletion, useProfile } from '@/lib/profile';

const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** What the card says, by how far along the member is. */
function nudge(pct) {
  if (pct === 0) return 'Let’s get started! Complete your profile to unlock personalized Smira Benefits';
  if (pct < 50) return 'Good start! Complete your profile to unlock personalized Smira Benefits';
  if (pct < 100) return 'You’re more than half way there! Complete your profile to unlock personalized Smira Benefits';
  return 'Your profile is complete. Enjoy your personalized Smira Benefits';
}

/**
 * How far through the profile you are — the ring and the bar, one number,
 * worked out from what the member has actually saved in Complete Your Profile.
 */
export default function ProfileCompletion() {
  const { profile } = useProfile();
  const pct = Math.min(100, Math.max(0, profileCompletion(profile)));

  return (
    <section className="card p-4 sm:p-5 lg:p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-[13.5px] font-bold text-ink-900 lg:text-[13px]">Profile Completion</h2>
          <p className="mt-0.5 text-[16px] font-bold text-action-500 lg:text-[15px]">{pct}% Completed</p>
        </div>

        <div className="relative shrink-0">
          <svg
            width="54"
            height="54"
            viewBox="0 0 64 64"
            className="-rotate-90"
            role="img"
            aria-label={`Profile ${pct} percent complete`}
          >
            <circle cx="32" cy="32" r={RADIUS} fill="none" stroke="#e6eaef" strokeWidth="5" />
            <circle
              cx="32"
              cy="32"
              r={RADIUS}
              fill="none"
              stroke="#1273e6"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - pct / 100)}
            />
          </svg>
          <span
            aria-hidden="true"
            className="absolute inset-0 grid place-items-center text-[13px] font-bold text-action-500"
          >
            {pct}%
          </span>
        </div>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-line">
        <div className="h-full rounded-full bg-action-500" style={{ width: `${pct}%` }} />
      </div>

      <p className="mt-2 text-[12.5px] leading-snug text-ink-700">
        {nudge(pct)}
      </p>

      <Link
        href="/profile/edit"
        className="mt-2 inline-flex items-center gap-2 text-[12.5px] font-bold text-action-500 transition hover:text-action-600"
      >
        <Pencil size={16} />
        {pct === 100 ? 'Edit Profile' : 'Complete Profile'}
      </Link>
    </section>
  );
}
