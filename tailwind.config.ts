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
        satelit: {
          bg: "#F1F2EE",
          surface: "#E4E6E0",
          elevated: "#D8DBD3",
          border: "#CFD3CA",
          ink: "#111111",
          muted: "#565B58",
          accent: "#31605A",
          "on-accent": "#F1F2EE",
          "accent-hover": "#224540",
          danger: "#B3261E",
        },
      },
      fontFamily: {
        sans: ["var(--font-archivo-narrow)", '"Archivo Narrow"', "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        satelit: ["var(--font-archivo-narrow)", '"Archivo Narrow"', "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
