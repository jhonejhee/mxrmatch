/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
          poppins: ['Poppins', 'sans-serif'], // Add Poppins as a custom font
      },
    },
  },
  darkMode: 'selector',
  plugins: [],
}

