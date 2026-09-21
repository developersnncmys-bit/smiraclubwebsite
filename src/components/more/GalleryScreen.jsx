'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Expand, MapPin, X } from 'lucide-react';
import Portal from '@/components/ui/Portal';
import { galleryCategories } from '@/lib/content';

/** A rhythm of shapes, so the grid reads as a gallery and not a spreadsheet. */
const SHAPES = ['aspect-[4/5]', 'aspect-square', 'aspect-[4/3]', 'aspect-[3/4]', 'aspect-square', 'aspect-[4/5]'];

/**
 * Gallery: the photos, filtered by kind, in a masonry grid. Any photo opens
 * full screen, where the arrows, a swipe or the keyboard move through the
 * photos currently shown and Escape closes.
 */
export default function GalleryScreen({ photos }) {
  const [category, setCategory] = useState('all');
  const [open, setOpen] = useState(null);
  const touchX = useRef(null);

  const shown = useMemo(
    () => (category === 'all' ? photos : photos.filter((p) => p.category === category)),
    [photos, category],
  );
  const counts = useMemo(() => {
    const c = { all: photos.length };
    photos.forEach((p) => { c[p.category] = (c[p.category] || 0) + 1; });
    return c;
  }, [photos]);

  const step = useCallback((dir) => setOpen((i) => (i === null ? i : (i + dir + shown.length) % shown.length)), [shown.length]);

  useEffect(() => {
    if (open === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, step]);

  const current = open === null ? null : shown[open];

  return (
    <div className="pb-10 lg:pb-16">
      <section className="bg-white">
        <div className="shell py-6 lg:py-10">
          <h1 className="text-[22px] font-extrabold text-ink-900 lg:text-3xl">Moments with Smira Club</h1>
          <p className="mt-1.5 max-w-xl text-[14px] text-ink-600 lg:text-base">
            Stays, destinations and experiences our members love — tap any photo to see it full screen.
          </p>

          <div className="rail mt-5 gap-2">
            {galleryCategories.map((c) => {
              const on = c.key === category;
              if (!counts[c.key]) return null;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setCategory(c.key)}
                  aria-pressed={on}
                  className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-semibold transition ${
                    on ? 'border-action-500 bg-action-500 text-white' : 'border-surface-line bg-white text-ink-700 hover:bg-surface-soft'
                  }`}
                >
                  {c.label}
                  <span className={`ml-1.5 text-[12px] ${on ? 'text-white/80' : 'text-ink-400'}`}>{counts[c.key]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="shell pt-5 lg:pt-8">
        <ul className="columns-2 gap-3 sm:columns-3 lg:columns-4 lg:gap-4">
          {shown.map((photo, i) => (
            <li key={photo.slot} className="mb-3 break-inside-avoid lg:mb-4">
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`Open ${photo.title}`}
                className={`group relative block w-full overflow-hidden rounded-2xl bg-surface-line ${SHAPES[i % SHAPES.length]}`}
              >
                <Image
                  src={photo.src}
                  alt={photo.title}
                  fill
                  sizes="(min-width: 1024px) 24vw, (min-width: 640px) 32vw, 48vw"
                  loading={i < 4 ? 'eager' : 'lazy'}
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
                <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/40 text-white opacity-0 transition group-hover:opacity-100">
                  <Expand size={15} />
                </span>
                <span className="absolute inset-x-0 bottom-0 p-3 text-left">
                  <span className="block text-[13px] font-bold leading-tight text-white lg:text-[14px]">{photo.title}</span>
                  <span className="mt-0.5 flex items-center gap-1 text-[11px] text-white/85">
                    <MapPin size={11} />
                    {photo.place}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {current && (
        <Portal>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={current.title}
            className="fixed inset-0 z-50 flex flex-col bg-black"
            onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              touchX.current = null;
              if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
            }}
          >
            <div className="flex shrink-0 items-center justify-between px-4 py-3 text-white">
              <span className="text-[13px] font-semibold text-white/80">{open + 1} / {shown.length}</span>
              <button type="button" onClick={() => setOpen(null)} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10">
                <X size={22} />
              </button>
            </div>

            <div className="relative min-h-0 flex-1" onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
              <Image key={current.slot} src={current.src} alt={current.title} fill sizes="100vw" className="object-contain" />
              {shown.length > 1 && (
                <>
                  <button type="button" onClick={() => step(-1)} aria-label="Previous photo" className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/25 lg:left-6">
                    <ChevronLeft size={24} />
                  </button>
                  <button type="button" onClick={() => step(1)} aria-label="Next photo" className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/25 lg:right-6">
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            <div className="shrink-0 px-4 pb-6 pt-4 text-center text-white">
              <p className="text-[16px] font-bold">{current.title}</p>
              <p className="mt-0.5 inline-flex items-center gap-1 text-[13px] text-white/75">
                <MapPin size={13} />
                {current.place}
              </p>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
