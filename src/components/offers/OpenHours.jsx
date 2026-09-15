'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * "Open · 10:00 AM - 11:00 PM ˅" — today's hours, and the week's on a tap.
 * Today is worked out after mount so the server's clock never picks the day.
 */
export default function OpenHours({ hours }) {
  const [open, setOpen] = useState(false);
  const [today, setToday] = useState(null);
  useEffect(() => setToday(DAYS[new Date().getDay()]), []);

  const todays = hours.find((h) => h.day === today) || hours[0];

  return (
    <div className="mt-1">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="inline-flex items-center gap-1 text-[14px]">
        <span className="font-semibold text-action-500">Open</span>
        <span className="text-ink-900">&middot; {todays.hours}</span>
        <ChevronDown size={16} className={`text-ink-700 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul className="mt-2 max-w-xs space-y-1 rounded-xl bg-white p-3 text-[13px] shadow-card">
          {hours.map((h) => (
            <li key={h.day} className={`flex justify-between gap-4 ${h.day === today ? 'font-semibold text-ink-900' : 'text-ink-600'}`}>
              <span>{h.day}</span>
              <span>{h.hours}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
