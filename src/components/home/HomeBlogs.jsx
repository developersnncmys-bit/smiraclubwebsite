import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import Section from '@/components/ui/Section';

/**
 * The latest few articles, on the home page.
 *
 * The desk writes guides in the panel and they landed on /blogs, which
 * is three taps away under More — so a piece published on Monday was
 * read by whoever already knew to go looking. Four of them sit here
 * instead, next to Watch & Explore, where the rest of the reading is.
 *
 * The photographs arrive resolved: `image()` reads the filesystem and
 * cannot run in a card.
 */
export default function HomeBlogs({ items = [] }) {
  if (!items.length) return null;

  return (
    <div className="shell">
      <Section title="Stories and Guides">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
          {items.map((blog) => (
            <Link
              key={blog.id}
              href={`/blogs/${blog.id}`}
              className="card group flex flex-col overflow-hidden transition hover:shadow-lift"
            >
              <span className="relative block aspect-[4/3] w-full shrink-0 overflow-hidden">
                <Image
                  src={blog.photo}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                {blog.tag && (
                  <span className="absolute left-0 top-2.5 bg-[#1b1464] px-2 py-1 text-[9.5px] font-bold uppercase tracking-[0.06em] text-white">
                    {blog.tag}
                  </span>
                )}
              </span>

              <span className="flex flex-1 flex-col p-3 lg:p-4">
                <span className="line-clamp-2 text-[12.5px] font-bold leading-snug text-ink-900 lg:text-[15px]">
                  {blog.title}
                </span>

                <span className="mt-auto flex items-center gap-1.5 pt-2 text-[10.5px] text-ink-500 lg:text-[12px]">
                  {blog.date}
                  {blog.readMins ? (
                    <>
                      <span aria-hidden="true">&middot;</span>
                      <Clock size={11} />
                      {blog.readMins} min
                    </>
                  ) : null}
                </span>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-5">
          <Link
            href="/blogs"
            className="btn-line mx-auto flex w-full items-center justify-center gap-2 py-3 text-[14px] lg:w-auto lg:px-10"
          >
            Read all stories
            <ArrowRight size={16} />
          </Link>
        </div>
      </Section>
    </div>
  );
}
