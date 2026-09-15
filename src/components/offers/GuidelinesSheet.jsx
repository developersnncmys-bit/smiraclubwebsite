'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Info, X } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import { parkGuidelines as g } from '@/lib/content';
import Portal from '@/components/ui/Portal';

function Item({ icon, title, body }) {
  return (
    <li className="flex gap-2.5">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-50">
        <Icon name={icon} size={16} className="text-ink-900" />
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] font-semibold text-ink-900">{title}</span>
        <span className="block text-[13px] leading-snug text-ink-600">{body}</span>
      </span>
    </li>
  );
}

function Block({ title, children, last }) {
  return (
    <section className={`px-4 py-5 sm:px-5 ${last ? '' : 'border-b-4 border-surface-soft'}`}>
      <h3 className="text-[15px] font-bold text-ink-900">{title}</h3>
      {children}
    </section>
  );
}

/**
 * View Guidelines — what the offer is, when it is valid, how to redeem it,
 * and the small print — as a centred sheet over the ticket list.
 */
export default function GuidelinesSheet({ open, onClose }) {
  const panel = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Portal>
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4 sm:p-6"
      onMouseDown={(e) => {
        if (!panel.current?.contains(e.target)) onClose();
      }}
    >
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="View Guidelines"
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-lift outline-none"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-surface-line px-4 py-4 sm:px-5">
          <div>
            <h2 className="text-[17px] font-bold text-ink-900">View Guidelines</h2>
            <p className="text-[13px] text-ink-700">Know about the details before you book</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-lg text-ink-900 hover:bg-surface-soft">
            <X size={20} />
          </button>
        </header>

        <div className="overflow-y-auto">
          <Block title="Offer Details">
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5">{g.offer.map((i) => <Item key={i.title} {...i} />)}</ul>
          </Block>
          <Block title="Validity">
            <ul className="mt-4 space-y-4">{g.validity.map((i) => <Item key={i.title} {...i} />)}</ul>
          </Block>
          <Block title="How to Redeem">
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5">{g.redeem.map((i) => <Item key={i.title} {...i} />)}</ul>
          </Block>
          <Block title="Important Things To Remember" last>
            <ul className="mt-3 space-y-1.5">
              {g.remember.map((line) => (
                <li key={line} className="flex gap-2 text-[13px] text-ink-600">
                  <span aria-hidden="true">&bull;</span>
                  {line}
                </li>
              ))}
            </ul>
            <p className="mt-5 flex gap-2 text-[13px] text-ink-900">
              <Info size={15} className="mt-0.5 shrink-0" />
              <span>
                Read{' '}
                <Link href="/more/cancellation" className="font-medium text-action-500 underline">Cancellation Policy</Link> &amp;{' '}
                <Link href="/more/refunds" className="font-medium text-action-500 underline">Refund Policy</Link> &amp;{' '}
                <Link href="/more/terms" className="font-medium text-action-500 underline">Terms &amp; Conditions</Link>
              </span>
            </p>
          </Block>
        </div>
      </div>
    </div>
    </Portal>
  );
}
