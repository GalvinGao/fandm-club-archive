/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/templates/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#163a6d",
        secondary: "#f2f2f2",
      },
      fontFamily: {
        mono: ["IBM Plex Mono", "JetBrains Mono", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
}
