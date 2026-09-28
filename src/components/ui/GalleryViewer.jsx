'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

/**
 * Every photo of a place, full screen.
 *
 * The hero shows one picture at a time and swipes; this is the other way to
 * look — all of them at once, then one of them large. It is the same list of
 * photos either way, so a service only has to hand over what it already has.
 *
 * Arrow keys and Escape work, because a gallery you can only leave with a
 * mouse is a trap on a laptop.
 */
export default function GalleryViewer({ photos, name, open, at = 0, onClose }) {
  // -1 is the grid; anything else is that photo, large.
  const [shown, setShown] = useState(at);

  useEffect(() => {
    if (open) setShown(at);
  }, [open, at]);

  const step = useCallback(
    (by) => setShown((n) => (n < 0 ? n : (n + by + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (!open) return undefined;
    const key = (e) => {
      if (e.key === 'Escape') {
        if (shown >= 0) setShown(-1);
        else onClose();
      }
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', key);
    // The page behind must not scroll while this is over it.
    const had = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', key);
      document.body.style.overflow = had;
    };
  }, [open, shown, step, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${name} — photo gallery`}
      className="fixed inset-0 z-[70] flex flex-col bg-ink-900/95 backdrop-blur-sm"
    >
      <div className="flex shrink-0 items-center gap-3 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={() => (shown >= 0 ? setShown(-1) : onClose())}
          aria-label={shown >= 0 ? 'Back to all photos' : 'Close gallery'}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
        >
          {shown >= 0 ? <ChevronLeft size={21} /> : <X size={21} />}
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-bold text-white">{name}</p>
          <p className="text-[12px] text-white/70">
            {shown >= 0 ? `Photo ${shown + 1} of ${photos.length}` : `${photos.length} photos`}
          </p>
        </div>
        {shown >= 0 && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close gallery"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
          >
            <X size={21} />
          </button>
        )}
      </div>

      {shown < 0 ? (
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setShown(i)}
                aria-label={`Open photo ${i + 1}`}
                className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white/10"
              >
                <Image src={src} alt="" fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative min-h-0 flex-1">
          <Image
            src={photos[shown]}
            alt={`${name} — photo ${shown + 1}`}
            fill
            sizes="100vw"
            className="object-contain"
          />
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white transition hover:bg-black/65"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white transition hover:bg-black/65"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
