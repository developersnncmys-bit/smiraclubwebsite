import Link from 'next/link';
import Section from '@/components/ui/Section';
import StoryCard from '@/components/home/StoryCard';
import { stories } from '@/lib/content';
import { image } from '@/lib/images';

/**
 * Watch & Explore. Two across on a phone as drawn, four on a desktop, with
 * the caption sitting on the image for a clip and under it for a story.
 *
 * The photographs are resolved here because `image()` reads the
 * filesystem; the card itself runs in the browser, so that play plays.
 */
export default function WatchExplore() {
  return (
    <div className="shell">
      <Section title="Watch & Explore">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} photo={image(story.image)} />
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
