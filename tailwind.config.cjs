/** @type {import('tailwindcss').Config} */

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': '#f2efdd',
        'secondary': '#910f3f',
        'darkred': 'rgb(61, 8, 27)',
        'lightred': 'hsl(337.8, 81.3%, 41.4%)'
      },
      fontFamily: {
        mariposa: ['Mariposa', 'sans'],
        archivo: ['Archivo']
      }
    },
  },
  plugins: [
    require('@headlessui/tailwindcss')({ prefix: 'ui' }),
  ],
};

module.exports = config;
