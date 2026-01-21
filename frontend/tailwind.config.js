/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0B0F1A",
        card: "#111827",
        accent: "#6C5CE7",
        accentSoft: "#7C6FF5",
      },
      boxShadow: {
        glass: "0 0 40px rgba(108, 92, 231, 0.15)",
      },
      backdropBlur: {
        glass: "12px",
      },
    },
  },
  plugins: [],
};
