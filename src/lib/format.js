/** Money the way the rest of the business writes it. */
export function inr(value) {
  const n = Number(value || 0);
  return `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * "17 Aug" — short enough for the search bar on a phone.
 *
 * The month is spelled out here rather than left to toLocaleDateString: newer
 * CLDR writes September as 'Sept' in both en-IN and en-GB, which is a
 * character wider than the design allows, and a server running a different
 * ICU build from the browser would disagree and trip hydration.
 */
export function shortDate(date) {
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]}`;
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
