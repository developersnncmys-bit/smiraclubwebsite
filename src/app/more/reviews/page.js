import ScreenBar from '@/components/ui/ScreenBar';
import TestimonialsScreen from '@/components/more/TestimonialsScreen';
import { memberTestimonials } from '@/lib/content';
import { image } from '@/lib/images';

export const metadata = {
  title: 'Membership Reviews',
  description: 'What Smira Club members say about their stays and the desk behind them.',
};

export default function Page() {
  const art = Object.fromEntries(
    memberTestimonials.filter((t) => t.image).map((t) => [t.id, image(t.image)]),
  );

  return (
    <>
      <ScreenBar title="Membership Reviews" backHref="/more" />
      <TestimonialsScreen art={art} />
    </>
  );
}
