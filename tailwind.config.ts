import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'serif'],
      },
      colors: {
        background: "#0A0A0A", // deep black
        charcoal: "#1A1A1A",
        surface: "#242424",
        gold: {
          light: "#FFE55C",
          DEFAULT: "#D4AF37",
          dark: "#B8860B",
          gradient: "linear-gradient(90deg, #D4AF37 0%, #FFDF00 100%)"
        }
      },
    },
  },
  plugins: [],
};
export default config;
