/**
 * Smira Club Terms & Conditions.
 *
 * DRAFT — written from what this site actually does (the four tiers, the
 * privilege picks, complimentary stays, rate plans, gifts, referrals and the
 * sharing add-on) so nothing here contradicts a screen. It has NOT been
 * through a lawyer. Have counsel review it before launch, in particular the
 * liability, governing-law and refund-adjacent clauses.
 *
 * Same block shape as the other policies — see components/ui/LegalDocument.
 */

export const terms = {
  title: 'Smira Club Terms & Conditions',

  intro: [
    'These Terms & Conditions govern your use of the Smira Club website, application, membership plans and related services.',
    'Smira Club is a membership-based travel and lifestyle platform offering members access to hotel stays, complimentary nights, holiday packages, villas and homestays, restaurants, theme and water parks, spa and salon services, adventure activities, transport booking support and other lifestyle benefits.',
    'By creating an account, purchasing a membership or making a booking through Smira Club, you agree to these Terms.',
  ],

  sections: [
    {
      id: 'eligibility',
      title: 'Eligibility and Your Account',
      blocks: [
        {
          lead: 'To use Smira Club you must:',
          items: [
            'Be at least 18 years of age',
            'Provide accurate and complete registration details',
            'Keep your account and login credentials confidential',
            'Hold only one Smira Club account unless we agree otherwise in writing',
          ],
          close: 'You are responsible for activity carried out through your account. Tell us promptly if you believe it has been used without your permission.',
        },
      ],
    },

    {
      id: 'membership-plans',
      title: 'Membership Plans',
      lead: 'Smira Club offers Silver, Gold, Platinum and Diamond memberships. Each plan states its own fee, validity period, number of complimentary nights, how many people a stay covers and how many rooms may be booked at a time.',
      blocks: [
        {
          lead: 'By purchasing a membership you accept that:',
          items: [
            'The plan you buy is the plan shown to you at the time of purchase, including its fee, validity and stated benefits',
            'Membership begins on activation and expires at the end of its validity period',
            'Benefits are personal to the member and are not transferable unless you have bought the membership sharing add-on',
            'Unused benefits do not carry over past expiry unless a plan expressly says otherwise',
            'Plans, fees and benefits may change for future purchases without affecting a membership already active',
          ],
        },
        {
          subtitle: 'Membership Sharing',
          leads: [
            'Membership sharing is a paid add-on that lets named relatives or friends use your member benefits.',
            'Where sharing is bought:',
          ],
          items: [
            'The primary member remains responsible for how the benefits are used',
            'Shared benefits draw on the same allowance as the primary membership, not a separate one',
            'We may ask for proof of identity or relationship before a shared benefit is honoured',
          ],
        },
        {
          subtitle: 'Smira Privilege Rate',
          lead: 'Each plan lets you choose a set number of privilege categories from those we offer. Your choices apply for the life of the membership, and we may allow changes at our discretion.',
        },
      ],
    },

    {
      id: 'complimentary-stays',
      title: 'Complimentary Stays',
      blocks: [
        {
          leads: [
            'Complimentary nights are the room only. Food, beverages, utility charges and any service the property bills separately remain payable by you, at the property, unless the offer says otherwise.',
            'Complimentary stays are also subject to:',
          ],
          items: [
            'Availability at the property on the dates requested',
            'Any blackout dates, seasons or minimum-notice periods stated at the time of booking',
            'The number of people and rooms your plan covers',
            'Presentation of a valid membership and accepted photo identification at check-in',
          ],
          close: 'Where a property cannot honour a complimentary night, we will offer alternative dates or an alternative property where one is available.',
        },
      ],
    },

    {
      id: 'bookings',
      title: 'Bookings',
      blocks: [
        {
          lead: 'When you make a booking through Smira Club:',
          items: [
            'All bookings are subject to availability at the time of confirmation',
            'A booking is confirmed only once payment is received and we issue a booking ID',
            'The rate plan you select decides what is included and on what terms it may be changed or cancelled',
            'Member rates, discounts and privilege rates apply only while your membership is active',
            'Prices shown are per the rate plan and may be exclusive of taxes and service fees, which are shown before you pay',
          ],
          close: 'Please check the property name, dates, guests and rate plan on the Review Booking screen before paying. We rely on the details you confirm there.',
        },
      ],
    },

    {
      id: 'pricing-and-payment',
      title: 'Pricing and Payment',
      blocks: [
        {
          items: [
            'All prices are in Indian Rupees unless stated otherwise',
            'Taxes and service fees are shown separately in the price summary before payment',
            'Payments are handled by third-party payment providers, whose own terms apply to the processing of your payment',
            'Coupon codes apply only where valid, may be limited in time or quantity, and cannot be exchanged for cash',
            'Offers and discounts may vary by location, date, service provider, membership eligibility and availability',
            'Some premium hotel bookings are subject to real-time availability and location',
          ],
          close: 'Where a price is displayed in error, we will tell you before the booking is confirmed and you may proceed at the correct price or cancel without charge.',
        },
      ],
    },

    {
      id: 'gifts-and-rewards',
      title: 'Gifts and Rewards',
      blocks: [
        {
          lead: 'Membership gifts are earned by meeting the requirement shown against each gift.',
          items: [
            'Gifts are non-transferable and are valid for a limited period',
            'A gift is released after successful membership activation and, where stated, your first completed booking',
            'Some gifts are tied to a particular plan and are only available on that plan',
            'Where a stated gift becomes unavailable, we may substitute one of equal or greater value',
          ],
        },
      ],
    },

    {
      id: 'refer-and-earn',
      title: 'Refer & Earn',
      blocks: [
        {
          lead: 'SmiraCash earned through referrals is subject to the following:',
          items: [
            'Your referral code must be used by your friend when they sign up',
            'Sign-up rewards credit once the new member’s account is active',
            'The additional reward credits once your friend has completed their first booking',
            'Referral earnings are capped at the number of referrals stated on the Refer & Earn screen',
            'SmiraCash may be redeemed against Smira Club bookings and cannot be withdrawn as cash',
            'We may withhold or reverse rewards where we reasonably believe the scheme is being abused, including self-referral or duplicate accounts',
          ],
        },
      ],
    },

    {
      id: 'property-rules',
      title: 'Property Rules and Guest Conduct',
      blocks: [
        {
          leads: [
            'Properties set their own house rules, and those rules apply to your stay alongside these Terms.',
            'Commonly:',
          ],
          items: [
            'Check-in and check-out times are those shown on the property page',
            'The primary guest must be at least 18 years of age',
            'Passport, Aadhaar and government-issued photo ID are accepted as proof of identity',
            'Local ID may be refused at some properties',
            'Where a property permits unmarried couples, that is stated on its page',
          ],
          close: 'A property may refuse or end a stay where house rules are broken, local law requires it, or other guests or staff are put at risk. Charges already incurred remain payable in those circumstances.',
        },
      ],
    },

    {
      id: 'reviews-and-content',
      title: 'Reviews and Member Content',
      blocks: [
        {
          leads: [
            'You keep ownership of reviews, photographs and other content you submit. By submitting it you give Smira Club a non-exclusive, royalty-free licence to display and share that content in connection with our services.',
            'Content must not:',
          ],
          items: [
            'Be false, misleading or written about a stay you did not take',
            'Contain unlawful, abusive, discriminatory or obscene material',
            'Identify other guests or staff without their consent',
            'Infringe anyone else’s rights',
          ],
          close: 'We may decline to publish, or may remove, content that breaches these Terms.',
        },
      ],
    },

    {
      id: 'partners',
      title: 'Properties and Partners',
      blocks: [
        {
          leads: [
            'Hotels, villas, restaurants, parks, salons, transport operators and experience providers listed on Smira Club are independent businesses. They are responsible for the services they deliver and for their own standards, licences and house rules.',
            'Smira Club arranges and coordinates your booking with them. Where a partner fails to provide a service you have paid for through us, we will help you pursue it and will apply our Refund Policy where it applies.',
          ],
        },
      ],
    },

    {
      id: 'acceptable-use',
      title: 'Acceptable Use',
      blocks: [
        {
          lead: 'You agree not to:',
          items: [
            'Resell, rent or commercially exploit membership benefits or member rates',
            'Use another member’s account or lend yours to someone outside your sharing add-on',
            'Provide false information when booking or when claiming a benefit or gift',
            'Interfere with the security or proper functioning of the website or application',
            'Extract or copy listings, rates or content by automated means',
          ],
          close: 'We may suspend or close an account, and withdraw benefits, where these Terms are broken.',
        },
      ],
    },

    {
      id: 'changes',
      title: 'Changes to Services and to These Terms',
      blocks: [
        {
          leads: [
            'We may add, change or withdraw features, partners, offers and plans. Where a change materially reduces a benefit of a membership you already hold, we will tell you and, where it is reasonable to do so, offer an alternative.',
            'We may update these Terms from time to time. The current version is always published here with its revision date, and continuing to use Smira Club after a change means you accept the updated Terms.',
          ],
        },
      ],
    },

    {
      id: 'liability',
      title: 'Liability',
      blocks: [
        {
          leads: [
            'Smira Club is responsible for arranging and coordinating the services you book through us and for meeting the membership benefits we have sold you.',
            'To the extent permitted by law, we are not liable for:',
          ],
          items: [
            'Acts, omissions or standards of independent properties and partners',
            'Loss, damage or injury occurring at a property or during a third-party experience',
            'Events outside our reasonable control, including weather, transport disruption, strikes, and government or regulatory action',
            'Indirect or consequential loss',
          ],
          close: 'Nothing in these Terms limits liability that cannot be limited under applicable law, including liability for death or personal injury caused by negligence, or for fraud.',
        },
      ],
    },

    {
      id: 'governing-law',
      title: 'Governing Law',
      blocks: [
        {
          leads: [
            'These Terms are governed by the laws of India.',
            'Any dispute arising out of or in connection with them is subject to the exclusive jurisdiction of the courts at Mumbai, Maharashtra.',
          ],
        },
      ],
    },
  ],

  contact: {
    title: 'Contact Us',
    lead: 'If you have any questions about these Terms & Conditions, your membership or a booking, please contact Smira Club.',
    email: 'support@smira.club',
    phone: '+91 98200 11223',
    note: 'Our published membership information lists these support contact details and Mumbai-area office locations.',
  },

  updated: '10 Sep 2026',
};
