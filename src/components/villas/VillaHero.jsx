'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { villaHero as fallbackSlides } from '@/lib/content';
import { toSrc } from '@/lib/imageSlot';

/**
 * The banner the villas screen opens on. It advances itself and stops the
 * moment anyone takes hold of it.
 *
 * All four load eagerly rather than with `preload`: any of them can be the
 * largest paint depending on the viewport, and next/image's own guidance is
 * to reach for `loading`/`fetchPriority` in that case. Lazy is wrong here —
 * a slide is already on screen by the time it would start fetching, so the
 * banner flashes empty as the carousel comes round to it.
 */
export default function VillaHero({ slides }) {
  const items = (slides?.length ? slides : fallbackSlides).map((s) => ({
    ...s,
    image: toSrc(s.image),
  }));

  const [at, setAt] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const timer = setInterval(() => setAt((n) => (n + 1) % items.length), 6000);
    return () => clearInterval(timer);
  }, [paused, items.length]);

  const slide = items[at];

  return (
    <section
      className="relative h-[300px] w-full overflow-hidden sm:h-[380px] lg:h-[460px] 2xl:h-[520px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      aria-roledescription="carousel"
      aria-label="Villas and home stays"
    >
      {items.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === at ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={i !== at}
        >
          <Image
            src={s.image}
            alt={s.alt}
            fill
            sizes="100vw"
            loading="eager"
            fetchPriority={i === 0 ? 'high' : 'auto'}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
        </div>
      ))}

      <div className="relative flex h-full flex-col items-center justify-end pb-7 text-center lg:pb-24">
        <div className="shell">
          <h2 className="text-[17px] font-extrabold uppercase leading-tight tracking-tight text-white drop-shadow sm:text-2xl lg:text-4xl">
            {slide.title}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[13px] leading-snug text-white/90 sm:text-[14px] lg:max-w-xl lg:text-lg">
            {slide.copy}
          </p>
        </div>

        <div className="mt-4 flex gap-1.5">
          {items.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setAt(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === at ? 'true' : undefined}
              className={`h-1.5 rounded-full transition-all ${
                i === at ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
