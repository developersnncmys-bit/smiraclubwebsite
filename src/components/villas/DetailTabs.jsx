'use client';

import { useEffect, useRef, useState } from 'react';
import { villaDetailTabs } from '@/lib/content';

/**
 * Overview / Amenities / Reviews / Location / Stay Guidelines.
 *
 * The design shows every section on one scroll, so these move the page to a
 * section rather than swapping panels — and the underline follows whichever
 * section you have actually scrolled to, so the bar never lies about where
 * you are.
 *
 * Three things keep the bar usable rather than merely present:
 *
 * - It sticks under the site header, not at the top of the window, where
 *   the header (also sticky, and above it) used to cover it completely.
 * - The lit tab is scrolled into the rail. On a phone the last tab or two sit
 *   past the right edge, and a tab you cannot see lit up tells you nothing.
 * - At the foot of the page the last tab lights, because the final section is
 *   too short ever to cross the band the observer watches.
 */
export default function DetailTabs({ tabs = villaDetailTabs }) {
  const [active, setActive] = useState(tabs[0].key);
  const bar = useRef(null);
  const rail = useRef(null);

  useEffect(() => {
    const sections = tabs.map((t) => document.getElementById(t.key)).filter(Boolean);
    if (!sections.length) return undefined;

    const spy = new IntersectionObserver(
      (entries) => {
        const seen = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (seen[0]) setActive(seen[0].target.id);
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    sections.forEach((s) => spy.observe(s));

    const atFoot = () => {
      const bottom = window.innerHeight + window.scrollY;
      if (bottom >= document.documentElement.scrollHeight - 4) {
        setActive(sections[sections.length - 1].id);
      }
    };
    window.addEventListener('scroll', atFoot, { passive: true });

    return () => {
      spy.disconnect();
      window.removeEventListener('scroll', atFoot);
    };
  }, [tabs]);

  // Bring the lit tab into the rail — horizontally only, so the page itself
  // is never nudged.
  useEffect(() => {
    const strip = rail.current;
    const tab = strip?.querySelector(`[data-tab="${active}"]`);
    if (!strip || !tab) return;
    const left = tab.offsetLeft - (strip.clientWidth - tab.offsetWidth) / 2;
    strip.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  }, [active]);

  /** Land the section just under the bar, wherever the bar happens to sit. */
  const go = (e, key) => {
    const target = document.getElementById(key);
    if (!target) return;
    e.preventDefault();
    // Once the scroll lands the bar is stuck under the header, so measure
    // from that resting place rather than wherever the bar is right now.
    const offset = parseFloat(getComputedStyle(bar.current).top) + bar.current.offsetHeight + 12;
    window.scrollTo({ top: window.scrollY + target.getBoundingClientRect().top - offset, behavior: 'smooth' });
    history.replaceState(null, '', `#${key}`);
    setActive(key);
  };

  return (
    <nav
      ref={bar}
      aria-label="On this page"
      className="sticky top-14 z-30 border-b border-surface-line bg-white lg:top-[68px]"
    >
      <div className="shell">
        <div ref={rail} className="rail gap-6 sm:gap-8">
          {tabs.map((t) => {
            const on = t.key === active;
            return (
              <a
                key={t.key}
                href={`#${t.key}`}
                data-tab={t.key}
                onClick={(e) => go(e, t.key)}
                aria-current={on ? 'true' : undefined}
                className={`shrink-0 border-b-2 py-3.5 text-[14px] font-semibold transition ${
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
