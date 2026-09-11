'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const FIELD =
  'w-full rounded-xl border border-surface-line bg-white px-4 py-4 pr-12 text-[15px] text-ink-900 outline-none transition placeholder:text-ink-500 focus:border-action-500';

/** One password box, with the reveal toggle each of them needs. */
function Secret({ label, value, onChange, placeholder, error }) {
  const [shown, setShown] = useState(false);

  return (
    <label className="block">
      <span className="text-[17px] font-bold text-ink-900">{label}</span>

      <span className="relative mt-3 block">
        <input
          type={shown ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={label === 'Current password' ? 'current-password' : 'new-password'}
          className={FIELD}
        />
        <button
          type="button"
          onClick={() => setShown((s) => !s)}
          aria-label={shown ? `Hide ${label}` : `Show ${label}`}
          className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-ink-500 transition hover:bg-surface-soft"
        >
          {shown ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </span>

      {error && <span className="mt-1.5 block text-[13px] text-red-600">{error}</span>}
    </label>
  );
}

/**
 * Change Password.
 *
 * Update stays disabled until all three are filled and the two new ones
 * match, which is what the design's greyed-out button is saying — so the
 * button means the same thing it looks like it means.
 */
export default function ChangePassword() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  const filled = current && next && confirm;
  const ready = filled && next === confirm && next.length >= 8;

  const submit = (e) => {
    e.preventDefault();
    const found = {};
    if (next.length < 8) found.next = 'Use at least 8 characters.';
    if (next !== confirm) found.confirm = 'These two do not match.';
    setErrors(found);
    if (Object.keys(found).length) return;

    setDone(true);
    setCurrent('');
    setNext('');
    setConfirm('');
  };

  return (
    <form onSubmit={submit} className="shell space-y-7 py-6 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-7 lg:space-y-0">
      <Secret
        label="Current password"
        value={current}
        onChange={setCurrent}
        placeholder="Enter Your Current password"
      />

      <Secret
        label="New Password"
        value={next}
        onChange={setNext}
        placeholder="Enter Your New password"
        error={errors.next}
      />

      <Secret
        label="Confirm New Password"
        value={confirm}
        onChange={setConfirm}
        placeholder="Confirm Your New Password"
        error={errors.confirm}
      />

      {done && (
        <p className="rounded-xl bg-[#e8f6ec] px-4 py-3.5 text-[15px] font-semibold text-green-700 lg:col-span-2">
          Password updated. You will use the new one next time you sign in.
        </p>
      )}

      <button
        type="submit"
        disabled={!ready}
        className={`w-full rounded-xl py-4 text-[17px] font-bold transition lg:col-span-2 ${
          ready
            ? 'bg-brand-600 text-white hover:bg-brand-700'
            : 'cursor-not-allowed bg-[#d6d6d6] text-white'
        }`}
      >
        Update Password
      </button>
    </form>
  );
}
