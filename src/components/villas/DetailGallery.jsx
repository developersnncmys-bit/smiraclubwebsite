'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Heart, Share2, Star } from 'lucide-react';

/**
 * The photo at the top of a villa's page, with the screen's own controls
 * floating over it and the rating pill the design puts in the corner.
 *
 * Share uses the Web Share sheet where the browser has one and falls back to
 * copying the link, so the button always does something.
 */
export default function DetailGallery({ photos, name, rating, reviews }) {
  const router = useRouter();
  const [at, setAt] = useState(0);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: name, url });
        return;
      } catch {
        // The sheet was dismissed; fall through to the copy.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — nothing useful left to try.
    }
  };

  return (
    <section className="relative">
      <div className="relative h-[300px] w-full overflow-hidden sm:h-[400px] lg:h-[520px]">
        {photos.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={i === 0 ? name : ''}
            fill
            sizes="100vw"
            loading="eager"
            fetchPriority={i === 0 ? 'high' : 'auto'}
            className={`object-cover transition-opacity duration-500 ${
              i === at ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        {/* -- The screen's controls, over the photo ------------------- */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 lg:p-5">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink-900 shadow-card backdrop-blur transition hover:bg-white"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSaved((s) => !s)}
              aria-pressed={saved}
              aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow-card backdrop-blur transition hover:bg-white"
            >
              <Heart
                size={20}
                className={saved ? 'text-red-500' : 'text-ink-900'}
                fill={saved ? 'currentColor' : 'none'}
              />
            </button>

            <button
              type="button"
              onClick={share}
              aria-label="Share this villa"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink-900 shadow-card backdrop-blur transition hover:bg-white"
            >
              <Share2 size={19} />
            </button>
          </div>
        </div>

        {copied && (
          <p
            role="status"
            className="absolute right-3 top-16 rounded-lg bg-ink-900/90 px-3 py-1.5 text-[13px] font-semibold text-white lg:right-5"
          >
            Link copied
          </p>
        )}

        {/* -- The rating, as the design corners it -------------------- */}
        <div className="absolute left-4 top-16 rounded-xl bg-ink-900/75 px-4 py-2.5 text-white backdrop-blur lg:left-6 lg:top-20">
          <p className="flex items-center gap-1.5 text-lg font-bold">
            <Star size={17} className="text-gold" fill="currentColor" strokeWidth={0} />
            {rating}
          </p>
          <p className="text-[13px] text-white/85">({reviews} reviews)</p>
        </div>

        {photos.length > 1 && (
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {photos.map((src, i) => (
              <button
                key={src}
                onClick={() => setAt(i)}
                aria-label={`Photo ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === at ? 'w-6 bg-white' : 'w-1.5 bg-white/60 hover:bg-white/85'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
