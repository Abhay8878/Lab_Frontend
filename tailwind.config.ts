import type { Config } from "tailwindcss";
 
const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "ui-sans-serif", "system-ui"],
      },
      colors: {
        brand: {
          DEFAULT: "#000000",
          50: "#000000", // selectors
          100: "#D1D5DB", //tabel header
          200: "#8bcfe9",
          300: "#73bde2",
          400: "#51a2ff",
          500: "#4596cf", // Icon
          600: "#2b7fff",
          700: "#1a6fb3",
          800: "#000000", //main brand navbar
          900: "#044378",
          button: "#000000", //Buttons
          header: "#d2e9f2bd", //Header
        },
      },

// -------------------------- Set -2 ------------------------------------

      //       colors: {
      //   brand: {
      //     DEFAULT: "#065ca2",
      //     50: "#1b045a", // selectors
      //     100: "#D1D5DB", //tabel header
      //     200: "#8bcfe9",
      //     300: "#73bde2",
      //     400: "#51a2ff",
      //     500: "#4596cf", // Icon
      //     600: "#2b7fff",
      //     700: "#1a6fb3",
      //     800: "#10064d", //main brand navbar
      //     900: "#044378",
      //     button: "#0d032b", //Buttons
      //     header: "#d2e9f2bd", //Header
      //   },
      // },
    },
  },
  plugins: [],
};
 
export default config;
 
 