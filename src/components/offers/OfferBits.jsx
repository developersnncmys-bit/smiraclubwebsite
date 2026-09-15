import { MoreVertical, Search, SlidersHorizontal, Star, Tag } from 'lucide-react';

/**
 * Pieces the park and restaurant listings share: the outlined search box,
 * the member-discount strip, and the name/place/rating block of a card.
 */

export function SearchBox({ value, onChange, onSubmit, placeholder, label }) {
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(value);
      }}
      className="flex items-center gap-3 rounded-xl border-[1.5px] border-brand-800 bg-white px-4 py-3 lg:max-w-2xl"
    >
      <Search size={20} className="shrink-0 text-action-500" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[14px] text-ink-900 outline-none placeholder:text-ink-600"
      />
      <button
        type="button"
        disabled
        title="Filters arrive with the live inventory"
        aria-label="Filters"
        className="shrink-0 text-ink-900 disabled:cursor-default"
      >
        <SlidersHorizontal size={18} />
      </button>
    </form>
  );
}

/** "Up to 20% OFF for members", with the number drawn large. */
export function MemberStrip({ percent, className = '' }) {
  return (
    <p
      className={`flex items-center gap-2 rounded-md bg-gradient-to-r from-[#dde8fb] via-[#eef3fd] to-transparent px-3 py-1.5 text-[12px] font-semibold text-action-500 ${className}`}
    >
      <Tag size={15} className="shrink-0 -scale-x-100" fill="currentColor" />
      <span>
        Up to <span className="text-[18px] font-extrabold leading-none">{percent}% OFF</span> for members
      </span>
    </p>
  );
}

export function CardHead({ name, place, rating, reviews, children }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[16px] font-bold leading-tight text-ink-900">{name}</h3>
        <button
          type="button"
          aria-label={`More about ${name}`}
          className="-mr-1 grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink-900 transition hover:bg-surface-soft"
        >
          <MoreVertical size={18} />
        </button>
      </div>
      <p className="mt-1 text-[14px] text-ink-600">{place}</p>
      <p className="mt-1.5 flex items-center gap-1.5 text-[13px]">
        <Star size={15} className="text-gold" fill="currentColor" strokeWidth={0} />
        <span className="font-bold text-ink-900">{rating}</span>
        <span className="text-ink-700">({reviews} reviews)</span>
      </p>
      {children}
    </div>
  );
}
