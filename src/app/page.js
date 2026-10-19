import Hero from '@/components/home/Hero';
import SearchPanel from '@/components/home/SearchPanel';
import Services from '@/components/home/Services';
import RecentSearches from '@/components/home/RecentSearches';
import MemberBenefits from '@/components/home/MemberBenefits';
import ForNonMembers from '@/components/membership/ForNonMembers';
import FlashOffers from '@/components/home/FlashOffers';
import ClubBanner from '@/components/home/ClubBanner';
import GrabOffers from '@/components/home/GrabOffers';
import WatchExplore from '@/components/home/WatchExplore';
import ClosingLine from '@/components/home/ClosingLine';
import PlanTripReminder from '@/components/home/PlanTripReminder';
import AiSearchFab from '@/components/home/AiSearchFab';
import { heroSlides, offers, searchTabs, services, travelYears } from '@/lib/content';
import { deskHomeBanners, deskHomeOffers } from '@/lib/desk';
import { image } from '@/lib/images';
import { serviceArt } from '@/lib/serviceArt';

/** The home screen, in the order the design scrolls. */
export default async function HomePage() {
  /*
   * Resolved here: the hero and the offers strip are interactive, so they
   * cannot read the filesystem themselves.
   *
   * The banners are the desk's where it has written any, and the three
   * the site ships with where it has not — a home page with no banner at
   * all is worse than a stale one. A desk banner carries a full address
   * for its photograph, which image() passes through untouched, so both
   * kinds go through the same line.
   */
  const written = await deskHomeBanners();
  const slides = (written.length ? written : heroSlides).map((slide) => ({
    ...slide,
    image: image(slide.image),
  }));

  /*
   * Grab Offers: the strip the desk has arranged in the panel, or the
   * cards the site ships with when it has arranged none. A desk card
   * already carries a full address for its photograph, which image()
   * passes through untouched, so both kinds go through the same line.
   */
  const desk = await deskHomeOffers();
  const offerCards = (desk.length ? desk : offers).map((offer) => ({
    ...offer,
    image: image(offer.image),
  }));
  const trips = Object.values(travelYears).flat().map((t) => ({
    id: t.id, title: t.title, start: t.start, end: t.end, guests: t.guests, image: image(t.image),
  }));

  return (
    <>
      <Hero slides={slides} />
      <SearchPanel art={serviceArt(searchTabs.map((t) => t.key))} />
      <Services art={serviceArt(services.map((s) => s.key))} />
      <PlanTripReminder trips={trips} />
      <RecentSearches />
      {/*
        What membership gives, for somebody who has not got one. A
        member scrolling past four cards selling them a membership
        they already hold is being asked to buy it twice.
      */}
      <ForNonMembers>
        <MemberBenefits />
      </ForNonMembers>
      <FlashOffers />
      <ClubBanner />
      <GrabOffers offers={offerCards} />
      <WatchExplore />
      <ClosingLine />
      <AiSearchFab />
    </>
  );
}
