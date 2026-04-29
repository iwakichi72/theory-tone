import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#0b0d12",
          surface: "#141821",
          elevated: "#1c2230",
        },
        accent: {
          DEFAULT: "#7c5cff",
          hot: "#ff5c8a",
          cool: "#5cc8ff",
        },
        edge: "#262c3a",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(124,92,255,0.4), 0 8px 30px rgba(124,92,255,0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
