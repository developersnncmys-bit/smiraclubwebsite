import { Check, X } from 'lucide-react';
import NeedHelp from '@/components/ui/NeedHelp';
import { membershipCompare } from '@/lib/content';

/** A green tick or a red cross, which is the whole point of the table. */
function Mark({ yes }) {
  return yes ? (
    <span
      className="mx-auto grid h-6 w-6 place-items-center rounded-full bg-green-600 text-white"
      role="img"
      aria-label="Included"
    >
      <Check size={14} strokeWidth={3.5} />
    </span>
  ) : (
    <span
      className="mx-auto grid h-6 w-6 place-items-center rounded-full bg-red-600 text-white"
      role="img"
      aria-label="Not included"
    >
      <X size={14} strokeWidth={3.5} />
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
    <div className="shell space-y-6 py-6 lg:mx-auto lg:max-w-3xl">
      <div className="overflow-hidden rounded-2xl bg-white shadow-card">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th scope="col" className="w-[46%] p-4 align-bottom text-[16px] font-extrabold uppercase leading-tight tracking-wide text-ink-900 sm:p-5">
                Benefits &amp; Services
              </th>
              <th scope="col" className="w-[27%] p-0 align-bottom">
                <span className="block rounded-t-2xl bg-[#3d8bfd] px-2 py-5 text-center text-[15px] font-extrabold uppercase leading-tight tracking-wide text-white sm:text-base">
                  Smira<br />Club
                </span>
              </th>
              <th scope="col" className="w-[27%] p-0 align-bottom">
                <span className="block rounded-t-2xl bg-gradient-to-b from-[#8b8b8b] to-[#6b6b6b] px-2 py-5 text-center text-[15px] font-extrabold uppercase leading-tight tracking-wide text-white sm:text-base">
                  Other
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            {membershipCompare.map((row) => (
              <tr key={row.key} className="border-t border-surface-line">
                <th scope="row" className="p-4 text-left align-middle font-normal sm:p-5">
                  <span className="block text-[16px] font-bold leading-snug text-ink-900">
                    {row.label}
                  </span>
                  <span className="mt-1 block text-[14px] leading-snug text-ink-500">
                    {row.body}
                  </span>
                </th>
                <td className="border-l border-surface-line px-2 py-4 text-center align-middle">
                  <Mark yes={row.smira} />
                </td>
                <td className="border-l border-surface-line px-2 py-4 text-center align-middle">
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
