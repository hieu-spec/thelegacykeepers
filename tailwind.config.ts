// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: "#F4EFE6",
          card: "#FAF6EE",
          dark: "#EAE0D0",
        },
        bronze: {
          light: "#E6C786",
          DEFAULT: "#B48327",
          border: "#C8AE7D",
          dark: "#9E7B42",
        },
        cinnabar: {
          DEFAULT: "#8B1E1E",
          hover: "#6E1616",
        },
        ink: {
          DEFAULT: "#2B2118",
          sepia: "#5C4938",
        },
        jade: {
          DEFAULT: "#2E5A44",
        },
      },
      fontFamily: {
        sans: ["'Be Vietnam Pro'", "sans-serif"],
        heritage: ["'Playfair Display'", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;

