'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronDown, Clock } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import { blogCategories, blogHero, blogs } from '@/lib/content';
import { toSrc } from '@/lib/imageSlot';

/** One blog, as both rails draw it. The whole card opens the article. */
export function BlogCard({ blog }) {
  return (
    <Link href={`/blogs/${blog.id}`} className="card group flex gap-4 overflow-hidden p-3.5 transition hover:shadow-lift sm:p-4">
      <span className="relative h-[140px] w-[110px] shrink-0 overflow-hidden rounded-xl sm:w-[140px]">
        <Image src={toSrc(blog.image)} alt="" fill sizes="140px" className="object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-0 top-3 bg-[#1b1464] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-white">
          {blog.tag}
        </span>
      </span>

      <span className="flex min-w-0 flex-1 flex-col">
        <span className="line-clamp-2 text-[15px] font-bold leading-snug text-ink-900">{blog.title}</span>
        <span className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-ink-500">{blog.excerpt}</span>
        <span className="mt-auto flex items-center gap-2 pt-3 text-[12px] text-ink-500">
          {blog.date}
          <span aria-hidden="true">&middot;</span>
          <Clock size={12} />
          {blog.readMins} min read
        </span>
        <span className="mt-1.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-action-500">
          Read More
          <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
        </span>
      </span>
    </Link>
  );
}

/** A titled rail. Two cards to start; View All opens the rest in place. */
function Rail({ title, items }) {
  const [all, setAll] = useState(false);
  if (items.length === 0) return null;
  const shown = all ? items : items.slice(0, 2);

  return (
    <section className="pt-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-ink-900 lg:text-2xl">{title}</h2>
        {items.length > 2 && (
          <button
            type="button"
            onClick={() => setAll((a) => !a)}
            aria-expanded={all}
            className="inline-flex shrink-0 items-center gap-2 text-[14px] font-semibold text-ink-900"
          >
            {all ? 'View Less' : 'View All'}
            <span className="grid h-6 w-6 place-items-center rounded-full bg-action-500 text-white">
              <ChevronDown size={15} className={`transition ${all ? 'rotate-180' : ''}`} />
            </span>
          </button>
        )}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:gap-6">
        {shown.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </section>
  );
}

/**
 * Blogs.
 *
 * The category chips filter both rails at once rather than only the first —
 * a reader who picks Hotel Stays does not want Popular still showing them
 * travel guides.
 */
export default function BlogsScreen({ hero, art = {} }) {
  const [category, setCategory] = useState('all');

  const shown = useMemo(
    () =>
      (category === 'all' ? blogs : blogs.filter((b) => b.category === category)).map((b) => ({
        ...b,
        image: art[b.id] || b.image,
      })),
    [category, art],
  );

  return (
    <div className="pb-10 lg:pb-16">
      {/* -- What this is ------------------------------------------- */}
      <section className="relative overflow-hidden bg-[#1b1464]">
        <Image src={toSrc(hero || blogHero.image)} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1b1464]/95 via-[#1b1464]/70 to-transparent" />
        <div className="relative shell py-10 lg:py-20">
          <div className="max-w-[16rem] sm:max-w-sm lg:max-w-lg">
            <h1 className="text-[23px] font-extrabold leading-tight text-white lg:text-4xl">{blogHero.title}</h1>
            <p className="mt-3 text-[14px] leading-snug text-white/90 lg:text-lg">{blogHero.body}</p>
          </div>
        </div>
      </section>

      <div className="shell">
        {/* -- Narrow them ---------------------------------------- */}
        <section className="pt-6">
          <h2 className="text-xl font-bold text-ink-900">Categories</h2>
          <div className="rail mt-4 gap-3">
            {blogCategories.map((c) => {
              const on = c.key === category;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setCategory(c.key)}
                  aria-pressed={on}
                  className={`inline-flex shrink-0 items-center gap-2.5 rounded-xl border px-4 py-2.5 text-[14px] font-semibold transition ${
                    on
                      ? 'border-action-500 bg-brand-50 text-action-500'
                      : 'border-surface-line bg-white text-ink-700 hover:bg-surface-soft'
                  }`}
                >
                  <Icon name={c.icon} size={17} strokeWidth={1.9} />
                  {c.label}
                </button>
              );
            })}
          </div>
        </section>

        {shown.length === 0 ? (
          <p className="card mt-8 p-10 text-center text-[14px] text-ink-500">Nothing in that category yet.</p>
        ) : (
          <>
            <Rail key={`latest-${category}`} title="Latest Blogs" items={shown.filter((b) => b.latest)} />
            <Rail key={`popular-${category}`} title="Popular Blogs" items={shown.filter((b) => b.popular)} />
          </>
        )}
      </div>
    </div>
  );
}
