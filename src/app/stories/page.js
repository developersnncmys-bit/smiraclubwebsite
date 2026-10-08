import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';
import PageHead from '@/components/ui/PageHead';
import { stories } from '@/lib/content';
import { image } from '@/lib/images';

export const metadata = {
  title: 'Watch and explore',
  description: 'Films and journals from members and the desk.',
};

/**
 * Watch and explore.
 *
 * This said the screen would be built once its design landed, which it
 * had — the home page has been drawing these cards all along. It is the
 * same four, at a size worth looking at, and each one opens.
 */
export default function Page() {
  return (
    <>
      <PageHead title="Watch and explore" subtitle="Films and journals from members and the desk." />

      <div className="shell py-6 pb-12">
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-6">
          {stories.map((story) => (
            <li key={story.id}>
              <Link
                href={`/stories/${story.id}`}
                className="group block overflow-hidden rounded-2xl bg-white shadow-card transition hover:shadow-lift"
              >
                <div className="relative aspect-[4/5] lg:aspect-[3/4]">
                  <Image
                    src={image(story.image)}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  {story.video && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-900 transition group-hover:scale-110">
                        <Play size={20} className="ml-0.5 fill-current" />
                      </span>
                    </>
                  )}
                </div>

                <div className="p-3.5">
                  <p className="text-[14px] font-bold leading-tight text-ink-900">{story.title}</p>
                  <p className="mt-1 text-[13px] leading-snug text-ink-600">{story.blurb}</p>
                  <p className="mt-2 text-[11px] text-ink-400">{story.author}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
