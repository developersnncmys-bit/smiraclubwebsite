'use client';

import { useState } from 'react';
import { Check, Info } from 'lucide-react';
import { languages } from '@/lib/content';

/**
 * Language Settings.
 *
 * There is no design for this screen yet, so it is built to the same shape
 * as the other account lists. Nothing is translated behind it — picking a
 * language records the preference and the screen says so rather than
 * appearing to switch and then not switching.
 */
export default function LanguageSettings() {
  const [chosen, setChosen] = useState('en');

  return (
    <div className="shell py-5">
      <ul className="card divide-y divide-surface-line overflow-hidden">
        {languages.map((lang) => {
          const on = lang.code === chosen;
          return (
            <li key={lang.code}>
              <button
                type="button"
                onClick={() => setChosen(lang.code)}
                aria-pressed={on}
                className="flex w-full items-center gap-4 px-4 py-4 text-left transition hover:bg-surface-soft sm:px-5"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold text-ink-900">
                    {lang.label}
                  </span>
                  {lang.native !== lang.label && (
                    <span className="block text-[14px] text-ink-500">{lang.native}</span>
                  )}
                </span>

                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition ${
                    on ? 'border-action-500 bg-action-500 text-white' : 'border-surface-line'
                  }`}
                >
                  {on && <Check size={14} strokeWidth={3} />}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 flex gap-2.5 text-[14px] leading-snug text-ink-500">
        <Info size={18} className="mt-0.5 shrink-0 text-ink-400" />
        Only English is translated so far. Choosing another language records the preference and
        the site switches over as each translation lands.
      </p>
    </div>
  );
}
