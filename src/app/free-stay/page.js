import ScreenBar from '@/components/ui/ScreenBar';
import HotelsScreen from '@/components/hotels/HotelsScreen';
import FreeStayCard from '@/components/hotels/FreeStayCard';
import { hotels } from '@/lib/content';
import { image } from '@/lib/images';
import { deskFreeStays } from '@/lib/desk';

export const metadata = {
  title: 'Free Stay',
  description: 'Complimentary rooms for Smira Club members — you only pay for food.',
};

/** Where the Free Stay tab lands. */
export default async function Page() {
  /**
   * The partners who have put rooms up as a free stay.
   *
   * A free stay is an ordinary hotel with the price moved onto the food, so
   * they are filed with the hotels and told apart by a mark the property
   * type sets. Without this a partner could register as Free Stay and
   * appear on the hotels screen and nowhere else.
   */
  const picks = await deskFreeStays();

  /**
   * Every free stay there is, on the screen that is about them.
   *
   * This was a search box and a list of what somebody had searched for
   * before — so a member who had never searched saw nothing they could
   * stay in, and had to guess a destination to find out. The partners
   * who have marked rooms as a free stay come first, because they are
   * the ones that have just joined.
   */
  const stays = [
    ...picks.map((p) => ({ id: p.id, name: p.name, place: p.place, image: p.photo, rating: p.details?.rating, reviews: p.details?.reviews })),
    ...hotels.map((h) => ({ ...h, image: image(h.image) })),
  ];

  return (
    <>
      <ScreenBar title="Free Stay" backHref="/" />
      <HotelsScreen variant="free-stay" />

      <section className="shell pb-10">
        <h2 className="text-lg font-bold text-ink-900">Free stays for members</h2>
        <p className="mt-1 text-[14px] text-ink-500">
          Stay at no charge — you pay only for the food.
        </p>
        <div className="mt-4 space-y-3">
          {stays.map((stay) => (
            <FreeStayCard key={stay.id} hotel={stay} href={`/free-stay/${stay.id}`} />
          ))}
        </div>
      </section>
    </>
  );
}
