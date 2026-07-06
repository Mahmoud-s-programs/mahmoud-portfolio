/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        abyss: '#060812',
        abyss2: '#0a0d1d',
        ink: '#e9edf7',
        dim: '#8a93ad',
        neon: '#63f2ff',
        vio: '#a97bff',
        rose: '#ff7ac3',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      transitionTimingFunction: {
        // The three signature curves from the design tokens
        out: 'cubic-bezier(.22,1,.36,1)',
        snap: 'cubic-bezier(.85,0,.15,1)',
        spring: 'cubic-bezier(.34,1.56,.64,1)',
      },
    },
  },
  plugins: [],
}
