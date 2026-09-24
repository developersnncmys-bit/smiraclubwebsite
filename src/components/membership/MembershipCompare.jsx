import { Check, X } from 'lucide-react';
import NeedHelp from '@/components/ui/NeedHelp';
import { membershipCompare } from '@/lib/content';

/** A green tick or a red cross, which is the whole point of the table. */
function Mark({ yes }) {
  return yes ? (
    <span
      className="mx-auto grid h-7 w-7 place-items-center rounded-full bg-[#21A24A] text-white"
      role="img"
      aria-label="Included"
    >
      <Check size={16} strokeWidth={3.5} />
    </span>
  ) : (
    <span
      className="mx-auto grid h-7 w-7 place-items-center rounded-full bg-[#E02B2B] text-white"
      role="img"
      aria-label="Not included"
    >
      <X size={16} strokeWidth={3.5} />
    </span>
  );
}

/**
 * Smira Vs Other.
 *
 * A real table rather than stacked cards, because that is what a comparison
 * is — a screen reader should hear "Choice of Hotel, Smira Club, included"
 * as one row, and the header cells are what make that work.
 */
export default function MembershipCompare() {
  return (
    <div className="shell space-y-6 py-6">
      <div className="overflow-hidden rounded-2xl bg-white shadow-card">
        {/* Fixed, so the three columns keep the widths the design gives them
            and the Other column cannot be pushed off a phone screen. */}
        <table className="w-full table-fixed border-collapse text-left">
          <thead>
            <tr>
              <th scope="col" className="w-[40%] p-4 align-middle text-[15px] font-extrabold uppercase leading-tight tracking-wide text-ink-900 sm:p-5">
                Benefits &amp; Services
              </th>
              <th scope="col" className="w-[30%] p-0 align-bottom">
                <span className="flex min-h-[5.25rem] items-center justify-center rounded-t-2xl bg-[#2F80ED] px-2 py-4 text-center text-[15px] font-extrabold uppercase leading-tight tracking-wide text-white">
                  Smira<br />Club
                </span>
              </th>
              <th scope="col" className="w-[30%] p-0 align-bottom">
                {/* Same minimum as the Smira block, so the two tops are level
                    however many lines each name takes. */}
                <span className="flex min-h-[5.25rem] items-center justify-center rounded-t-2xl bg-gradient-to-b from-[#C4C4C4] to-[#8E8E8E] px-2 py-4 text-center text-[15px] font-extrabold uppercase leading-tight tracking-wide text-white">
                  Other
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            {membershipCompare.map((row) => (
              <tr key={row.key} className="border-t border-surface-line">
                <th scope="row" className="p-4 text-left align-middle font-normal sm:p-5">
                  <span className="block text-[15px] font-bold leading-snug text-ink-900">
                    {row.label}
                  </span>
                  <span className="mt-1.5 block text-[13px] leading-snug text-ink-500">
                    {row.body}
                  </span>
                </th>
                <td className="border-l border-surface-line px-2 py-5 text-center align-middle">
                  <Mark yes={row.smira} />
                </td>
                <td className="border-l border-surface-line px-2 py-5 text-center align-middle">
                  <Mark yes={row.other} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NeedHelp />
    </div>
  );
}
