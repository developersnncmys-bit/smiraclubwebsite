'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { heroSlides as fallbackSlides } from '@/lib/content';
import { toSrc } from '@/lib/imageSlot';

/**
 * The membership banner. Full-bleed and short on a phone, a rounded wide
 * panel on a desktop. It advances itself, and stops the moment anyone takes
 * hold of it.
 */
export default function Hero({ slides }) {
  // Normalised, so a render without the server's props still shows something.
  const heroSlides = (slides?.length ? slides : fallbackSlides).map((s) => ({
    ...s,
    image: toSrc(s.image),
  }));
  const [at, setAt] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const timer = setInterval(() => setAt((n) => (n + 1) % heroSlides.length), 6000);
    return () => clearInterval(timer);
  }, [paused]);

  const slide = heroSlides[at];

  return (
    <section
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      aria-roledescription="carousel"
      aria-label="Membership offers"
    >
      <div className="w-full">
        <div className="relative h-[290px] w-full overflow-hidden sm:h-[380px] lg:h-[500px] 2xl:h-[560px]">
          {heroSlides.map((s, i) => (
            <div
              key={s.id}
              className={`absolute inset-0 transition-opacity duration-700 ${i === at ? 'opacity-100' : 'opacity-0'}`}
              aria-hidden={i !== at}
            >
              <Image
                src={s.image}
                alt={s.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/25" />
            </div>
          ))}

          <div className="relative flex h-full items-center">
            <div className="shell">
              <div className="w-full max-w-[26rem] lg:max-w-[38rem]">
              <span className="inline-block rounded bg-gold px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-ink-900 sm:text-[11px]">
                {slide.eyebrow}
              </span>

              <p className="mt-4 flex items-end gap-3 text-white">
                <span className="text-xl font-semibold uppercase tracking-wide sm:text-2xl">{slide.headline}</span>
                <span className="flex items-end border-l border-white/40 pl-3 leading-none">
                  <span className="text-[52px] font-extrabold leading-[0.85] sm:text-6xl lg:text-7xl">
                    {slide.figure}
                  </span>
                  <span className="ml-1 flex flex-col text-left leading-none">
                    {slide.unit && <span className="text-lg font-bold sm:text-xl">{slide.unit}</span>}
                    <span className="text-sm font-bold uppercase sm:text-base">{slide.suffix}</span>
                  </span>
                </span>
              </p>

              <p className="mt-3 max-w-[19rem] text-[15px] leading-snug text-white/90 sm:text-base lg:max-w-md lg:text-lg">
                {slide.copy}
              </p>

                <Link href={slide.cta.href} className="btn-pill mt-5 uppercase tracking-wide">
                  {slide.cta.label}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The 1/3 counter and dots, sitting under the banner as designed. */}
      <div className="flex items-center justify-center gap-2 py-3">
        <span className="num rounded-full bg-ink-900 px-2.5 py-1 text-[11px] font-bold text-white">
          {at + 1}/{heroSlides.length}
        </span>
        <span className="flex gap-1.5">
          {heroSlides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setAt(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === at ? 'w-5 bg-ink-700' : 'w-1.5 bg-ink-400/50 hover:bg-ink-400'
              }`}
            />
          ))}
        </span>
      </div>
    </section>
  );
}
