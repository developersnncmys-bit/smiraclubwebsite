import Link from 'next/link';

/**
 * The Smira mark, drawn rather than shipped as an image so it stays sharp and
 * costs nothing to load. Swap in the real asset when it arrives.
 */
export default function Logo({ className = '', compact = false }) {
  return (
    <Link href="/" aria-label="Smira Club — home" className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" role="presentation">
        <path
          d="M22 5c-4.5 0-7 2.6-7 5.6 0 5.6 10 4.2 10 9.9C25 24 21.5 27 16 27c-3.3 0-6-1-7.7-2.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          className="text-brand-600"
        />
        <circle cx="10" cy="8" r="2.6" className="fill-brand-400" />
      </svg>
      <span className="leading-none">
        <span className="block text-[15px] font-extrabold tracking-[0.14em] text-brand-700">SMIRA</span>
        {!compact && (
          <span className="mt-0.5 block text-[8px] font-semibold uppercase tracking-[0.18em] text-ink-400">
            Club
          </span>
        )}
      </span>
    </Link>
  );
}
