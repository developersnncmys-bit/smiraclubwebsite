'use client';

import { useState } from 'react';
import { MessageCircle, MoreVertical, Plus, X } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import { addressActions, membershipHelp, savedAddresses } from '@/lib/content';

const BLANK = { label: '', lines: '', phone: '' };

const FIELD =
  'w-full rounded-xl border border-surface-line bg-white px-4 py-3.5 text-[15px] text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-action-500';

/**
 * Saved Address.
 *
 * Adding and editing are the same form — an address being edited just starts
 * with its own values in it — so there is one place where an address is
 * written down rather than two that can drift apart.
 *
 * Nothing persists yet: there is no account to save against, so the list
 * lives for as long as the screen does.
 */
export default function SavedAddresses() {
  const [list, setList] = useState(savedAddresses);
  const [menuFor, setMenuFor] = useState(null);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(BLANK);
  const [error, setError] = useState('');

  const openAdd = () => {
    setEditing('new');
    setDraft(BLANK);
    setError('');
    setMenuFor(null);
  };

  const openEdit = (address) => {
    setEditing(address.id);
    setDraft({
      label: address.label,
      lines: address.lines.join('\n'),
      phone: address.phone,
    });
    setError('');
    setMenuFor(null);
  };

  const save = (e) => {
    e.preventDefault();
    if (!draft.label.trim() || !draft.lines.trim()) {
      setError('A name and the address itself, please.');
      return;
    }

    const next = {
      id: editing === 'new' ? `a${Date.now()}` : editing,
      label: draft.label.trim(),
      icon: /work|office/i.test(draft.label) ? 'Briefcase' : 'Home',
      lines: draft.lines.split('\n').map((l) => l.trim()).filter(Boolean),
      phone: draft.phone.trim(),
    };

    setList((all) =>
      editing === 'new' ? [...all, next] : all.map((a) => (a.id === editing ? next : a)),
    );
    setEditing(null);
  };

  return (
    <div className="shell space-y-5 py-5 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:space-y-0">
      {/* -- The two ways to get one on the list ------------------- */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={openAdd}
          className="card flex items-center gap-3 p-4 text-left transition hover:shadow-lift"
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-brand-50 text-action-500">
            <Plus size={17} strokeWidth={2.5} />
          </span>
          <span className="text-[16px] font-bold leading-snug text-ink-900">
            {addressActions.add}
          </span>
        </button>

        <a
          href={membershipHelp.whatsapp}
          target="_blank"
          rel="noreferrer"
          className="card flex items-center gap-3 p-4 transition hover:shadow-lift"
        >
          <MessageCircle
            size={26}
            className="shrink-0 text-[#25d366]"
            fill="currentColor"
            strokeWidth={0}
          />
          <span className="text-[16px] font-bold leading-snug text-ink-900">
            {addressActions.request}
          </span>
        </a>
      </div>

      {/* -- Adding or changing one -------------------------------- */}
      {editing && (
        <form onSubmit={save} className="card space-y-4 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-ink-900">
              {editing === 'new' ? 'Add New Address' : 'Edit Address'}
            </h2>
            <button
              type="button"
              onClick={() => setEditing(null)}
              aria-label="Close"
              className="grid h-9 w-9 place-items-center rounded-full text-ink-500 transition hover:bg-surface-soft"
            >
              <X size={19} />
            </button>
          </div>

          <label className="block">
            <span className="text-[15px] font-semibold text-ink-900">Name this address</span>
            <input
              value={draft.label}
              onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
              placeholder="Home, Work, Mum's place…"
              className={`${FIELD} mt-2`}
            />
          </label>

          <label className="block">
            <span className="text-[15px] font-semibold text-ink-900">Address</span>
            <textarea
              rows={3}
              value={draft.lines}
              onChange={(e) => setDraft((d) => ({ ...d, lines: e.target.value }))}
              placeholder={'D-Block JP Nagar, Mysuru,\nKarnataka 570031'}
              className={`${FIELD} mt-2 resize-none`}
            />
          </label>

          <label className="block">
            <span className="text-[15px] font-semibold text-ink-900">Phone Number</span>
            <input
              inputMode="numeric"
              value={draft.phone}
              onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
              placeholder="Enter a number for the courier"
              className={`${FIELD} mt-2`}
            />
          </label>

          {error && <p className="text-[13px] text-red-600">{error}</p>}

          <button type="submit" className="btn-primary w-full rounded-xl py-3.5 text-[16px]">
            {editing === 'new' ? 'Save address' : 'Save changes'}
          </button>
        </form>
      )}

      {/* -- What is saved ----------------------------------------- */}
      {list.length === 0 ? (
        <p className="card p-8 text-center text-[15px] text-ink-500">
          No addresses saved yet.
        </p>
      ) : (
        list.map((address) => (
          <article key={address.id} className="card p-4 sm:p-5">
            <div className="flex items-start gap-3.5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface-soft">
                <Icon name={address.icon} size={21} className="text-ink-700" strokeWidth={1.9} />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-bold text-ink-900">{address.label}</h2>

                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => setMenuFor(menuFor === address.id ? null : address.id)}
                      aria-label={`More for ${address.label}`}
                      aria-expanded={menuFor === address.id}
                      className="-mr-1 grid h-8 w-8 place-items-center rounded-full text-ink-600 transition hover:bg-surface-soft"
                    >
                      <MoreVertical size={19} />
                    </button>

                    {menuFor === address.id && (
                      <div className="absolute right-0 top-9 z-10 w-36 overflow-hidden rounded-xl bg-white py-1 shadow-lift ring-1 ring-surface-line">
                        <button
                          type="button"
                          onClick={() => openEdit(address)}
                          className="block w-full px-4 py-2.5 text-left text-[15px] text-ink-900 transition hover:bg-surface-soft"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setList((all) => all.filter((a) => a.id !== address.id));
                            setMenuFor(null);
                          }}
                          className="block w-full px-4 py-2.5 text-left text-[15px] text-red-600 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <address className="mt-2 not-italic text-[16px] leading-relaxed text-ink-700">
                  {address.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>

                {address.phone && (
                  <p className="mt-3 text-[16px] text-ink-900">
                    <span className="font-semibold">Phone Number:</span> {address.phone}
                  </p>
                )}
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
