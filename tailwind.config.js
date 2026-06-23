/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#000000',
          900: '#0a0a0a',
          850: '#0f0f0f',
          800: '#151515',
          750: '#1a1a1a',
          700: '#202020',
          600: '#2a2a2a',
          500: '#3a3a3a',
        },
        metal: {
          50: '#f0f0f4',
          100: '#dde0e6',
          200: '#c0c4cc',
          300: '#a0a5b0',
          400: '#7c8190',
          500: '#5c6170',
          600: '#44485a',
        },
        silver: {
          bright: '#e8e9f0',
          light: '#c8cad4',
          mid: '#989aaa',
          muted: '#6e7182',
        },
        brand: {
          600: '#1a1a1a',
          700: '#131313',
          800: '#0d0d0d',
          900: '#050505',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.025em',
      },
    },
  },
  plugins: [],
};
