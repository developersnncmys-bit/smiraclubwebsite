'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import Portal from '@/components/ui/Portal';
import { hotelAmenities, hotelAmenitiesAll } from '@/lib/content';

/**
 * See all Amenities — the six on the card are the highlights, the rest live
 * behind this, grouped the way a property lists them.
 */
export default function AllAmenities() {
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

  const count = hotelAmenitiesAll.reduce((n, g) => n + g.items.length, 0) + hotelAmenities.length;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="mt-6 text-[14px] font-bold text-ink-900 underline">
        See all Amenities
      </button>

      {open && (
        <Portal>
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/50 sm:items-center sm:p-6"
            onMouseDown={(e) => {
              if (!panel.current?.contains(e.target)) setOpen(false);
            }}
          >
            <div ref={panel} role="dialog" aria-modal="true" aria-label="All amenities" className="flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-lift sm:rounded-2xl">
              <header className="flex shrink-0 items-center justify-between gap-4 border-b border-surface-line px-4 py-4">
                <div>
                  <h2 className="text-[17px] font-semibold text-ink-900">All Amenities</h2>
                  <p className="text-[13px] text-ink-700">{count} amenities at this property</p>
                </div>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg hover:bg-surface-soft">
                  <X size={20} />
                </button>
              </header>

              <div className="divide-y divide-surface-line overflow-y-auto">
                <section className="px-5 py-4">
                  <h3 className="text-[15px] font-bold text-ink-900">Highlights</h3>
                  <ul className="mt-3 grid grid-cols-2 gap-y-3">
                    {hotelAmenities.map((a) => (
                      <li key={a.key} className="flex items-center gap-2.5 text-[14px] text-ink-700">
                        <Icon name={a.icon} size={18} className="shrink-0 text-action-500" strokeWidth={1.8} />
                        {a.label}
                      </li>
                    ))}
                  </ul>
                </section>

                {hotelAmenitiesAll.map((group) => (
                  <section key={group.title} className="px-5 py-4">
                    <h3 className="text-[15px] font-bold text-ink-900">{group.title}</h3>
                    <ul className="mt-3 grid grid-cols-2 gap-y-3">
                      {group.items.map((item) => (
                        <li key={item} className="flex items-center gap-2.5 text-[14px] text-ink-700">
                          <Icon name={group.icon} size={18} className="shrink-0 text-action-500" strokeWidth={1.8} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
