/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heebo: ['Heebo', 'sans-serif'],
      },
      colors: {
        appBg: 'var(--bg)',
        appInk: 'var(--ink)',
        appSoft: 'var(--soft)',
        appCard: 'var(--card)',
        appLine: 'var(--line)',
        appBlue: 'var(--blue)',
        appGreen: 'var(--green)',
        appClay: 'var(--clay)',
        appFar: 'var(--far)',
        appMid: 'var(--mid)',
        appNear: 'var(--near)',
        appSun: 'var(--sun)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      minHeight: {
        '16': '4rem', // 64px
        '25': '6.25rem', // 100px
      }
    },
  },
  plugins: [],
};
