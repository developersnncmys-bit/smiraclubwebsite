'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import { services } from '@/lib/content';

/**
 * All Services. A phone shows eight and offers the rest behind View more —
 * the toggle the design draws. A desktop has the room for all of them.
 *
 * `art` maps a service key to its illustration, resolved on the server by
 * lib/serviceArt.js. A tile with artwork shows it; a tile without keeps its
 * Lucide icon, so the grid holds together while the set is part-exported.
 */
export default function Services({ art = {} }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="bg-white py-6 lg:bg-transparent lg:py-10">
      <div className="shell">
        <h2 className="section-title mb-4 lg:mb-6">All Services</h2>

        <div className="grid grid-cols-4 gap-x-2 gap-y-5 sm:grid-cols-6 lg:grid-cols-8 lg:gap-y-7">
          {/* Everything renders on a desktop; the phone hides the tail. */}
          {services.map((service, i) => (
            <Link
              key={service.key}
              href={service.href}
              className={`group flex flex-col items-center gap-2 text-center ${
                i >= 8 && !open ? 'hidden lg:flex' : 'flex'
              }`}
            >
              <span className="relative grid h-16 w-16 place-items-center overflow-hidden rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-100 group-active:scale-95 lg:h-[72px] lg:w-[72px]">
                {art[service.key] ? (
                  <Image
                    src={art[service.key]}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-contain p-0.5"
                  />
                ) : (
                  <Icon name={service.icon} size={26} strokeWidth={1.6} />
                )}
              </span>
              <span className="text-[11px] font-semibold leading-tight text-ink-700 lg:text-xs">
                {service.label}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-5 flex justify-center lg:hidden">
          <button
            onClick={() => setOpen((o) => !o)}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-ink-900 shadow-card"
            aria-expanded={open}
          >
            {open ? 'View less' : 'View more'}
            <span className="grid h-5 w-5 place-items-center rounded-full bg-action-500 text-white">
              <ChevronDown size={13} className={open ? 'rotate-180' : ''} />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
