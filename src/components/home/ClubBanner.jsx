'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Crown, ArrowRight } from 'lucide-react';
import { clubBanners } from '@/lib/content';

/** The crowned banner under the benefits, with its own dots. */
export default function ClubBanner() {
  const [at, setAt] = useState(0);
  const banner = clubBanners[at];

  return (
    <div className="shell py-6 lg:py-10">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#c9d3dc] via-[#dfe6ec] to-[#f6efe2] p-5 sm:p-7 lg:p-10">
        <span className="inline-flex items-center gap-1.5 rounded-r-md bg-ink-900 px-3 py-1.5 text-[11px] font-bold text-white">
          <Crown size={13} className="text-gold" />
          {banner.badge}
        </span>

        <h3 className="mt-4 text-2xl font-extrabold uppercase tracking-tight text-ink-900 lg:text-3xl">
          {banner.title}
        </h3>
        <p className="mt-2 max-w-sm text-[15px] leading-snug text-ink-600 lg:max-w-lg lg:text-base">
          {banner.copy}
        </p>

        <Link
          href={banner.cta.href}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold uppercase tracking-wide text-ink-900 shadow-card transition hover:bg-surface-soft"
        >
          {banner.cta.label}
          <ArrowRight size={15} />
        </Link>

        <div className="mt-6 flex gap-1.5">
          {clubBanners.map((b, i) => (
            <button
              key={b.id}
              onClick={() => setAt(i)}
              aria-label={`Banner ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === at ? 'w-7 bg-ink-900' : 'w-1.5 bg-ink-900/25 hover:bg-ink-900/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
