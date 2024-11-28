/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        'gray_primary' : 'rgb(248,248,248)',
        'green_primary' : 'rgb(107,178,82)',
        'yellow_primary' : 'rgb(255,193,7)'
      }
    },
  },
  plugins: [],
}
