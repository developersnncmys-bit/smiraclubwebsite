import Link from 'next/link';
import Image from 'next/image';

/**
 * The real Smira Club lockup, transcribed from the client's artwork.
 *
 * It stays an SVG rather than becoming a PNG because a wordmark sitting beside
 * 13px nav links has to hold up at every screen density, and because the whole
 * file weighs less than a photograph of it would.
 *
 * `compact` only changes the height. The tagline is part of the artwork and
 * reads as a texture at small sizes, which is how the design uses it.
 */
export default function Logo({ className = '', compact = false }) {
  return (
    <Link
      href="/"
      aria-label="Smira Club — home"
      className={`inline-flex shrink-0 items-center ${className}`}
    >
      <Image
        src="/img/smira-logo.svg"
        alt="Smira Club"
        width={360}
        height={82}
        priority
        className={compact ? 'h-7 w-auto' : 'h-8 w-auto lg:h-10'}
      />
    </Link>
  );
}
