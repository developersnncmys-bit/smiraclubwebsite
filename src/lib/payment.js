/**
 * Paying Smira through Razorpay.
 *
 * The server opens the order and checks the result — the page only shows
 * Razorpay's own Checkout (UPI, cards, net banking, wallets) in between. The
 * amount comes from the server, never from this page, and the key secret
 * never leaves the server.
 */
import { api } from '@/lib/api';

export const MERCHANT = {
  name: 'SMIRA SERVICES PRIVATE LIMITED',
};

const CHECKOUT = 'https://checkout.razorpay.com/v1/checkout.js';
let loading = null;

/** Razorpay's Checkout script, loaded once, when it is first needed. */
export function loadCheckout() {
  if (typeof window === 'undefined') return Promise.reject(new Error('No window'));
  if (window.Razorpay) return Promise.resolve(window.Razorpay);
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = CHECKOUT;
      s.async = true;
      s.onload = () => (window.Razorpay ? resolve(window.Razorpay) : reject(new Error('Razorpay did not load')));
      s.onerror = () => {
        loading = null;
        reject(new Error('Razorpay did not load'));
      };
      document.body.appendChild(s);
    });
  }
  return loading;
}

/** Thrown when the member closes Checkout without paying. */
export class PaymentClosed extends Error {
  constructor() {
    super('Payment was not completed. You can try again.');
    this.closed = true;
  }
}

/**
 * Pay for one membership (by its payRef). Resolves with the server's verdict
 * once Razorpay has taken the money and the server has checked it.
 */
export async function payMembership(payRef, { note, color = '#123a63' } = {}) {
  const [Razorpay, res] = await Promise.all([loadCheckout(), api.payOrder(payRef)]);
  const o = res.data || {};
  if (o.paid) return o; // already paid — nothing to charge

  return new Promise((resolve, reject) => {
    const rzp = new Razorpay({
      key: o.keyId,
      order_id: o.orderId,
      amount: o.amount,
      currency: o.currency || 'INR',
      name: 'Smira Club',
      description: note || o.description || 'Membership',
      prefill: { name: o.name || '', contact: o.phone || '', email: o.email || '' },
      theme: { color },
      handler: (r) => {
        api
          .payVerify({
            razorpay_order_id: r.razorpay_order_id,
            razorpay_payment_id: r.razorpay_payment_id,
            razorpay_signature: r.razorpay_signature,
          })
          .then((v) => resolve(v.data || {}))
          // Money taken but our check did not answer: the webhook still settles it.
          .catch(() => resolve({ status: 'Payment pending', checking: true }));
      },
      modal: { ondismiss: () => reject(new PaymentClosed()) },
    });
    rzp.open();
  });
}
