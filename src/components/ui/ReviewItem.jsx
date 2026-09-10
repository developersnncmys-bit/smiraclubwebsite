import { ThumbsUp } from 'lucide-react';

/**
 * One review, wherever it is read.
 *
 * A property's page and the member's own list show the same thing and differ
 * only at the foot: on a property you can say a review was helpful, on your
 * own you see how many people already did. `helpful` being a number rather
 * than undefined is what picks between them.
 */
export default function ReviewItem({ review }) {
  const counted = typeof review.helpful === 'number';

  return (
    <li className="py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[17px] font-bold text-ink-900">{review.name}</p>
          <p className="text-[15px] text-ink-500">{review.kind}</p>
        </div>
        <span className="shrink-0 rounded-md border border-action-500 px-3 py-1 text-[15px] font-bold text-action-500">
          {review.score.toFixed(1)}
        </span>
      </div>

      <p className="mt-3 text-[15px] leading-relaxed text-ink-700">{review.body}</p>

      <p className="mt-4 text-[15px] text-ink-600">
        <span className="font-semibold text-ink-900">Travel Month:</span> {review.date}
      </p>
      <p className="text-[15px] text-ink-600">
        <span className="font-semibold text-ink-900">Room:</span> {review.room}
      </p>

      {counted ? (
        <p className="mt-3 flex items-center gap-2 text-[15px] font-semibold text-ink-900">
          <ThumbsUp size={17} className="text-ink-700" />
          {review.helpful}
        </p>
      ) : (
        <button
          type="button"
          className="mt-3 inline-flex items-center gap-2 text-[15px] font-semibold text-ink-900 underline"
        >
          Helpful?
          <ThumbsUp size={17} className="text-ink-700" />
        </button>
      )}
    </li>
  );
}
