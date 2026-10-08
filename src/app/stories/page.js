import PageHead from '@/components/ui/PageHead';
import StoryCard from '@/components/home/StoryCard';
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
              <StoryCard
                story={story}
                photo={image(story.image)}
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
              <p className="mt-2 px-1 text-[13px] leading-snug text-ink-600">{story.blurb}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
