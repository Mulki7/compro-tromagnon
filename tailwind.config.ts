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
          "border-strong": "#767D75",
          ink: "#111111",
          muted: "#565B58",
          disabled: "#8B908C",
          accent: "#31605A",
          "on-accent": "#F1F2EE",
          "accent-hover": "#224540",
          danger: "#A3261F",
        },
        tromagnon: {
          bg: "#F1F2EE",
          surface: "#E4E6E0",
          elevated: "#D8DBD3",
          border: "#CFD3CA",
          "border-strong": "#767D75",
          ink: "#111111",
          muted: "#565B58",
          disabled: "#8B908C",
          accent: "#31605A",
          "on-accent": "#F1F2EE",
          "accent-hover": "#224540",
        },
        /* Admin semantic tokens mapped strictly to DESIGN.md v1.4 */
        admin: {
          canvas: "#F1F2EE",
          surface: "#FAFAF8",
          muted: "#E4E6E0",
          elevated: "#D8DBD3",
          sage: "#E4E6E0",
          border: "#CFD3CA",
          "border-strong": "#767D75",
          forest: "#224540",
          "forest-deep": "#16302C",
          "forest-soft": "#31605A",
          lime: "#7DB4A9",
          "lime-hover": "#9CCBC1",
          "lime-soft": "#DCEBDD",
          "on-lime": "#0B1A17",
          ink: "#111111",
          sub: "#565B58",
          disabled: "#8B908C",
          danger: "#A3261F",
          "danger-soft": "#F3DEDB",
          amber: "#7A4F00",
          "amber-soft": "#F4E8CC",
          success: "#2B6B3A",
          "success-soft": "#DCEBDD",
          info: "#2F5E8C",
          "info-soft": "#DCE6F0",
        },
      },
      fontFamily: {
        display: ["var(--font-salmont)", "Georgia", "serif"],
        sans: ["var(--font-plus-jakarta-sans)", '"Plus Jakarta Sans"', "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        satelit: ["var(--font-plus-jakarta-sans)", '"Plus Jakarta Sans"', "sans-serif"],
        admin: ["var(--font-plus-jakarta-sans)", '"Plus Jakarta Sans"', "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      boxShadow: {
        "admin-card": "none",
        "admin-pop": "0 4px 16px rgb(17 17 17 / 0.12)",
        "admin-float": "0 4px 16px rgb(17 17 17 / 0.12)",
      },
      transitionTimingFunction: {
        tromagnon: "cubic-bezier(0.2, 0, 0, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
