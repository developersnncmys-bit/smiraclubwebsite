import Link from 'next/link';
import { Sparkles } from 'lucide-react';

/**
 * The floating way into AI Search, in the home screen's bottom-right corner.
 * Desktop only: on a phone AI Search is a tab in the bottom bar, after
 * Wishlist, and the tab bar does not exist on a desktop.
 */
export default function AiSearchFab() {
  return (
    <Link
      href="/search"
      aria-label="AI Search"
      className="fixed bottom-8 right-8 z-30 hidden lg:inline-flex items-center gap-2 rounded-full bg-action-500 px-4 py-3 text-[13px] font-bold text-white shadow-lift transition hover:bg-action-600 active:scale-95 lg:bottom-8 lg:right-8 lg:px-5 lg:py-3.5 lg:text-[14px]"
    >
      <Sparkles size={19} strokeWidth={2.2} />
      <span className="hidden min-[380px]:inline">AI Search</span>
    </Link>
  );
}
