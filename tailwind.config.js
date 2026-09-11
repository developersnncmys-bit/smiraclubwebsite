/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        /** The blue off the Smira Club mark. */
        brand: {
          50: '#eef6fb',
          100: '#d6e9f4',
          200: '#aed3e9',
          300: '#7ab5d8',
          400: '#4593c3',
          500: '#2a7cb0',
          600: '#1b6394',
          700: '#175074',
          800: '#154561',
          900: '#123a52',
        },
        /** The brighter blue the call-to-action buttons use. */
        action: {
          500: '#1273e6',
          600: '#0f62c4',
        },
        ink: {
          400: '#8b95a5',
          500: '#5f6b7c',
          600: '#414c5c',
          700: '#2c3542',
          900: '#111820',
        },
        surface: {
          base: '#ffffff',
          soft: '#f4f6f8',
          line: '#e6eaef',
        },
        gold: '#ffc531',
      },
      /**
       * The headings shrink on a phone and land on Tailwind's own numbers by
       * the time the window is 1024px wide.
       *
       * The Figma is drawn at phone width and its headings are a good bit
       * smaller than `text-xl` and friends, but the same classes need to keep
       * their desktop size — so rather than hang a `lg:` twin on all 160-odd
       * uses, the six heading steps interpolate between the two themselves.
       */
      fontSize: {
        lg: ['clamp(0.9375rem, 0.829rem + 0.46vw, 1.125rem)', { lineHeight: '1.5' }],
        xl: ['clamp(1rem, 0.856rem + 0.62vw, 1.25rem)', { lineHeight: '1.45' }],
        '2xl': ['clamp(1.125rem, 0.908rem + 0.92vw, 1.5rem)', { lineHeight: '1.35' }],
        '3xl': ['clamp(1.25rem, 0.889rem + 1.54vw, 1.875rem)', { lineHeight: '1.25' }],
        '4xl': ['clamp(1.5rem, 1.067rem + 1.85vw, 2.25rem)', { lineHeight: '1.2' }],
        '5xl': ['clamp(1.8125rem, 1.126rem + 2.93vw, 3rem)', { lineHeight: '1.12' }],
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Montserrat', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      maxWidth: {
        shell: '1600px',
        phone: '480px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(17,24,32,0.04), 0 8px 24px -12px rgba(17,24,32,0.16)',
        lift: '0 12px 40px -16px rgba(17,24,32,0.3)',
        nav: '0 -1px 0 #e6eaef',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.3s ease-out both',
      },
    },
  },
  plugins: [],
};
