/** Money the way the rest of the business writes it. */
export function inr(value) {
  const n = Number(value || 0);
  return `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

/** "17 Aug" — short enough for the search bar on a phone. */
export function shortDate(date) {
  return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

/**
 * A default stay: tomorrow, two nights — which is what the booking screens
 * are drawn against, and the length most weekend trips actually are.
 */
export function defaultStay() {
  const from = new Date();
  from.setDate(from.getDate() + 1);
  const to = new Date(from);
  to.setDate(to.getDate() + 2);
  return { from, to };
}

export function nightsBetween(from, to) {
  const ms = new Date(to).getTime() - new Date(from).getTime();
  return Math.max(1, Math.round(ms / 86400000));
}

/** Joins class names, skipping anything falsy. */
export function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}
