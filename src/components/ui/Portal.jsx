'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Renders its children at the end of <body>.
 *
 * Every overlay goes through this. A popup opened from inside a sticky panel
 * is otherwise trapped in that panel's stacking context — position: sticky
 * creates one — so however high its z-index, the site header and the sticky
 * tab bar paint over it and cut it off.
 */
export default function Portal({ children }) {
  const [host, setHost] = useState(null);
  useEffect(() => setHost(document.body), []);
  return host ? createPortal(children, host) : null;
}
