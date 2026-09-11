import Hero from '@/components/home/Hero';
import SearchPanel from '@/components/home/SearchPanel';
import Services from '@/components/home/Services';
import RecentSearches from '@/components/home/RecentSearches';
import MemberBenefits from '@/components/home/MemberBenefits';
import FlashOffers from '@/components/home/FlashOffers';
import ClubBanner from '@/components/home/ClubBanner';
import GrabOffers from '@/components/home/GrabOffers';
import WatchExplore from '@/components/home/WatchExplore';
import ClosingLine from '@/components/home/ClosingLine';
import AiSearchFab from '@/components/home/AiSearchFab';
import { heroSlides, offers, searchTabs, services } from '@/lib/content';
import { image } from '@/lib/images';
import { serviceArt } from '@/lib/serviceArt';

/** The home screen, in the order the design scrolls. */
export default function HomePage() {
  // Resolved here: the hero and the offers strip are interactive, so they
  // cannot read the filesystem themselves.
  const slides = heroSlides.map((slide) => ({ ...slide, image: image(slide.image) }));
  const offerCards = offers.map((offer) => ({ ...offer, image: image(offer.image) }));

  return (
    <>
      <Hero slides={slides} />
      <SearchPanel art={serviceArt(searchTabs.map((t) => t.key))} />
      <Services art={serviceArt(services.map((s) => s.key))} />
      <RecentSearches />
      <MemberBenefits />
      <FlashOffers />
      <ClubBanner />
      <GrabOffers offers={offerCards} />
      <WatchExplore />
      <ClosingLine />
      <AiSearchFab />
    </>
  );
}
