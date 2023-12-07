import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './templates/**/*.html',
    './frontend/src/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'agora-red': {
          50: '#f2e7eb',
          100: '#e5d0d7',
          200: '#caa1af',
          300: '#bd899c',
          400: '#a35a74',
          500: '#882b4c',
          600: '#620f2d',
          700: '#620f2d',
          800: '#4a0b22',
          900: '#310816',
          950: '#19040b',
          DEFAULT: '#7B1338',
        },
        primary: {
          DEFAULT: '#3758F9',
          100: '#d7defe',
          200: '#afbcfd',
          300: '#879bfb',
          400: '#5f79fa',
          500: '#3758F9',
          600: '#2c46c7',
          700: '#213595',
          800: '#162364',
          900: '#0b1232',
        },
        dark: '#111928',
      },
    },
  },
  plugins: [forms, require('flowbite/plugin')],
};
