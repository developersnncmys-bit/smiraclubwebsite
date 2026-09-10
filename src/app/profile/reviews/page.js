import ScreenBar from '@/components/ui/ScreenBar';
import MyReviews from '@/components/profile/MyReviews';

export const metadata = {
  title: 'My Reviews',
  description: 'Every review you have written, and how helpful other members found them.',
};

/** My Reviews, from the profile screen's Your Information list. */
export default function Page() {
  return (
    <>
      <ScreenBar title="My Reviews" backHref="/profile" />
      <MyReviews />
    </>
  );
}
