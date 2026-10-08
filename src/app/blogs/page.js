import ScreenBar from '@/components/ui/ScreenBar';
import BlogsScreen from '@/components/more/BlogsScreen';
import { blogHero, blogs } from '@/lib/content';
import { deskBlogs } from '@/lib/desk';
import { image } from '@/lib/images';

export const metadata = {
  title: 'Blogs',
  description: 'Travel guides, hidden destinations and expert tips for your next trip.',
};

/**
 * Blogs.
 *
 * Two sources, one screen: what the desk has published from the admin panel,
 * and the articles the site ships with. The desk's come first — somebody who
 * has just published a piece should find it at the top rather than buried
 * under last season's guides — and a post whose address matches a bundled
 * one wins, so an article can be taken over by the desk without leaving a
 * duplicate behind.
 *
 * The photographs are resolved here because image() reads the filesystem.
 * It passes an address straight through, so an uploaded cover and a bundled
 * slot both come out as something <Image> can load.
 */
export default async function Page() {
  const desk = await deskBlogs();
  const taken = new Set(desk.map((b) => b.id));
  const items = [...desk, ...blogs.filter((b) => !taken.has(b.id))];

  const art = Object.fromEntries(items.map((b) => [b.id, image(b.image)]));

  return (
    <>
      <ScreenBar title="Blogs" backHref="/more" />
      <BlogsScreen hero={image(blogHero.image)} art={art} items={items} />
    </>
  );
}
