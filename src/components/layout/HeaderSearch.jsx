'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Search } from 'lucide-react';
import { useHeaderSearch } from '@/lib/headerSearch';
import { searchHref } from '@/lib/searchRoute';
import { shortDate } from '@/lib/format';

/**
 * The search, kept within reach after it has scrolled away.
 *
 * The home page opens with the panel and then moves on to offers,
 * services and stories, and by the second screenful the one thing a
 * member came to do is somewhere above them. This is the same search,
 * folded into the header: it appears when the panel leaves the top of
 * the screen and goes away again when it comes back, so nobody has two
 * search bars in front of them at once.
 *
 * It shows the panel's own values rather than keeping any of its own.
 * Tapping the bar returns to the panel with the destination focused;
 * the button searches outright, once there is somewhere to search for.
 */
export default function HeaderSearch() {
  const router = useRouter();
  const search = useHeaderSearch();
  const [past, setPast] = useState(false);

  /*
   * Watch the panel itself rather than a scroll distance. A fixed number
   * of pixels is wrong on every screen it was not measured on, and wrong
   * again the moment the hero above it changes height.
   */
  useEffect(() => {
    if (!search) return undefined;
    const panel = document.getElementById('home-search');
    if (!panel) return undefined;

    const watch = new IntersectionObserver(
      ([entry]) => setPast(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    watch.observe(panel);
    return () => watch.disconnect();
  }, [search]);

  const show = Boolean(search) && past;

  /** Back to the real panel, with the cursor where the typing goes. */
  const openPanel = () => {
    const panel = document.getElementById('home-search');
    panel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // After the scroll, or the focus drags the page back up mid-flight.
    window.setTimeout(() => document.getElementById('home-destination')?.focus(), 420);
  };

  const go = () => {
    const href = searchHref(search || {});
    if (href) router.push(href);
    else openPanel();
  };

  const where = search?.destination?.trim();

  return (
    <div
      aria-hidden={!show}
      className={`overflow-hidden transition-all duration-200 ${
        show ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div className="flex items-center gap-2 pb-2 lg:pb-2.5">
        <button
          type="button"
          onClick={openPanel}
          tabIndex={show ? 0 : -1}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-surface-line bg-surface-soft/70 px-3 py-2 text-left transition hover:bg-surface-soft lg:px-4 lg:py-2.5"
        >
          <MapPin size={15} className="shrink-0 text-action-500" />
          <span
            className={`min-w-0 truncate text-[13px] font-bold lg:text-[14px] ${
              where ? 'text-ink-900' : 'text-ink-500'
            }`}
          >
            {where || 'Where are you going?'}
          </span>
          {search?.from && (
            <span className="ml-auto shrink-0 truncate text-[11px] font-semibold text-ink-500 max-[359px]:hidden lg:text-[12px]">
              {shortDate(search.from)} – {shortDate(search.to)}
              <span className="hidden sm:inline"> · {search.guests}</span>
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={go}
          tabIndex={show ? 0 : -1}
          aria-label="Search"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-action-500 text-white transition hover:bg-action-600 lg:h-10 lg:w-10"
        >
          <Search size={16} />
        </button>
      </div>
    </div>
  );
}
