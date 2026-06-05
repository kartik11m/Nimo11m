/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        bebas: ["'Bebas Neue'", "sans-serif"],
        syne:  ["'Syne'",       "sans-serif"],
        dm:    ["'DM Sans'",    "sans-serif"],
        orbitron: ['Orbitron', 'monospace'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        display:   ['"Bebas Neue"', 'cursive'],
        condensed: ['"Barlow Condensed"', 'sans-serif'],
        body:      ['Barlow', 'sans-serif'],
        ui:      ["'Syne'",       "sans-serif"],
      },
      colors: {
        bg:      '#020408',
        surface: '#050d16',
        blue:    '#0066ff',
        dim:     '#334a5e',
        orange: '#FF6230',
        pink:   '#E0357A',
        purple: '#8B31E8',
        cyan:   '#00DFFF',
        'brand-bg':     '#020408',
        'brand-orange': '#FF6230',
        'brand-pink':   '#E0357A',
        'brand-purple': '#8B31E8',
        'brand-cyan':   '#00DFFF',
      },
      transitionDuration: {
        400: '400ms',
      },
      keyframes: {
        pulse2: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':       { opacity: '0.5', transform: 'scale(0.85)' },
        },
        scanFlicker: {
          '0%, 100%': { opacity: '0.6' },
          '50%':       { opacity: '0.35' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        pulse2:      'pulse2 1.4s ease-in-out infinite',
        scanFlicker: 'scanFlicker 6s linear infinite',
        float:       'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
