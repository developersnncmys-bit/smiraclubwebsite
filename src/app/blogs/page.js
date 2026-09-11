import ScreenBar from '@/components/ui/ScreenBar';
import BlogsScreen from '@/components/more/BlogsScreen';
import { blogHero, blogs } from '@/lib/content';
import { image } from '@/lib/images';

export const metadata = {
  title: 'Blogs',
  description: 'Travel guides, hidden destinations and expert tips for your next trip.',
};

export default function Page() {
  // Resolved here because image() reads the filesystem.
  const art = Object.fromEntries(blogs.map((b) => [b.id, image(b.image)]));

  return (
    <>
      <ScreenBar title="Blogs" backHref="/more" />
      <BlogsScreen hero={image(blogHero.image)} art={art} />
    </>
  );
}
