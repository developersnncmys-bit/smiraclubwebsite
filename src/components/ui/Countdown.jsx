'use client';

import { useEffect, useState } from 'react';

const UNITS = ['Days', 'Hrs', 'Mins', 'Sec'];

/**
 * A ticking countdown to a deadline `hours` from when the page opened.
 *
 * It renders dashes until the effect runs, so the server and the client agree
 * on the first paint — a clock rendered on the server is wrong by the time it
 * reaches the browser, and React would flag the mismatch.
 *
 * `tone` picks the treatment: light or dark chips, or 'plain' — bare numbers
 * split by colons, which is how the flash offers read inside the white panel
 * in their corner, where there is nothing for a chip to sit against.
 */
export default function Countdown({ hours, tone = 'light', className = '' }) {
  const [left, setLeft] = useState(null);

  useEffect(() => {
    const ends = Date.now() + hours * 3600 * 1000;

    const tick = () => {
      const ms = Math.max(0, ends - Date.now());
      setLeft({
        Days: Math.floor(ms / 86400000),
        Hrs: Math.floor(ms / 3600000) % 24,
        Mins: Math.floor(ms / 60000) % 60,
        Sec: Math.floor(ms / 1000) % 60,
      });
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [hours]);

  if (tone === 'plain') {
    return (
      <div className={`flex items-end gap-1 ${className}`}>
        {UNITS.map((unit, i) => (
          <span key={unit} className="flex items-end gap-1">
            {i > 0 && <span className="pb-3 text-[12px] font-bold text-ink-400">:</span>}
            <span className="text-center">
              <span className="block text-[15px] font-extrabold leading-none text-ink-900">
                {left ? String(left[unit]).padStart(2, '0') : '--'}
              </span>
              <span className="mt-1 block text-[9px] font-bold text-ink-600">{unit}</span>
            </span>
          </span>
        ))}
      </div>
    );
  }

  const chip =
    tone === 'dark'
      ? 'bg-white/15 text-white'
      : 'bg-white text-ink-900';
  const label = tone === 'dark' ? 'text-white/70' : 'text-ink-500';

  return (
    <div className={`flex shrink-0 gap-1.5 ${className}`}>
      {UNITS.map((unit) => (
        <span key={unit} className={`w-[42px] rounded-lg px-1 py-1 text-center ${chip}`}>
          <span className="block text-[14px] font-bold leading-none">
            {left ? String(left[unit]).padStart(2, '0') : '--'}
          </span>
          <span className={`block text-[10px] ${label}`}>{unit}</span>
        </span>
      ))}
    </div>
  );
}
