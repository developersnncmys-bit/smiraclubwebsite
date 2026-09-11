'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, ChevronRight } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import { blogCategories, blogHero, blogs } from '@/lib/content';
import { toSrc } from '@/lib/imageSlot';

/** One blog, as both rails draw it. */
function BlogCard({ blog }) {
  return (
    <article className="card flex gap-4 overflow-hidden p-3.5 sm:p-4">
      <span className="relative h-[150px] w-[110px] shrink-0 overflow-hidden rounded-xl sm:w-[130px]">
        <Image src={toSrc(blog.image)} alt="" fill sizes="130px" className="object-cover" />
        <span className="absolute left-0 top-3 bg-[#1b1464] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-white">
          {blog.tag}
        </span>
      </span>

      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="text-[15px] font-bold leading-snug text-ink-900">{blog.title}</h3>
        <p className="mt-2 line-clamp-2 text-[14px] leading-snug text-ink-500">{blog.excerpt}</p>
        <p className="mt-auto pt-3 text-[14px] text-ink-600">{blog.date}</p>

        <button
          type="button"
          className="mt-1.5 inline-flex items-center gap-1.5 self-start text-[14px] font-semibold text-action-500 underline"
        >
          Read More
          <ArrowRight size={16} />
        </button>
      </div>
    </article>
  );
}

/** A titled rail with its own View All. */
function Rail({ title, items }) {
  if (items.length === 0) return null;

  return (
    <section className="pt-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-ink-900 lg:text-2xl">{title}</h2>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-2 text-[15px] font-semibold text-ink-900"
        >
          View All
          <span className="grid h-6 w-6 place-items-center rounded-full bg-action-500 text-white">
            <ChevronRight size={15} />
          </span>
        </button>
      </div>

      <div className="mt-4 space-y-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:space-y-0">
        {items.map((blog) => (
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
    <div className="pb-10">
      {/* -- What this is ------------------------------------------- */}
      <section className="relative overflow-hidden bg-[#2f9ee0]">
        <div className="absolute inset-y-0 right-0 w-[58%]">
          <Image
            src={toSrc(hero || blogHero.image)}
            alt=""
            fill
            sizes="58vw"
            className="object-cover"
          />
        </div>
        <div className="relative shell py-9 lg:py-16">
          <div className="max-w-[13rem] sm:max-w-sm lg:max-w-md">
            <h1 className="text-[23px] font-extrabold leading-tight text-white lg:text-4xl">
              {blogHero.title}
            </h1>
            <p className="mt-3 text-[14px] leading-snug text-white/95 lg:text-lg">
              {blogHero.body}
            </p>
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
                  className={`inline-flex shrink-0 items-center gap-2.5 rounded-xl border px-4 py-3 text-[15px] font-semibold transition ${
                    on
                      ? 'border-action-500 bg-brand-50 text-action-500'
                      : 'border-surface-line bg-white text-ink-700 hover:bg-surface-soft'
                  }`}
                >
                  <Icon name={c.icon} size={18} strokeWidth={1.9} />
                  {c.label}
                </button>
              );
            })}
          </div>
        </section>

        {shown.length === 0 ? (
          <p className="card mt-8 p-10 text-center text-[14px] text-ink-500">
            Nothing in that category yet.
          </p>
        ) : (
          <>
            <Rail title="Latest Blogs" items={shown.filter((b) => b.latest)} />
            <Rail title="Popular Blogs" items={shown.filter((b) => b.popular)} />
          </>
        )}
      </div>
    </div>
  );
}
