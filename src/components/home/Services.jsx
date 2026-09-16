'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, X } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import Portal from '@/components/ui/Portal';
import { services } from '@/lib/content';

/** One tile. The art sits in a fixed box, so every icon is the same size. */
function Tile({ service, art, onClick }) {
  return (
    <Link href={service.href} onClick={onClick} className="group flex flex-col items-center gap-2 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-100 group-active:scale-95 lg:h-[72px] lg:w-[72px]">
        <span className="relative block h-11 w-11 lg:h-12 lg:w-12">
          {art ? (
            <Image src={art} alt="" fill sizes="48px" className="object-contain" />
          ) : (
            <Icon name={service.icon} size={28} strokeWidth={1.6} className="absolute inset-0 m-auto" />
          )}
        </span>
      </span>
      <span className="text-[11px] font-semibold leading-tight text-ink-700 lg:text-xs">{service.label}</span>
    </Link>
  );
}

/**
 * All Services: two rows, and View All for the rest in a popup.
 *
 * Two rows is four across on a phone and eight across on a desktop, so the
 * section is the same height at any width and the home screen reaches the
 * next section sooner.
 *
 * `art` maps a service key to its illustration, resolved on the server by
 * lib/serviceArt.js. A tile without artwork keeps its Lucide icon.
 */
export default function Services({ art = {} }) {
  const [open, setOpen] = useState(false);
  const panel = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <section className="bg-white py-6 lg:bg-transparent lg:py-10">
      <div className="shell">
        <div className="mb-4 flex items-center justify-between gap-4 lg:mb-6">
          <h2 className="section-title">All Services</h2>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 text-[14px] font-bold text-ink-900 hover:text-brand-700"
          >
            View All
            <span className="grid h-5 w-5 place-items-center rounded-full bg-action-500 text-white">
              <ChevronRight size={13} />
            </span>
          </button>
        </div>

        <div className="grid grid-cols-4 gap-x-2 gap-y-5 lg:grid-cols-8 lg:gap-y-7">
          {services.map((service, i) => (
            <div key={service.key} className={i >= 8 ? 'hidden' : ''}>
              <Tile service={service} art={art[service.key]} />
            </div>
          ))}
        </div>
      </div>

      {open && (
        <Portal>
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/50 sm:items-center sm:p-6"
            onMouseDown={(e) => {
              if (!panel.current?.contains(e.target)) setOpen(false);
            }}
          >
            <div ref={panel} role="dialog" aria-modal="true" aria-label="All Services" className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-lift sm:rounded-2xl">
              <header className="flex shrink-0 items-center justify-between border-b border-surface-line px-4 py-4">
                <h2 className="text-[17px] font-semibold text-ink-900">All Services</h2>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-lg hover:bg-surface-soft">
                  <X size={20} />
                </button>
              </header>
              <div className="grid grid-cols-4 gap-x-2 gap-y-6 overflow-y-auto p-5 sm:grid-cols-6">
                {services.map((service) => (
                  <Tile key={service.key} service={service} art={art[service.key]} onClick={() => setOpen(false)} />
                ))}
              </div>
            </div>
          </div>
        </Portal>
      )}
    </section>
  );
}
