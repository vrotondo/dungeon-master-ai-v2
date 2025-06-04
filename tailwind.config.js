/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fantasy-dark': '#1a1a2e',
        'fantasy-medium': '#16213e',
        'fantasy-light': '#0f3460',
        'fantasy-accent': '#e94560',
        'fantasy-gold': '#ffd700',
        'fantasy-silver': '#c0c0c0'
      }
    },
  },
  plugins: [],
}