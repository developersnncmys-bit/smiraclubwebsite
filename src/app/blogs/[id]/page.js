import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CalendarDays, Clock } from 'lucide-react';
import ScreenBar from '@/components/ui/ScreenBar';
import ShareButton from '@/components/more/ShareButton';
import { BlogCard } from '@/components/more/BlogsScreen';
import { blogs } from '@/lib/content';
import { image } from '@/lib/images';

export function generateStaticParams() {
  return blogs.map((b) => ({ id: b.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const blog = blogs.find((b) => b.id === id);
  return blog ? { title: blog.title, description: blog.excerpt } : { title: 'Blog not found' };
}

/**
 * One article: the photo, the headline, the read, and more to read next.
 * Set at a comfortable reading width on a desktop rather than across the
 * whole screen, with the related posts in a rail beside it.
 */
export default async function Page({ params }) {
  const { id } = await params;
  const blog = blogs.find((b) => b.id === id);
  if (!blog) notFound();

  // Same category first, then the rest, never the article itself.
  const related = [
    ...blogs.filter((b) => b.id !== blog.id && b.category === blog.category),
    ...blogs.filter((b) => b.id !== blog.id && b.category !== blog.category),
  ]
    .slice(0, 3)
    .map((b) => ({ ...b, image: image(b.image) }));

  return (
    <>
      <ScreenBar title="Blog" backHref="/blogs" />

      <article className="pb-12 lg:pb-16">
        <div className="relative h-[220px] w-full sm:h-[320px] lg:h-[420px]">
          <Image src={image(blog.image)} alt={blog.title} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        </div>

        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="relative -mt-10 rounded-2xl bg-white p-5 shadow-card sm:p-7 lg:-mt-24 lg:p-10">
                <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-[12px] font-bold uppercase tracking-[0.06em] text-action-500">
                  {blog.tag}
                </span>
                <h1 className="mt-3 text-[22px] font-extrabold leading-tight text-ink-900 lg:text-3xl">{blog.title}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-ink-500">
                  <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} />{blog.date}</span>
                  <span className="inline-flex items-center gap-1.5"><Clock size={14} />{blog.readMins} min read</span>
                  <ShareButton title={blog.title} href={`/blogs/${blog.id}`} className="ml-auto" />
                </div>

                <p className="mt-6 border-l-4 border-action-500 pl-4 text-[15px] font-medium leading-relaxed text-ink-700 lg:text-[17px]">
                  {blog.excerpt}
                </p>

                <div className="mt-6 space-y-6">
                  {blog.body.map((block, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <section key={i}>
                      {block.h && <h2 className="text-lg font-bold text-ink-900 lg:text-xl">{block.h}</h2>}
                      {block.p?.map((para) => (
                        <p key={para} className="mt-2 text-[15px] leading-relaxed text-ink-700 lg:text-[16px]">{para}</p>
                      ))}
                      {block.list && (
                        <ul className="mt-3 space-y-2">
                          {block.list.map((item) => (
                            <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-ink-700 lg:text-[16px]">
                              <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-action-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </section>
                  ))}
                </div>

                <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl bg-gradient-to-r from-[#eef3fc] to-[#dde8fb] p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[16px] font-bold text-ink-900">Ready to plan it?</p>
                    <p className="text-[13px] text-ink-600">Members get up to 40% off stays, packages and experiences.</p>
                  </div>
                  <Link href="/" className="btn-primary shrink-0 gap-2 rounded-xl px-6 py-3 text-[14px] normal-case tracking-normal">
                    Explore Smira Club
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

            {related.length > 0 && (
              <aside className="lg:col-span-4 lg:pt-8">
                <h2 className="text-xl font-bold text-ink-900">More to read</h2>
                <div className="mt-4 grid gap-4">
                  {related.map((b) => (
                    <BlogCard key={b.id} blog={b} />
                  ))}
                </div>
              </aside>
            )}
          </div>
        </div>
      </article>
    </>
  );
}
