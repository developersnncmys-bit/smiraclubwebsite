'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowUpDown, Search } from 'lucide-react';
import { Segmented } from '@/components/forms/RequestFields';
import { SearchBox } from '@/components/offers/OfferBits';
import RestaurantCard from '@/components/offers/RestaurantCard';
import { restaurantModes } from '@/lib/content';

const chip = 'inline-flex shrink-0 items-center gap-2 rounded-md border px-4 py-2 text-[14px] transition';
const on = 'border-action-500 bg-[#e8f0fe] font-semibold text-brand-700';
const off = 'border-ink-400/60 bg-white text-ink-900 hover:border-ink-500';

/**
 * Restaurant Offers.
 *
 * Two states of one screen, as the design draws them. Browsing: Walk-In or
 * Dining, and a search box. Once a search is sent the switch gives way to the
 * searched-for bar and its chips — All, Sort By, Popular, Walk-In, Dining —
 * and the back arrow returns to browsing.
 */
export default function RestaurantsScreen({ restaurants }) {
  const [mode, setMode] = useState(restaurantModes[0].key);
  const [q, setQ] = useState('');
  const [searched, setSearched] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('recommended');
  const [popular, setPopular] = useState(false);

  const shown = useMemo(() => {
    if (searched === null) return restaurants.filter((r) => r.modes.includes(mode));

    const term = searched.trim().toLowerCase();
    let list = restaurants.filter((r) => !term || `${r.name} ${r.place}`.toLowerCase().includes(term));
    if (filter !== 'all') list = list.filter((r) => r.modes.includes(filter));
    list = [...list];
    if (popular) list.sort((a, b) => b.reviews - a.reviews);
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [restaurants, mode, searched, filter, sort, popular]);

  const search = (value) => {
    setSearched(value.trim());
    setFilter('all');
  };

  return (
    <div className="pb-10 lg:pb-16">
      <div className="bg-white">
        <div className="shell space-y-4 py-5 lg:py-8">
          {searched === null ? (
            <>
              <h1 className="hidden text-2xl font-bold text-ink-900 lg:block">Restaurant Offers</h1>
              <Segmented options={restaurantModes} value={mode} onChange={setMode} label="Walk-in or dining" className="lg:max-w-md" />
              <SearchBox value={q} onChange={setQ} onSubmit={search} placeholder="Search by restaurants name, location" label="Search restaurants" />
            </>
          ) : (
            <>
              <form
                role="search"
                onSubmit={(e) => {
                  e.preventDefault();
                  search(q);
                }}
                className="flex items-center gap-3 rounded-xl border border-ink-400 px-3 py-2.5 lg:max-w-2xl"
              >
                <button type="button" onClick={() => setSearched(null)} aria-label="Back to restaurant offers" className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-900 hover:bg-surface-soft">
                  <ArrowLeft size={20} />
                </button>
                <input
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  aria-label="Search restaurants"
                  className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[15px] font-medium text-ink-900 outline-none"
                />
                <button type="submit" aria-label="Search" className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-action-500 hover:bg-surface-soft">
                  <Search size={20} />
                </button>
              </form>

              <div className="rail gap-2">
                <button type="button" onClick={() => setFilter('all')} aria-pressed={filter === 'all'} className={`${chip} ${filter === 'all' ? on : off}`}>All</button>
                <label className={`relative cursor-pointer ${chip} ${off}`}>
                  Sort By
                  <ArrowUpDown size={14} />
                  <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort by" className="absolute inset-0 cursor-pointer opacity-0">
                    <option value="recommended">Recommended</option>
                    <option value="rating">Rating</option>
                  </select>
                </label>
                <button type="button" onClick={() => setPopular((p) => !p)} aria-pressed={popular} className={`${chip} ${popular ? on : off}`}>Popular</button>
                {restaurantModes.map((m) => (
                  <button key={m.key} type="button" onClick={() => setFilter(m.key)} aria-pressed={filter === m.key} className={`${chip} ${filter === m.key ? on : off}`}>
                    {m.label.replace('-', ' - ')}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="shell pt-6 lg:pt-8">
        <h2 className="text-[17px] font-semibold text-ink-900 lg:text-xl">
          Showing Top Results
          {searched ? (
            <>
              {' '}for <span className="text-action-500">{searched}</span>
            </>
          ) : null}
        </h2>

        {shown.length === 0 ? (
          <p className="mt-5 rounded-2xl bg-white p-6 text-center text-[14px] text-ink-500">No restaurants match that yet.</p>
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:gap-6">
            {shown.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
