import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';
import Section from '@/components/ui/Section';
import { stories } from '@/lib/content';
import { image } from '@/lib/images';

/**
 * Watch & Explore. Two across on a phone as drawn, four on a desktop, with
 * the caption sitting on the image for a clip and under it for a story.
 */
export default function WatchExplore() {
  return (
    <div className="shell">
      <Section title="Watch & Explore">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
          {stories.map((story) => (
            <Link key={story.id} href={`/stories/${story.id}`} className="group overflow-hidden rounded-2xl bg-white shadow-card">
              <div className="relative aspect-[4/5] lg:aspect-[3/4]">
                <Image
                  src={image(story.image)}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />

                {story.video && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-900 transition group-hover:scale-110">
                      <Play size={18} className="ml-0.5 fill-current" />
                    </span>
                    <p className="absolute inset-x-0 bottom-0 p-3 text-[13px] font-bold leading-tight text-white lg:text-sm">
                      {story.title}
                    </p>
                  </>
                )}
              </div>

              {!story.video && (
                <div className="p-3">
                  <p className="text-[13px] font-bold leading-tight text-ink-900 lg:text-sm">{story.title}</p>
                  <p className="mt-1.5 text-[11px] text-ink-400">{story.author}</p>
                </div>
              )}
            </Link>
          ))}
        </div>

        <div className="mt-5">
          <Link href="/stories" className="btn-primary w-full py-4 text-base lg:mx-auto lg:w-auto lg:px-12">
            View More
          </Link>
        </div>
      </Section>
    </div>
  );
}
