import ScreenBar from '@/components/ui/ScreenBar';
import ParksScreen from '@/components/offers/ParksScreen';
import { gameKinds, gameZones } from '@/lib/content';
import { image } from '@/lib/images';

export const metadata = {
  title: 'Games Zone',
  description: 'Member prices on arcades, bowling, VR and e-sports lounges.',
};

/**
 * Games Zone — reached from the services tiles.
 *
 * The same list the parks use: a switch for the kind of place, a search as
 * you type, and a card per venue with its member offer and From price.
 */
export default function Page() {
  const list = gameZones.map((g) => ({ ...g, images: g.images.map((slot) => image(slot)) }));
  return (
    <>
      <ScreenBar title="Games Zone" backHref="/" />
      <ParksScreen
        parks={list}
        kinds={gameKinds}
        basePath="/games"
        title="Games Zone"
        searchLabels={{
          arcade: 'Search arcades or location',
          bowling: 'Search bowling & sports or location',
          vr: 'Search VR & e-sports or location',
        }}
        similarLabel="Similar game zones"
        empty="No game zones match that yet."
      />
    </>
  );
}
