/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ec-blue-900': '#065b43',
        'ec-grey-50': '#F7F9FA',
        'ec-grey-100': '#d1e4ed',
        'ec-grey-200': '#c1d4de',
      },
    },
  },
};
