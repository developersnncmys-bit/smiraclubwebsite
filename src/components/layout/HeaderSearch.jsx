'use client';

import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useHeaderSearch } from '@/lib/headerSearch';
import { searchHref } from '@/lib/searchRoute';

/**
 * The search, kept within reach after it has scrolled away.
 *
 * The home page opens with the search panel and then moves on to offers,
 * services and stories, so by the second screenful the one thing a
 * member came to do is somewhere above them. This is an icon, not a
 * second search bar: a bar across the header is the panel said twice,
 * and it pushed the page down every time it appeared.
 *
 * It shows on the pages that have a panel and nowhere else. With a
 * destination already typed it runs that search; with the box still
 * empty there is nothing to search for, so it goes back to the panel
 * with the cursor in it.
 */
export default function HeaderSearch({ desktop = false }) {
  const router = useRouter();
  const search = useHeaderSearch();

  if (!search) return null;

  const go = () => {
    const href = searchHref(search);
    if (href) {
      router.push(href);
      return;
    }
    const panel = document.getElementById('home-search');
    panel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // After the scroll, and without scrolling itself: a plain focus()
    // moves the page to suit the input and lands it halfway down.
    window.setTimeout(
      () => document.getElementById('home-destination')?.focus({ preventScroll: true }),
      500,
    );
  };

  return (
    <button
      type="button"
      onClick={go}
      aria-label="Search"
      className={
        desktop
          ? 'grid h-10 w-10 place-items-center rounded-full border border-surface-line text-ink-600 transition hover:bg-surface-soft'
          : 'p-2 text-ink-700'
      }
    >
      <Search size={desktop ? 18 : 21} />
    </button>
  );
}
