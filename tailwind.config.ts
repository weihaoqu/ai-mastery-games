import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Stitch Material Design 3 palette
        primary: "#006a2d",
        "primary-dim": "#005d26",
        "primary-container": "#9cfaaa",
        "on-primary": "#ceffd0",
        "on-primary-container": "#006129",
        "on-primary-fixed": "#004c1e",
        secondary: "#9b3f00",
        "secondary-dim": "#883700",
        "secondary-container": "#ffc5aa",
        "on-secondary": "#fff0ea",
        "on-secondary-container": "#7b3100",
        tertiary: "#5b4bb4",
        "tertiary-dim": "#4f3ea7",
        "tertiary-container": "#b2a5ff",
        "on-tertiary": "#f6f0ff",
        error: "#b02500",
        "error-container": "#f95630",
        "on-error": "#ffefec",
        surface: "#e5ffcb",
        "surface-dim": "#b4e28e",
        "surface-bright": "#e5ffcb",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#d8fcb8",
        "surface-container": "#cdf4ac",
        "surface-container-high": "#c6efa3",
        "surface-container-highest": "#beea9a",
        "on-surface": "#1c3509",
        "on-surface-variant": "#486333",
        "outline": "#627f4c",
        "outline-variant": "#98b67d",
        "inverse-surface": "#041100",
        "inverse-on-surface": "#88a66e",
        // Keep old aliases for components not yet migrated
        cyber: {
          cyan: "#3ba85a",
          magenta: "#e06820",
          green: "#2d8a47",
          purple: "#7c6dd8",
          dark: "#e8f5d8",
          card: "#fffef8",
          "card-hover": "#fefcf0",
          border: "#b8d89c",
        },
      },
      fontFamily: {
        headline: ["var(--font-headline)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        label: ["var(--font-label)", "monospace", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
        "3xl": "2.5rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
