'use client';

import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { sharePage } from '@/lib/wishlist';

/** Share this page: the device's share sheet, or a copied link. */
export default function ShareButton({ title, href, className = '' }) {
  const [note, setNote] = useState('');

  return (
    <button
      type="button"
      onClick={async () => {
        const how = await sharePage({ title, href });
        if (how === 'copied') setNote('Link copied');
        if (how === 'failed') setNote('Could not share');
        if (how !== 'shared') setTimeout(() => setNote(''), 1800);
      }}
      className={`inline-flex items-center gap-2 rounded-full border border-surface-line bg-white px-4 py-2 text-[13px] font-semibold text-ink-900 transition hover:bg-surface-soft ${className}`}
    >
      <Share2 size={15} />
      {note || 'Share'}
    </button>
  );
}
