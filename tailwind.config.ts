import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        grunge: {
          bg: '#080808',
          surface: '#111111',
          card: '#0E0E0E',
          border: '#222222',
          text: '#EDEDED',
          muted: '#888888',
          blood: '#E50914',
          crimson: '#C8102E',
          darkred: '#550000',
        },
        punk: {
          red: '#E50914',
          crimson: '#C8102E',
          darkred: '#550000',
          blood: '#770505',
          neonred: '#FF2A2A',
          black: '#080808',
          charcoal: '#121212',
          card: '#0E0E0E',
          bone: '#EDEDED',
          paper: '#EBE6DC',
          distressed: '#222222',
        },
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #080808',
        'brutal-sm': '2px 2px 0px 0px #080808',
        'brutal-lg': '8px 8px 0px 0px #080808',
        'brutal-red': '4px 4px 0px 0px #E50914',
        'brutal-red-sm': '2px 2px 0px 0px #E50914',
        'brutal-red-lg': '8px 8px 0px 0px #E50914',
        'brutal-crimson': '4px 4px 0px 0px #C8102E',
        'brutal-white': '4px 4px 0px 0px #EDEDED',
        'brutal-white-lg': '8px 8px 0px 0px #EDEDED',
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'sans-serif'],
        body: ['Inter', 'Plus Jakarta Sans', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        glitch: ['Rubik Glitch', 'Impact', 'cursive'],
      },
      animation: {
        'marquee': 'marquee 24s linear infinite',
        'glitch': 'glitch 0.2s ease-in-out infinite alternate',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '50%': { transform: 'translate(-1px, 1px)' },
          '100%': { transform: 'translate(1px, -1px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
