import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          cyan: "#00F0FF",
          magenta: "#FF00E5",
          green: "#00FF88",
          purple: "#A855F7",
          dark: "#0a0a1a",
          card: "#111127",
          "card-hover": "#1a1a3e",
          border: "#2a2a4a",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
