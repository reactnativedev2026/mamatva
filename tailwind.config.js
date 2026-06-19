/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B5A',
        'primary-light': '#FFE5E0',
        secondary: '#6B7280',
        'secondary-light': '#F3F4F6',
      },
    },
  },
};
