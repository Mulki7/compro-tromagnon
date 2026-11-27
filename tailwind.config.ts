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
        admin: {
          canvas: "#EEF2EA",
          surface: "#FFFFFF",
          muted: "#F4F7F1",
          sage: "#D4DFC5",
          "sage-deep": "#C3D2B0",
          border: "#DCE3D6",
          forest: "#0D3B1E",
          "forest-deep": "#082814",
          "forest-soft": "#194E2C",
          lime: "#B8F23C",
          "lime-hover": "#A7E629",
          "lime-soft": "#E9F8C7",
          ink: "#112217",
          sub: "#526358",
          danger: "#B91C1C",
          "danger-soft": "#FCEAEA",
          amber: "#854D0E",
          "amber-soft": "#FEF3C7",
          info: "#1D4ED8",
          "info-soft": "#E8F0FE",
        },
      },
      fontFamily: {
        sans: ["var(--font-archivo-narrow)", '"Archivo Narrow"', "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        satelit: ["var(--font-archivo-narrow)", '"Archivo Narrow"', "sans-serif"],
        admin: ["var(--font-jakarta)", '"Plus Jakarta Sans"', "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      boxShadow: {
        "admin-card": "0 1px 2px rgba(13, 59, 30, 0.04), 0 8px 24px -12px rgba(13, 59, 30, 0.08)",
        "admin-float": "0 12px 32px -12px rgba(13, 59, 30, 0.22)",
      },
    },
  },
  plugins: [],
};

export default config;
