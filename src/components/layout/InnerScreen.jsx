'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Which inner screen a phone is on, so the header can become its bar.
 *
 * A detail page needs two things at the top: who you are in the site —
 * the mark, the membership badge, the way to your account — and where you
 * are in the page, which is a way back and a title. On a desktop there is
 * room for both rows. On a phone there is not: two rows is ninety-eight
 * pixels before a photograph, and dropping either one loses something
 * somebody wanted.
 *
 * So on a phone they are the same row. The page says what it is called
 * and how to leave it, the header renders that on the left and keeps its
 * own badge and bell on the right, and nothing is stacked on anything.
 */

const InnerScreenContext = createContext({ screen: null, setScreen: () => {} });

export function InnerScreenProvider({ children }) {
  const [screen, setScreen] = useState(null);
  const value = useMemo(() => ({ screen, setScreen }), [screen]);
  return <InnerScreenContext.Provider value={value}>{children}</InnerScreenContext.Provider>;
}

/** What the header should show, or null on a top-level screen. */
export const useInnerScreen = () => useContext(InnerScreenContext).screen;

/**
 * Rendered by a page's own bar to say what it is called.
 *
 * It draws nothing. The title is read back by the header on a phone, and
 * cleared when the page goes, so a top-level screen is never left wearing
 * the last detail page's name.
 */
export default function SetInnerScreen({ title, backHref }) {
  const { setScreen } = useContext(InnerScreenContext);

  useEffect(() => {
    setScreen({ title, backHref: backHref || '' });
    document.body.dataset.innerScreen = '1';
    return () => {
      setScreen(null);
      delete document.body.dataset.innerScreen;
    };
  }, [title, backHref, setScreen]);

  return null;
}
