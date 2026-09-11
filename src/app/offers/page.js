import ScreenBar from '@/components/ui/ScreenBar';
import OffersScreen from '@/components/offers/OffersScreen';
import { packageOffers, promoOffers } from '@/lib/content';
import { image } from '@/lib/images';

export const metadata = {
  title: 'Offers',
  description:
    'Package prices, weekend deals and partner offers on restaurants and water parks.',
};

/** Reached from View All on Grab Offers, and from the services tiles. */
export default function Page() {
  // Resolved here because image() reads the filesystem.
  const art = Object.fromEntries(
    [...packageOffers, ...promoOffers].map((o) => [o.id, image(o.image)]),
  );

  return (
    <>
      <ScreenBar title="Offers" backHref="/" />
      <OffersScreen art={art} />
    </>
  );
}
