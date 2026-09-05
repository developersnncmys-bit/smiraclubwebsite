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
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
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
