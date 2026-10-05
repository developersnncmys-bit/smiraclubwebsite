'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Info } from 'lucide-react';
import NeedHelp from '@/components/ui/NeedHelp';
import { helpDesk } from '@/lib/content';
import { api } from '@/lib/api';
import { getSessionToken } from '@/lib/session';
import { toSrc } from '@/lib/imageSlot';

/**
 * Get Help.
 *
 * Get OTP stays disabled until a booking ID is typed, which is what the
 * design's greyed-out button is saying. There is no OTP service yet, so it
 * says what would happen rather than pretending a code is on its way.
 */
export default function GetHelp({ art }) {
  const [id, setId] = useState('');
  const [sent, setSent] = useState(null);

  /**
   * The member's own bookings, to look one up against.
   *
   * This used to check what was typed against the screen's sample
   * bookings, so a real reference came back "no booking here matches
   * that" and a made-up one could come back found. Signed out there is
   * nothing to check against, and it says so rather than guessing.
   */
  const [mine, setMine] = useState(null);
  useEffect(() => {
    const token = getSessionToken();
    if (!token) return undefined;
    let live = true;
    api.memberMe(token)
      .then((res) => live && setMine(res.data?.bookings || []))
      .catch(() => live && setMine([]));
    return () => { live = false; };
  }, []);

  const submit = (e) => {
    e.preventDefault();
    const code = id.trim().toUpperCase();
    const known = mine
      ? mine.some((b) => String(b.reference).toUpperCase() === code)
      : null;
    setSent({ code, known });
  };

  return (
    <div className="pb-10">
      {/* -- Who is asking ----------------------------------------- */}
      <section className="bg-white">
        <div className="shell flex items-start gap-4 py-6">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-ink-900">{helpDesk.greeting}</h1>
            <p className="mt-2 text-[15px] font-semibold leading-relaxed text-ink-900">
              {helpDesk.body}
            </p>
          </div>

          <Image
            src={toSrc(art || helpDesk.image)}
            alt=""
            width={200}
            height={143}
            className="h-auto w-[130px] shrink-0 sm:w-[180px]"
          />
        </div>
      </section>

      {/* -- What they want ---------------------------------------- */}
      <form onSubmit={submit} className="shell py-6">
        <h2 className="text-xl font-bold text-ink-900">{helpDesk.trip.title}</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-600">{helpDesk.trip.body}</p>

        <label className="mt-7 block">
          <span className="flex items-center gap-1.5 text-[15px] font-bold text-ink-900">
            Booking ID
            <span title={helpDesk.trip.hint}>
              <Info size={16} className="text-red-500" />
            </span>
          </span>

          <input
            value={id}
            onChange={(e) => {
              setId(e.target.value);
              setSent(null);
            }}
            placeholder="Enter booking ID"
            aria-label="Booking ID"
            className="mt-3 w-full rounded-xl border border-surface-line bg-white px-4 py-4 text-[15px] text-ink-900 outline-none transition placeholder:text-ink-500 focus:border-action-500"
          />
        </label>

        {sent && (
          <p
            className={`mt-4 rounded-xl px-4 py-3.5 text-[14px] leading-relaxed ${
              sent.known === true
                ? 'bg-[#e8f6ec] font-semibold text-green-700'
                : 'bg-[#fdf3dd] text-[#8a6410]'
            }`}
          >
            {/* Not finding it and not being able to look are different
                answers, and saying the first when we mean the second
                sends somebody off to check an id that was right. */}
            {sent.known === true
              ? `We found ${sent.code}. Once the OTP service is connected, a code will go to the number used for that booking.`
              : sent.known === false
                ? `No booking of yours matches ${sent.code}. Check the ID on your confirmation, or talk to the desk below.`
                : `Sign in and we can look ${sent.code} up for you. The desk below can find it either way.`}
          </p>
        )}

        <button
          type="submit"
          disabled={!id.trim()}
          className={`mt-7 w-full rounded-xl py-4 text-[15px] font-bold transition ${
            id.trim()
              ? 'bg-brand-600 text-white hover:bg-brand-700'
              : 'cursor-not-allowed bg-[#d6d6d6] text-white'
          }`}
        >
          Get OTP
        </button>

        <NeedHelp className="mt-8" />
      </form>
    </div>
  );
}
