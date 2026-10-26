/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Outfit", "Plus Jakarta Sans", "Inter", "sans-serif"],
        outfit: ["Outfit", "sans-serif"],
        jakarta: ["Plus Jakarta Sans", "sans-serif"],
        mono: ["Space Mono", "monospace"],
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        neon: {
          lime: "#ffffff",
          emerald: "#38bdf8",
          dark: "#030a16",
          surface: "#071731",
          border: "rgba(255, 255, 255, 0.08)",
        },
        navy: {
          950: "#020712",
          900: "#040d1a",
          850: "#06152d",
          800: "#082142",
          700: "#0d3266",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
