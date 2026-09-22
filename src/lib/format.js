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

/** "29 Aug 2026". */
export function fullDate(date) {
  return `${shortDate(date)} ${new Date(date).getFullYear()}`;
}

/** "Aug 2026". */
export function monthYear(date) {
  const d = new Date(date);
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
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

/** '14:00' -> '2 PM'; minutes are kept only when there are any. */
export function clock(hhmm) {
  const [h, m] = String(hhmm).split(':').map(Number);
  const hour = ((h + 11) % 12) + 1;
  const mins = m ? `:${String(m).padStart(2, '0')}` : '';
  return `${hour}${mins} ${h < 12 ? 'AM' : 'PM'}`;
}

/** '14:00' -> '02:00 PM', as the hourly search field writes it. */
export function clockLong(hhmm) {
  const [h, m] = String(hhmm).split(':').map(Number);
  const hour = ((h + 11) % 12) + 1;
  return `${String(hour).padStart(2, '0')}:${String(m || 0).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}

/** '14:00' + 3 -> '2 PM - 5 PM'. A slot running past midnight wraps. */
export function slotRange(hhmm, hours) {
  const [h, m] = String(hhmm).split(':').map(Number);
  const end = `${String((h + Number(hours)) % 24).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}`;
  return `${clock(hhmm)} - ${clock(end)}`;
}

/** 'Sat'. */
export function weekday(date) {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(date).getDay()];
}

/** Joins class names, skipping anything falsy. */
export function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

/** A date as yyyy-mm-dd, the way the API takes it. Accepts a Date or that string. */
export function ymd(date) {
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
