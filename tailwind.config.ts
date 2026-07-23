import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#c9a84c',
          light: '#e2c97a',
          dark: '#a07830',
        },
        ink: {
          DEFAULT: '#0f0e0b',
          soft: '#1a1915',
          card: '#1e1c18',
        },
        parchment: {
          DEFAULT: '#e8d5b7',
          muted: '#b8a88a',
        },
        crimson: '#8b1a1a',
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
