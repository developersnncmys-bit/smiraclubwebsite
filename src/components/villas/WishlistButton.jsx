'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

/**
 * The heart on a villa photo. It holds its own state for now — there is no
 * account to save against yet, so this is honest about being local until the
 * wishlist API lands.
 */
export default function WishlistButton({ label }) {
  const [saved, setSaved] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setSaved((s) => !s)}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${label} from wishlist` : `Save ${label} to wishlist`}
      className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-ink-900/45 backdrop-blur transition hover:bg-ink-900/60"
    >
      <Heart
        size={20}
        className={saved ? 'text-red-500' : 'text-white'}
        fill={saved ? 'currentColor' : 'none'}
        strokeWidth={2}
      />
    </button>
  );
}
