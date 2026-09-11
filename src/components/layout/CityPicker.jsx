'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, ChevronDown, Check } from 'lucide-react';
import { cities } from '@/lib/content';

/** Where the member is booking from. Closes on a click away or Escape. */
export default function CityPicker({ city, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const away = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', away);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-[14px] font-semibold text-ink-900"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <MapPin size={17} className="text-ink-700" />
        <span className="max-w-[7.5rem] truncate">{city}</span>
        <ChevronDown size={15} className={`text-ink-500 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-surface-line bg-white py-1 shadow-lift"
        >
          {cities.map((c) => (
            <li key={c}>
              <button
                role="option"
                aria-selected={c === city}
                onClick={() => {
                  onChange(c);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-ink-700 hover:bg-surface-soft"
              >
                {c}
                {c === city && <Check size={14} className="text-brand-600" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
