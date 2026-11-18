/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff1ed",
          100: "#ffe0d4",
          200: "#ffc0a8",
          300: "#ff9a74",
          400: "#ff6f3c",
          500: "#ee4d2d",
          600: "#d63a1c",
          700: "#b32c15",
          800: "#8f2513",
          900: "#752313",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
