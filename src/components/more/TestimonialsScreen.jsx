'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { ChevronDown, Images, Star } from 'lucide-react';
import { memberTestimonials, reviewSortOptions } from '@/lib/content';
import { toSrc } from '@/lib/imageSlot';

/** Five stars, filled to the score — half a star included. */
function Stars({ score }) {
  return (
    <p
      className="flex items-center justify-center gap-1"
      role="img"
      aria-label={`${score} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = Math.min(1, Math.max(0, score - n + 1));
        return (
          <span key={n} className="relative inline-block h-[18px] w-[18px]">
            <Star size={18} className="absolute inset-0 text-ink-300" fill="currentColor" strokeWidth={0} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star size={18} className="text-gold" fill="currentColor" strokeWidth={0} />
            </span>
          </span>
        );
      })}
    </p>
  );
}

/**
 * What our members say.
 *
 * The images filter reads whether a testimonial actually has a photo, so it
 * narrows the list rather than being a control that looks live and does
 * nothing.
 */
export default function TestimonialsScreen({ art = {} }) {
  const [sort, setSort] = useState('relevant');
  const [withImages, setWithImages] = useState(false);

  const shown = useMemo(() => {
    let list = withImages ? memberTestimonials.filter((t) => t.image) : memberTestimonials;

    list = [...list];
    if (sort === 'high') return list.sort((a, b) => b.score - a.score);
    if (sort === 'low') return list.sort((a, b) => a.score - b.score);
    return list;
  }, [sort, withImages]);

  return (
    <div className="pb-10">
      <div className="border-b border-surface-line bg-white">
        <div className="shell py-5">
          <h1 className="text-2xl font-bold text-ink-900">What our members say</h1>

          <div className="mt-4 flex flex-wrap gap-3">
            <label className="inline-flex items-center gap-1.5 rounded-xl border border-surface-line px-4 py-3 text-[14px] font-medium text-ink-900">
              <span className="sr-only">Sort reviews by</span>
              Sort By:
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="cursor-pointer appearance-none border-0 bg-transparent pr-4 font-medium text-ink-900 outline-none"
              >
                {reviewSortOptions.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="-ml-4 shrink-0 text-ink-600" />
            </label>

            <button
              type="button"
              onClick={() => setWithImages((v) => !v)}
              aria-pressed={withImages}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-[14px] font-medium transition ${
                withImages
                  ? 'border-action-500 bg-action-500 text-white'
                  : 'border-surface-line text-ink-900 hover:bg-surface-soft'
              }`}
            >
              <Images size={17} />
              Review with Images
            </button>
          </div>
        </div>
      </div>

      <div className="shell space-y-5 py-6 lg:mx-auto lg:grid lg:max-w-5xl lg:grid-cols-2 lg:items-start lg:gap-6 lg:space-y-0">
        {shown.map((t) => (
          <article key={t.id} className="card overflow-hidden">
            {t.image && (
              <span className="relative block aspect-[16/9] w-full">
                <Image
                  src={toSrc(art[t.id] || t.image)}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </span>
            )}

            <div className="p-5 text-center">
              <Stars score={t.score} />
              <p className="mt-4 text-[15px] font-semibold leading-relaxed text-ink-900">
                &ldquo;{t.body}&rdquo;
              </p>
              <p className="mt-5 text-[15px] text-ink-700">-{t.name}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
