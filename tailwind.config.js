/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'idz-forest':  '#294411',
        'idz-action':  '#70B221',
        'idz-soot':    '#333333',
        'idz-alabaster':'#F8F9FB',
        'idz-pending': '#F59E0B',
        'idz-accepted':'#16A34A',
        'idz-rejected':'#EF4444',
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'soft': '12px',
      },
    },
  },
  plugins: [],
}
