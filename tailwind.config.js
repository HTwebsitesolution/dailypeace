/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0B1016",
        surface: "#141B23",
        primary: "#3B82F6",   // calm blue
        accent: "#FCD34D",    // warm highlight
        text: "#EAF2FF",
        muted: "#9FB0C3",
        verse: "#A5B4FC",
        danger: "#EF4444",
        success: "#22C55E"
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem"
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.25)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"]
      },
      opacity: {
        15: "0.15"
      }
    }
  },
  plugins: [require("nativewind/tailwind")],
};