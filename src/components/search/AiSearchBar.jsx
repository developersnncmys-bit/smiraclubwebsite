'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Search } from 'lucide-react';

/**
 * Ask for a trip in a sentence.
 *
 * The prompt cards are not decoration: nobody arriving at an empty box with a
 * blinking cursor knows what this thing will accept. Tapping one fills the box
 * rather than firing a search straight off, so the shape of a good question is
 * visible and still editable — which is how somebody learns what to type the
 * second time.
 */
export default function AiSearchBar({ placeholder, prompts }) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const ask = (e) => {
    e.preventDefault();
    const text = query.trim();
    if (text) router.push(`/search?q=${encodeURIComponent(text)}`);
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form
        onSubmit={ask}
        className="flex items-center gap-3 rounded-full bg-white px-4 py-2.5 shadow-card sm:px-5 sm:py-3"
      >
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-900 transition hover:bg-surface-soft"
        >
          <ArrowLeft size={22} strokeWidth={2.2} />
        </button>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`“${placeholder}”`}
          aria-label="Describe the trip you want"
          className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[16px] font-medium text-ink-900 outline-none placeholder:text-ink-500"
        />

        <button
          type="submit"
          aria-label="Search"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-action-500 transition hover:bg-brand-50"
        >
          <Search size={22} strokeWidth={2.2} />
        </button>
      </form>

      <section className="card mt-5 p-5 sm:p-6">
        <h2 className="text-[18px] font-bold text-ink-900">Try These Prompts</h2>

        <ul className="mt-4 space-y-4">
          {prompts.map((p) => (
            <li key={p.key}>
              <button
                type="button"
                onClick={() => setQuery(p.text)}
                className="flex w-full items-center gap-4 rounded-xl text-left transition hover:bg-surface-soft"
              >
                <span className="relative h-[62px] w-[78px] shrink-0 overflow-hidden rounded-xl">
                  <Image src={p.src} alt="" fill sizes="78px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1 text-[16px] font-bold leading-snug text-ink-900">
                  {p.text}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
