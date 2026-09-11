'use client';

import { useEffect, useState } from 'react';
import { villaDetailTabs } from '@/lib/content';

/**
 * Overview / Amenities / Reviews / Location.
 *
 * The design shows every section on one scroll, so these move the page to a
 * section rather than swapping panels — and the underline follows whichever
 * section you have actually scrolled to, so the bar never lies about where
 * you are.
 */
export default function DetailTabs({ tabs = villaDetailTabs }) {
  const [active, setActive] = useState(tabs[0].key);

  useEffect(() => {
    const sections = tabs
      .map((t) => document.getElementById(t.key))
      .filter(Boolean);
    if (!sections.length) return undefined;

    const spy = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting).sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
        );
        if (seen[0]) setActive(seen[0].target.id);
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );

    sections.forEach((s) => spy.observe(s));
    return () => spy.disconnect();
  }, [tabs]);

  return (
    <nav
      aria-label="On this page"
      className="sticky top-0 z-30 border-b border-surface-line bg-white"
    >
      <div className="shell">
        <div className="rail gap-6 sm:gap-8">
          {tabs.map((t) => {
            const on = t.key === active;
            return (
              <a
                key={t.key}
                href={`#${t.key}`}
                aria-current={on ? 'true' : undefined}
                className={`shrink-0 border-b-2 py-3.5 text-[15px] font-semibold transition ${
                  on
                    ? 'border-action-500 text-action-500'
                    : 'border-transparent text-ink-500 hover:text-ink-700'
                }`}
              >
                {t.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
