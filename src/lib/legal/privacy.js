/**
 * The Smira Club Privacy Policy, straight off the Figma.
 *
 * It lives in its own file rather than lib/content.js because it is a legal
 * document that the desk will edit on its own schedule — keeping it separate
 * means changing a clause never touches the file every screen imports.
 *
 * A `block` is one run of the document: an optional subtitle, an optional
 * lead line, a list, and an optional closing line. Every section on the
 * screen is made of those, so the page has one shape to render rather than
 * fourteen special cases.
 */

export const privacyPolicy = {
  title: 'Smira Club Privacy Policy',

  intro: [
    'Welcome to Smira Club. We respect your privacy and are committed to protecting your personal information.',
    'Smira Club is a membership-based travel and lifestyle platform offering members access to travel, hotel stays, holiday packages, restaurants, theme and water parks, villas, spa and salon services, adventure activities, transport booking support and other lifestyle benefits.',
    'This Privacy Policy explains how Smira Club collects, uses, stores and protects your information when you use our website, membership services and related features.',
    'By using Smira Club, you agree to the practices described in this Privacy Policy.',
  ],

  sections: [
    {
      id: 'information-we-collect',
      title: 'Information We Collect',
      lead: 'We may collect the following information when you register for or use Smira Club:',
      blocks: [
        {
          subtitle: 'Personal Information',
          items: [
            'Full Name',
            'Email Address',
            'Mobile Number',
            'Profile Picture',
            'Date of Birth',
            'Address or City',
          ],
        },
        {
          subtitle: 'Membership Information',
          lead: 'We may collect and maintain information related to:',
          items: [
            'Your membership plan',
            'Membership validity',
            'Membership benefits',
            'Number of rooms and travellers covered under your plan',
            'Membership registration and activation details',
            'Service or registration charges',
            'Membership usage history',
          ],
        },
        {
          subtitle: 'Booking Information',
          lead: 'When you make a booking through Smira Club, we may collect:',
          items: [
            'Travel destination',
            'Check-in and check-out dates',
            'Number of travellers',
            'Names and details of travellers where required',
            'Hotel or property preferences',
            'Booking and transaction details',
            'Special requests',
            'Lifestyle or experience booking details',
          ],
          close: 'This information helps us process and coordinate your requested bookings.',
        },
        {
          subtitle: 'Travel Planning Information',
          lead: 'When using features such as Plan My Year, you may voluntarily provide:',
          items: [
            'Travel destination',
            'Travelling from date',
            'Travelling to date',
            'Travel plans and preferences',
            'Special occasions related to your trip',
          ],
          close: 'This information may be used to help you plan your trips and provide relevant reminders.',
        },
        {
          subtitle: 'Special Day Information',
          lead: 'If you choose to add special occasions to your profile or travel plans, such as:',
          items: [
            'Birthdays',
            'Anniversaries',
            'Family celebrations',
            'Other special occasions',
          ],
          close: 'we may use this information to send you relevant reminders, travel suggestions or offers',
        },
      ],
    },

    {
      id: 'how-we-use-your-information',
      title: 'How We Use Your Information',
      blocks: [
        {
          lead: 'Smira Club may use your information to:',
          items: [
            'Create and manage your account',
            'Activate and manage your membership',
            'Verify your membership eligibility',
            'Process hotel and travel bookings',
            'Coordinate with hotels and service partners',
            'Provide lifestyle and experience bookings',
            'Help you plan upcoming trips',
            'Send booking confirmations and updates',
            'Send booking reminders',
            'Send special-day reminders',
            'Inform you about relevant offers and benefits',
            'Provide customer support',
            'Improve our mobile application and website',
            'Maintain the security and proper functioning of our services',
          ],
          close: 'The membership information specifically includes benefits such as booking support, offer updates, booking reminders and special-day reminders.',
        },
      ],
    },

    {
      id: 'offers-and-promotions',
      title: 'Offers and Promotions',
      blocks: [
        {
          lead: 'Smira Club may use your information to provide you with relevant:',
          items: [
            'Travel offers',
            'Hotel offers',
            'Restaurant offers',
            'Theme and water park offers',
            'Lifestyle offers',
            'Spa and salon offers',
            'Special promotions',
            'Seasonal offers',
            'Membership benefits',
          ],
          closes: [
            'Offers and discounts may vary depending on the applicable location, date, service provider, membership eligibility and availability.',
            'Some premium hotel bookings are subject to real-time availability and location.',
          ],
        },
      ],
    },

    {
      id: 'sharing-of-information',
      title: 'Sharing of Information',
      blocks: [
        {
          leads: [
            'Smira Club may share necessary information with trusted third-party service providers and business partners when required to provide a service requested by you.',
            'This may include:',
          ],
          items: [
            'Hotels and resorts',
            'Villas and accommodation partners',
            'Restaurants',
            'Theme and water parks',
            'Spa and salon partners',
            'Travel and transport providers',
            'Other lifestyle and recreational partners',
            'Payment service providers',
            'Technology and communication service providers',
          ],
          close: 'We share only the information reasonably necessary to process or manage your requested service.',
        },
      ],
    },

    {
      id: 'payments-and-transactions',
      title: 'Payments and Transactions',
      blocks: [
        {
          lead: 'When you make payments through Smira Club, transaction-related information may be collected to:',
          items: [
            'Process payments',
            'Confirm transactions',
            'Manage membership activation',
            'Verify booking payments',
            'Resolve payment-related issues',
          ],
          close: 'Payment processing may involve third-party payment providers. Their handling of payment information may also be governed by their respective privacy policies.',
        },
      ],
    },

    {
      id: 'customer-support',
      title: 'Customer Support',
      blocks: [
        {
          lead: 'When you contact Smira Club through:',
          items: [
            'Phone calls',
            'Email',
            'In-app support',
            'Website forms',
            'Other official communication channels',
          ],
          close: 'We may collect information related to your request to assist you and improve our customer support services.',
          after: [
            'Smira Club’s membership materials provide customer support and booking coordination as part of its service operations.',
          ],
        },
      ],
    },

    {
      id: 'notifications-and-communications',
      title: 'Notifications and Communications',
      blocks: [
        {
          lead: 'We may send you notifications relating to:',
          items: [
            'Booking confirmations',
            'Booking updates',
            'Booking reminders',
            'Membership information',
            'Membership expiry or validity',
            'Special-day reminders',
            'Upcoming travel plans',
            'Relevant offers and promotions',
            'Important service updates',
          ],
          close: 'Where applicable, you may manage certain communication and notification preferences through your device or account settings.',
        },
      ],
    },

    {
      id: 'data-security',
      title: 'Data Security',
      blocks: [
        {
          lead: 'We take reasonable measures to protect your personal information from:',
          items: [
            'Unauthorized access',
            'Unauthorized use',
            'Loss',
            'Misuse',
            'Alteration',
            'Disclosure',
          ],
          close: 'However, no digital platform or internet-based service can guarantee absolute security. Users are also responsible for maintaining the confidentiality of their account and login credentials.',
        },
      ],
    },

    {
      id: 'your-information-and-account',
      title: 'Your Information and Account',
      blocks: [
        {
          lead: 'You may request to:',
          items: [
            'Review or update certain personal information',
            'Correct inaccurate information',
            'Update your contact details',
            'Request assistance regarding your account',
          ],
          close: 'Some information may need to be retained where necessary for legitimate business, legal, transaction, booking or membership purposes',
        },
      ],
    },

    {
      id: 'account-deletion',
      title: 'Account Deletion',
      blocks: [
        {
          leads: [
            'You may request the deletion of your Smira Club account by contacting our support team.',
            'Please note that deleting your account may affect your ability to access:',
          ],
          items: [
            'Membership information',
            'Booking history',
            'Active benefits',
            'Upcoming travel plans',
            'Saved offers',
            'Other account-related services',
          ],
          close: 'Certain information may be retained where required for legitimate operational, financial, legal or regulatory purposes.',
        },
      ],
    },

    {
      id: 'cookies-and-app-technologies',
      title: 'Cookies and App Technologies',
      blocks: [
        {
          leads: [
            'Our website and digital services may use cookies or similar technologies to improve user experience and understand how our services are used.',
            'These technologies may help us:',
          ],
          items: [
            'Keep users signed in',
            'Remember preferences',
            'Improve website performance',
            'Understand usage of our services',
            'Improve features and functionality',
          ],
          close: 'You may manage certain cookie preferences through your browser settings.',
        },
      ],
    },

    {
      id: 'third-party-services',
      title: 'Third-Party Services',
      blocks: [
        {
          leads: [
            'Smira Club may contain links to or facilitate bookings with third-party hotels, travel providers, lifestyle partners and other service providers. When you access services provided by a third party, their own privacy policies and terms may apply.',
            'Smira Club is not responsible for the privacy practices of third-party websites or services that operate independently.',
          ],
        },
      ],
    },

    {
      id: 'changes-to-this-privacy-policy',
      title: 'Changes to This Privacy Policy',
      blocks: [
        {
          lead: 'Smira Club may update this Privacy Policy from time to time to reflect changes in:',
          items: [
            'Our services',
            'Our features',
            'Our business practices',
            'Legal or regulatory requirements',
          ],
          closes: [
            'The updated Privacy Policy will be posted on our application or website with an updated revision date.',
            'We encourage users to review this Privacy Policy periodically.',
          ],
        },
      ],
    },
  ],

  contact: {
    title: 'Contact Us',
    lead: 'If you have any questions, concerns or requests regarding this Privacy Policy or your personal information, please contact Smira Club.',
    email: 'support@smira.club',
    /** The Figma leaves this as a placeholder; it needs the real desk line. */
    phone: '+91 98200 11223',
    note: 'Smira Club’s published membership information lists these support contact details and Mumbai-area office locations.',
  },

  updated: '03 Sep 2026',
};
