/**
 * Smira Club Cancellation Policy.
 *
 * DRAFT — the companion to the Refund Policy: this document decides *whether*
 * a booking can be cancelled and by when, the other decides *how much* comes
 * back. Written from the rate plans the site actually sells (Free
 * Cancellation Available / Non-Refundable) so the two never contradict.
 *
 * NOT reviewed by a lawyer. The windows below are placeholders the business
 * needs to confirm against its property agreements.
 */

export const cancellationPolicy = {
  title: 'Smira Club Cancellation Policy',

  intro: [
    'This Cancellation Policy explains how a Smira Club booking can be cancelled or changed, by when, and what happens in each case.',
    'It applies to hotels, villas and homestays, packages, complimentary stays and lifestyle experiences booked through Smira Club.',
    'What comes back to you once a cancellation is accepted is set out in our Refund Policy.',
  ],

  sections: [
    {
      id: 'rate-plans-decide',
      title: 'Your Rate Plan Decides',
      blocks: [
        {
          leads: [
            'Every room and property is sold on a rate plan, and the rate plan decides whether the booking can be cancelled. The plan is shown against the room when you select it, and again on the Review Booking screen before you pay.',
            'Smira Club sells two kinds:',
          ],
          items: [
            'Free Cancellation Available — the booking can be cancelled free of charge up to the deadline shown against it',
            'Non-Refundable — the booking cannot be cancelled for a refund once it is confirmed',
          ],
          close: 'If you are unsure which applies, the rate plan is repeated on your confirmation and in My Bookings.',
        },
      ],
    },

    {
      id: 'free-cancellation',
      title: 'Free Cancellation Bookings',
      blocks: [
        {
          leads: [
            'Where a booking is marked Free Cancellation Available, you may cancel it at no charge until the deadline stated on the booking. Unless a property states otherwise, that deadline is 48 hours before the check-in time.',
            'After the deadline, the property’s own cancellation charge applies. That charge is shown before you confirm and is typically the first night.',
          ],
        },
      ],
    },

    {
      id: 'non-refundable',
      title: 'Non-Refundable Bookings',
      blocks: [
        {
          leads: [
            'A Non-Refundable booking is sold at a lower rate precisely because the property is holding the room without the option to release it. It cannot be cancelled for a refund.',
            'You may still cancel the booking so the property can re-let the room, but no money is returned other than government taxes where the law requires it.',
          ],
        },
      ],
    },

    {
      id: 'complimentary-stays',
      title: 'Complimentary Stays',
      blocks: [
        {
          lead: 'Where a booking uses a complimentary night from your membership:',
          items: [
            'Cancel before the free-cancellation deadline and the night returns to your membership allowance',
            'Cancel after it, or fail to arrive, and the night is treated as used',
            'Charges you would have settled at the property, such as food, simply do not arise',
          ],
          close: 'A night returned to your allowance remains subject to the validity period of your membership.',
        },
      ],
    },

    {
      id: 'how-to-cancel',
      title: 'How to Cancel',
      blocks: [
        {
          lead: 'You can cancel in either of two ways:',
          items: [
            'Open My Bookings, select the booking and cancel it there',
            'Or contact the desk through Get Help with your booking ID, and verify it with the OTP sent to the number used for the booking',
          ],
          close: 'A cancellation takes effect when we confirm it in writing, not when the request is sent. Please keep that confirmation.',
        },
      ],
    },

    {
      id: 'changing-a-booking',
      title: 'Changing Dates or Guests',
      blocks: [
        {
          leads: [
            'Where a property allows it, we will try to move a booking rather than cancel it. A date change is subject to availability and to any difference in rate, which you pay or we refund.',
            'On a Non-Refundable rate a change is at the property’s discretion and may not be possible.',
            'Adding guests is subject to the number your plan covers and to the property’s occupancy limits, and may attract an extra charge payable at the property.',
          ],
        },
      ],
    },

    {
      id: 'cancelled-by-us',
      title: 'Cancellation by a Property or by Smira Club',
      blocks: [
        {
          leads: [
            'A property may occasionally be unable to honour a confirmed booking — through overbooking, closure, damage or events outside its control.',
            'Where that happens we will:',
          ],
          items: [
            'Tell you as soon as we know',
            'Offer an alternative property or alternative dates of a comparable standard',
            'Or refund you in full, including taxes and service fees, whatever the rate plan says',
          ],
          close: 'Smira Club may also cancel a booking where it was made fraudulently, where a benefit has been misused, or where a membership was not active at the time of booking.',
        },
      ],
    },

    {
      id: 'no-show',
      title: 'Not Arriving',
      blocks: [
        {
          leads: [
            'If you do not arrive and have not cancelled, the booking is treated as a no-show. The full amount is retained and any complimentary night used is treated as taken.',
            'If your plans change even at short notice, cancelling is always better than not arriving.',
          ],
        },
      ],
    },

    {
      id: 'membership-cancellation',
      title: 'Cancelling a Membership',
      blocks: [
        {
          leads: [
            'A membership can be cancelled within 7 days of purchase provided none of its benefits have been used. After that it runs to the end of its validity period.',
            'What is returned in each case is set out in the Refund Policy.',
          ],
        },
      ],
    },
  ],

  contact: {
    title: 'Contact Us',
    lead: 'To cancel a booking, change one, or ask what your rate plan allows, contact Smira Club with your booking ID.',
    email: 'support@smira.club',
    phone: '+91 98200 11223',
    note: 'Our published membership information lists these support contact details and Mumbai-area office locations.',
  },

  updated: '10 Sep 2026',
};
