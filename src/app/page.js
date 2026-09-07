import Hero from '@/components/home/Hero';
import SearchPanel from '@/components/home/SearchPanel';
import Services from '@/components/home/Services';
import RecentSearches from '@/components/home/RecentSearches';
import MemberBenefits from '@/components/home/MemberBenefits';
import ClubBanner from '@/components/home/ClubBanner';
import GrabOffers from '@/components/home/GrabOffers';
import WatchExplore from '@/components/home/WatchExplore';
import ClosingLine from '@/components/home/ClosingLine';
import { heroSlides, offers } from '@/lib/content';
import { image } from '@/lib/images';

/** The home screen, in the order the design scrolls. */
export default function HomePage() {
  // Resolved here: the hero and the offers strip are interactive, so they
  // cannot read the filesystem themselves.
  const slides = heroSlides.map((slide) => ({ ...slide, image: image(slide.image) }));
  const offerCards = offers.map((offer) => ({ ...offer, image: image(offer.image) }));

  return (
    <>
      <Hero slides={slides} />
      <SearchPanel />
      <Services />
      <RecentSearches />
      <MemberBenefits />
      <ClubBanner />
      <GrabOffers offers={offerCards} />
      <WatchExplore />
      <ClosingLine />
    </>
  );
}
