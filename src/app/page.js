import Hero from '@/components/home/Hero';
import SearchPanel from '@/components/home/SearchPanel';
import Services from '@/components/home/Services';
import RecentSearches from '@/components/home/RecentSearches';
import MemberBenefits from '@/components/home/MemberBenefits';
import ClubBanner from '@/components/home/ClubBanner';
import GrabOffers from '@/components/home/GrabOffers';
import WatchExplore from '@/components/home/WatchExplore';
import ClosingLine from '@/components/home/ClosingLine';

/** The home screen, in the order the design scrolls. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <SearchPanel />
      <Services />
      <RecentSearches />
      <MemberBenefits />
      <ClubBanner />
      <GrabOffers />
      <WatchExplore />
      <ClosingLine />
    </>
  );
}
