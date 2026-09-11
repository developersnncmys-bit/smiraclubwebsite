'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * One question and its answer.
 *
 * Built on <details>/<summary> rather than a div and a click handler: it
 * opens without JavaScript, the browser gives it the right keyboard and
 * screen-reader behaviour for free, and find-in-page can reach text inside a
 * closed answer. The state we keep is only for turning the chevron.
 */
export default function Accordion({ question, answer, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <details
      open={defaultOpen}
      onToggle={(e) => setOpen(e.currentTarget.open)}
      className="card overflow-hidden"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
        <span className="text-[17px] font-bold leading-snug text-ink-900">{question}</span>
        <ChevronDown
          size={20}
          className={`shrink-0 text-ink-600 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </summary>

      <p className="px-4 pb-5 text-[16px] leading-relaxed text-ink-600 sm:px-5">{answer}</p>
    </details>
  );
}
