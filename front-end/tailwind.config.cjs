/** @type {import('tailwindcss').Config} */
module.exports = {
  content:["./src/**/*.{ts,tsx, js, jsx}"],
  theme: {
    extend: {
        animation: {
          shine: "shine 1s",
          hoverGrow: 'hover:bg-violet-500 transition duration-700 hover:scale-105'
        },
        keyframes: {
          shine: {
            "100%": { left: "125%" },
          },
        },
    },
  },
  plugins: [],
}
