/**
 * Smira Club Refund Policy.
 *
 * DRAFT — written from what this site actually does, and deliberately kept
 * consistent with the Cancellation Policy: cancellation decides *whether*
 * money comes back, this document decides *how much* and *when*. It has NOT
 * been reviewed by a lawyer, and the windows and timelines below are
 * placeholders the business needs to confirm.
 */

export const refundPolicy = {
  title: 'Smira Club Refund Policy',

  intro: [
    'This Refund Policy explains when money paid to Smira Club is returned, how much is returned and how long it takes.',
    'It covers membership fees, the membership sharing add-on, and bookings made through Smira Club for hotels, villas and homestays, packages and lifestyle experiences.',
    'Whether a booking can be cancelled at all is decided by our Cancellation Policy and by the rate plan you chose. This document explains what happens to your money once a cancellation is accepted.',
  ],

  sections: [
    {
      id: 'membership-fees',
      title: 'Membership Fees',
      blocks: [
        {
          lead: 'A membership fee is refundable in full where all of the following are true:',
          items: [
            'You request the refund within 7 days of purchase',
            'The membership has not been used to make or hold a booking',
            'No complimentary night, privilege rate or member discount has been taken',
            'No membership gift has been claimed or dispatched',
          ],
          close: 'Once a membership has been used in any of those ways, or once 7 days have passed, the fee is non-refundable for the remainder of its validity. Memberships are not refunded on a pro-rata basis when they expire unused.',
        },
        {
          subtitle: 'Membership Sharing',
          lead: 'The sharing add-on follows the membership it was bought with. It is refundable on the same terms above, and separately refundable in full if no shared benefit has yet been used.',
        },
      ],
    },

    {
      id: 'booking-refunds',
      title: 'Booking Refunds',
      lead: 'What comes back depends on the rate plan shown against the room or property when you booked. The rate plan is stated on the Review Booking screen before you pay.',
      blocks: [
        {
          subtitle: 'Free Cancellation Available',
          lead: 'Where the rate plan is marked Free Cancellation Available:',
          items: [
            'Cancel within the free-cancellation window and the amount paid is refunded in full, including taxes and service fees',
            'Cancel after that window and the property’s own charge applies; anything above that charge is refunded',
          ],
        },
        {
          subtitle: 'Non-Refundable',
          lead: 'Where the rate plan is marked Non-Refundable, the booking amount is not returned if you cancel or do not arrive. Government taxes are refunded where the law requires it.',
        },
        {
          subtitle: 'Complimentary Stays',
          leads: [
            'A complimentary night has no room charge to refund. Where you have paid taxes, service fees or a deposit against it, those are returned on the terms above.',
            'Food, beverages and other charges settled directly with the property are refunded by the property, not by Smira Club.',
          ],
        },
      ],
    },

    {
      id: 'cancelled-by-property',
      title: 'Where a Property or Smira Club Cancels',
      blocks: [
        {
          leads: [
            'If a property cannot honour a confirmed booking, or if Smira Club cancels it, you are refunded in full — including taxes and service fees — whatever the rate plan says.',
            'Where you would rather travel than take the money back, we will offer an alternative property or alternative dates of a comparable standard. If the alternative costs less, we refund the difference; if it costs more, we will tell you before anything is charged.',
          ],
        },
      ],
    },

    {
      id: 'how-refunds-are-paid',
      title: 'How and When Refunds Are Paid',
      blocks: [
        {
          items: [
            'Refunds are made to the original payment method',
            'We process an approved refund within 3 working days of approving it',
            'Your bank or card issuer then takes a further 5 to 7 working days to show the money',
            'Where the original method is closed or has expired, we will agree an alternative with you and may ask for proof of the account',
          ],
          close: 'We cannot refund to a different person’s account from the one that paid.',
        },
      ],
    },

    {
      id: 'coupons-and-smiracash',
      title: 'Coupons, SmiraCash and Gifts',
      blocks: [
        {
          items: [
            'A coupon discount is not returned as cash; where a booking that used a coupon is refunded, the coupon is reinstated if it is still within its validity',
            'SmiraCash spent on a refunded booking is returned as SmiraCash, not as money',
            'SmiraCash cannot be withdrawn or exchanged for cash at any time',
            'Membership gifts already dispatched are not refundable and are not exchanged for their cash value',
          ],
        },
      ],
    },

    {
      id: 'payment-problems',
      title: 'Failed and Duplicate Payments',
      blocks: [
        {
          leads: [
            'If money leaves your account but no booking ID is issued, the payment has failed and is normally reversed automatically by your bank within 5 to 7 working days.',
            'If you are charged twice for the same booking, contact us with the booking ID and we will return the duplicate in full.',
          ],
        },
      ],
    },

    {
      id: 'requesting-a-refund',
      title: 'Requesting a Refund',
      blocks: [
        {
          lead: 'To request a refund:',
          items: [
            'Open My Bookings and cancel the booking there, where cancellation is available on it',
            'Or contact the desk through Get Help with your booking ID, and verify it with the OTP sent to the number used for the booking',
            'For a membership refund, contact the desk with your Member ID',
          ],
          close: 'We confirm every refund decision in writing, with the amount and the reason where anything has been deducted.',
        },
      ],
    },
  ],

  contact: {
    title: 'Contact Us',
    lead: 'For any question about a refund, or to check where one has got to, please contact Smira Club with your booking ID or Member ID.',
    email: 'support@smira.club',
    phone: '+91 98200 11223',
    note: 'Our published membership information lists these support contact details and Mumbai-area office locations.',
  },

  updated: '10 Sep 2026',
};
