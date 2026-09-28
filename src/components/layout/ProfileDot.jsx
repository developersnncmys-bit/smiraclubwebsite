'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, User } from 'lucide-react';
import { completeProfileHref, profileCompletion, profileGaps } from '@/lib/profile';

/**
 * The round mark beside the membership badge: who you are, and how much of
 * that the site actually knows.
 *
 * The ring is the profile's completion, so the gap in it is the reason to
 * press it. Resting on it says what is still missing rather than only that
 * something is — a bare "incomplete" sends people hunting through five steps
 * to find the one empty field.
 *
 * A phone has no hover, so a tap opens the same card instead of going
 * straight to the profile; the button inside it is what navigates.
 */
export default function ProfileDot({ profile, size = 32 }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);

  const pct = profileCompletion(profile);
  const gaps = profileGaps(profile);
  const done = gaps.length === 0;
  const name = profile?.details?.name?.trim() || '';
  const initial = name ? name[0].toUpperCase() : '';

  // Pressing anywhere else, or Escape, puts the card away.
  useEffect(() => {
    if (!open) return undefined;
    const away = (e) => {
      if (wrap.current && !wrap.current.contains(e.target)) setOpen(false);
    };
    const key = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', away);
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('pointerdown', away);
      document.removeEventListener('keydown', key);
    };
  }, [open]);

  const ring = done ? '#16a34a' : '#d8a41f';
  const label = done ? 'Your profile is complete' : `Your profile is ${pct}% complete`;

  return (
    <div
      ref={wrap}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={label}
        aria-expanded={open}
        className="block shrink-0 rounded-full"
        style={{
          width: size,
          height: size,
          padding: 2,
          // The ring is the percentage: filled to where the profile reaches,
          // and a plain track the rest of the way round.
          background: `conic-gradient(${ring} ${pct * 3.6}deg, #e2e8f0 0deg)`,
        }}
      >
        <span className="grid h-full w-full place-items-center overflow-hidden rounded-full bg-white">
          {initial ? (
            <span className="text-[12px] font-extrabold leading-none text-ink-800">{initial}</span>
          ) : (
            <User size={size > 32 ? 17 : 15} className="text-ink-500" />
          )}
        </span>
      </button>

      {/* No badge on top of it: the gap in the ring is the badge, and a dot
          sitting on the arc only reads as a flaw in the drawing. */}

      {open && (
        <div
          role="dialog"
          aria-label="Profile"
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 rounded-xl border border-surface-line bg-white p-3.5 text-left shadow-[0_12px_32px_-12px_rgba(17,24,32,0.3)]"
        >
          <p className="text-[13px] font-bold text-ink-900">
            {done ? 'Profile complete' : 'Complete your profile'}
          </p>
          <p className="mt-0.5 text-[11px] text-ink-600">
            {done
              ? 'Every booking fills itself in from here.'
              : 'It fills in every booking for you, and we can time the offers to your dates.'}
          </p>

          <div className="mt-2.5 flex items-center gap-2">
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-soft">
              <span
                className="block h-full rounded-full transition-[width]"
                style={{ width: `${pct}%`, background: ring }}
              />
            </span>
            <span className="text-[11px] font-bold text-ink-700">{pct}%</span>
          </div>

          {done ? (
            <p className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-green-700">
              <Check size={13} /> Nothing left to fill in
            </p>
          ) : (
            <ul className="mt-2.5 space-y-1">
              {gaps.slice(0, 3).map((g) => (
                <li key={g} className="flex items-center gap-1.5 text-[11px] text-ink-600">
                  <span className="h-1 w-1 shrink-0 rounded-full bg-ink-400" />
                  {g}
                </li>
              ))}
              {gaps.length > 3 && (
                <li className="pl-2.5 text-[11px] text-ink-400">and {gaps.length - 3} more</li>
              )}
            </ul>
          )}

          <Link
            href={done ? '/profile' : completeProfileHref()}
            onClick={() => setOpen(false)}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-action-500 py-2 text-[12px] font-bold text-white transition hover:brightness-105"
          >
            {done ? 'View profile' : 'Finish profile'}
            <ArrowRight size={13} />
          </Link>
        </div>
      )}
    </div>
  );
}
