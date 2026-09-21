'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import { services } from '@/lib/content';

/**
 * All Services: two rows, and View All opens the rest in place — the same on
 * a phone and a desktop. Two rows is four across on a phone and eight across
 * on a desktop.
 *
 * Each icon sits in a fixed box, so artwork of different sizes reads the same.
 * `art` maps a service key to its illustration, resolved on the server by
 * lib/serviceArt.js; a tile without artwork keeps its Lucide icon.
 */
export default function Services({ art = {} }) {
  const [open, setOpen] = useState(false);

  const toggle = (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
      aria-controls="all-services"
      className="inline-flex items-center gap-1.5 text-[14px] font-bold text-ink-900 hover:text-brand-700"
    >
      {open ? 'View Less' : 'View All'}
      <span className="grid h-5 w-5 place-items-center rounded-full bg-action-500 text-white">
        <ChevronDown size={13} className={`transition ${open ? 'rotate-180' : ''}`} />
      </span>
    </button>
  );

  return (
    <section className="bg-white py-6 lg:bg-transparent lg:py-10">
      <div className="shell">
        <h2 className="section-title mb-4 lg:mb-6">All Services</h2>

        <div id="all-services" className="grid grid-cols-4 gap-x-2 gap-y-5 lg:grid-cols-8 lg:gap-y-7">
          {services.map((service, i) => (
            <Link
              key={service.key}
              href={service.href}
              className={`group flex-col items-center gap-2 text-center ${i >= 8 && !open ? 'hidden' : 'flex'}`}
            >
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-100 group-active:scale-95 lg:h-[72px] lg:w-[72px]">
                <span className="relative block h-11 w-11 lg:h-12 lg:w-12">
                  {art[service.key] ? (
                    <Image src={art[service.key]} alt="" fill sizes="48px" className="object-contain" />
                  ) : (
                    <Icon name={service.icon} size={28} strokeWidth={1.6} className="absolute inset-0 m-auto" />
                  )}
                </span>
              </span>
              <span className="text-[11px] font-semibold leading-tight text-ink-700 lg:text-xs">{service.label}</span>
            </Link>
          ))}
        </div>

        <div className="mt-5 flex justify-center">{toggle}</div>
      </div>
    </section>
  );
}
