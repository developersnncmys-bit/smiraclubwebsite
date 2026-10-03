import ScreenBar from '@/components/ui/ScreenBar';
import PackagesScreen from '@/components/packages/PackagesScreen';
import { packages } from '@/lib/content';
import { image } from '@/lib/images';
import DeskPicks from '@/components/desk/DeskPicks';
import { deskItems } from '@/lib/desk';

export const metadata = {
  title: 'Packages',
  description: 'Domestic and international holiday packages at Smira Club member prices.',
};

/** Reached from the Package tile, the footer and View More Packages. */
export default async function Page({ searchParams }) {
  /** Whatever the desk has put into Travel Inventory under Packages. */
  const picks = await deskItems('Packages');

  // What they typed in the Package tab on the home screen, so the search
  // they made is the search this screen opens on.
  const params = (await searchParams) || {};
  const destination = String(params.destination || '').trim();

  // Resolved here because image() reads the filesystem.
  const list = packages.map((p) => ({ ...p, image: image(p.image) }));
  return (
    <>
      <ScreenBar title="Packages" backHref="/" />
      <PackagesScreen packages={list} initialQuery={destination} />
      <DeskPicks items={picks} title="More packages from Smira" />
    </>
  );
}
