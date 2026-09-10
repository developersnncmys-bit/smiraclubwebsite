import { notFound } from 'next/navigation';
import ReviewsScreen from '@/components/hotels/ReviewsScreen';
import { hotelReviews, hotels } from '@/lib/content';

export function generateStaticParams() {
  return hotels.map((h) => ({ id: h.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const hotel = hotels.find((h) => h.id === id);
  return { title: hotel ? `Ratings & Review — ${hotel.name}` : 'Ratings & Review' };
}

/** Every review for one property, with the breakdown above them. */
export default async function Page({ params }) {
  const { id } = await params;

  const hotel = hotels.find((h) => h.id === id);
  if (!hotel) notFound();

  return (
    <ReviewsScreen
      title="Ratings & Review"
      subtitle={`${hotel.name}, Goa`}
      backHref={`/hotels/${hotel.id}`}
      rating={hotel.rating}
      reviewCount={hotel.reviews}
      reviews={hotelReviews}
    />
  );
}
