/**
 * Who money is paid to, and how a phone is asked to pay it.
 *
 * There is no payment gateway. What there is, is Smira's own merchant
 * account at SBI — so the member pays into it from their own UPI app, and
 * the desk matches the payment against the reference the member hands back.
 * Nothing here can confirm a payment; only the desk can, by looking at the
 * account. That is why a membership stays pending until they do.
 *
 * The id lives in one place, with an environment override, so moving to a
 * different account is a setting rather than a search through the code.
 */

export const MERCHANT = {
  name: process.env.NEXT_PUBLIC_UPI_NAME || 'SMIRA SERVICES PRIVATE LIMITED',
  upi: process.env.NEXT_PUBLIC_UPI_ID || '41185178022@sbi',
};

/**
 * The UPI intent a QR encodes and a phone's UPI app opens.
 *
 * The amount travels in it, which is the whole reason for drawing our own
 * QR rather than printing the counter sticker: a member scanning this one
 * cannot pay the wrong amount by mistyping it.
 */
export function upiLink({ amount, note } = {}) {
  const q = new URLSearchParams({
    pa: MERCHANT.upi,
    pn: MERCHANT.name,
    cu: 'INR',
  });
  if (amount > 0) q.set('am', String(Math.round(amount)));
  if (note) q.set('tn', String(note).slice(0, 50));
  // URLSearchParams writes a space as "+", which some UPI apps take
  // literally and show the merchant as "SMIRA+SERVICES". %20 is read the
  // same way by all of them.
  return `upi://pay?${q.toString().split('+').join('%20')}`;
}

/**
 * Whether a UPI reference looks like one.
 *
 * Banks hand back a twelve-digit UTR for a UPI transfer, though some apps
 * show a longer alphanumeric id instead. Anything shorter than eight
 * characters is somebody typing in the wrong box, and refusing that is
 * worth it — a payment the desk cannot find is a payment the member has to
 * be rung about.
 */
export const referenceLooksWrong = (v) => {
  const s = String(v || '').trim();
  return s.length > 0 && !/^[A-Za-z0-9]{8,24}$/.test(s);
};
