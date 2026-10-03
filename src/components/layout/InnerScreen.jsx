'use client';

import { useEffect } from 'react';

/**
 * Marks the page as an inner screen — one that carries its own bar with a
 * way back and the screen's name.
 *
 * On a phone that bar used to sit underneath the site header, so every
 * detail page opened with two rows of chrome, ninety-eight pixels of it,
 * before a single photograph. The two say different things to the same
 * person: the header is where you are in the site, the bar is where you
 * are in the page, and on a phone there is only room for the second.
 *
 * So the header steps aside and the page's own bar takes the top. A
 * desktop has room for both and keeps them, which is why this is done
 * with an attribute and a media query rather than by not rendering the
 * header at all.
 *
 * Rendered by the bars themselves, so a page gets this by having one.
 */
export default function InnerScreen() {
  useEffect(() => {
    document.body.dataset.innerScreen = '1';
    return () => {
      delete document.body.dataset.innerScreen;
    };
  }, []);

  return null;
}
