/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pixel: ["'Press Start 2P'", "monospace"],
      },
      colors: {
        "dark-bg": "#0b0b0b",
        "dark-red": "#7f1d1d",
      },
    },
  },
  plugins: [],
};
