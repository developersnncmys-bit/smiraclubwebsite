import ScreenBar from '@/components/ui/ScreenBar';
import GalleryScreen from '@/components/more/GalleryScreen';
import { galleryPhotos } from '@/lib/content';
import { image } from '@/lib/images';

export const metadata = {
  title: 'Gallery',
  description: 'Photos from Smira Club stays, destinations and experiences.',
};

export default function Page() {
  // Resolved here because image() reads the filesystem.
  const photos = galleryPhotos.map((p) => ({ ...p, src: image(p.slot) }));
  return (
    <>
      <ScreenBar title="Gallery" backHref="/more" />
      <GalleryScreen photos={photos} />
    </>
  );
}
