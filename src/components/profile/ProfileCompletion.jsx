import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { member } from '@/lib/content';

const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** How far through the profile you are — the ring and the bar, one number. */
export default function ProfileCompletion() {
  const pct = Math.min(100, Math.max(0, member.completion));

  return (
    <section className="card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-[15px] font-bold text-ink-900">Profile Completion</h2>
          <p className="mt-1.5 text-[19px] font-bold text-action-500">{pct}% Completed</p>
        </div>

        <div className="relative shrink-0">
          <svg
            width="64"
            height="64"
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

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface-line">
        <div className="h-full rounded-full bg-action-500" style={{ width: `${pct}%` }} />
      </div>

      <p className="mt-4 text-[14px] leading-relaxed text-ink-700">
        You&rsquo;re half way there! Complete your profile to unlock personalized Smira Benefits
      </p>

      <Link
        href="/profile/edit"
        className="mt-3 inline-flex items-center gap-2 text-[14px] font-bold text-action-500 transition hover:text-action-600"
      >
        <Pencil size={16} />
        Complete Profile
      </Link>
    </section>
  );
}
