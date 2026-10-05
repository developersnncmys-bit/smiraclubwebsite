'use client';

import SetInnerScreen from '@/components/layout/InnerScreen';

/**
 * The app-style bar the Figma puts at the top of an inner screen: a way back
 * and the screen's name. A desktop has the site header and its own heading,
 * so this is the phone's alone.
 */
/**
 * The bar at the top of an inner screen.
 *
 * It draws nothing of its own any more. A phone shows this in the site
 * header, which has the room the page bar wanted and the badge the page
 * bar had no business repeating; a desktop has the header and its own
 * heading already. So this says what the screen is called and leaves the
 * drawing to whoever has the space.
 */
export default function ScreenBar({ title, backHref }) {
  return <SetInnerScreen title={title} backHref={backHref} />;
}
