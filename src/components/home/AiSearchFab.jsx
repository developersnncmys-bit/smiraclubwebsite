import Link from 'next/link';
import { Sparkles } from 'lucide-react';

/**
 * The floating way into AI Search.
 *
 * It sits in the bottom-right corner over whatever is scrolling past: clear
 * of the tab bar on a phone, and on the page's own margin on a desktop. The
 * label is there because a lone sparkle does not say "search" to anyone who
 * has not used the app before; it collapses to just the mark on the narrowest
 * phones, where the corner has no room for words.
 *
 * This renders on the home screen only, and it is the one way into AI Search:
 * the header link is gone by request, and the tab bar never had it.
 */
export default function AiSearchFab() {
  return (
    <Link
      href="/search"
      aria-label="AI Search"
      className="fixed right-4 z-30 inline-flex items-center gap-2 rounded-full bg-action-500 px-4 py-3 text-[13px] font-bold text-white shadow-lift transition bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] hover:bg-action-600 active:scale-95 lg:bottom-8 lg:right-8 lg:px-5 lg:py-3.5 lg:text-[14px]"
    >
      <Sparkles size={19} strokeWidth={2.2} />
      <span className="hidden min-[380px]:inline">AI Search</span>
    </Link>
  );
}
