import type { Config } from 'tailwindcss';
import theme from './theme.json';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: theme.colors.primary,
          secondary: theme.colors.secondary,
          accent: theme.colors.accent,
          background: theme.colors.background,
          surface: theme.colors.surface,
          link: theme.colors.link,
        },
      },
      boxShadow: {
        glow: '0 20px 60px rgba(79,195,255,0.18)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #071326, #020617)',
      },
    },
  },
  plugins: [],
};

export default config;
