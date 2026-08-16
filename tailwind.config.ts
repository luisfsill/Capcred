import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#08130D",
        "ink-nav": "#0B1E13",
        "ink-card": "#0F2618",
        gold: "#D4B36A",
        "brand-green": "#139339",
        "brand-green-light": "#3ECA68",
        "brand-green-dark": "#016318",
        primary: {
          DEFAULT: "#139339",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#0F2618",
          foreground: "#F4F4F5",
        },
        muted: {
          DEFAULT: "#142A1C",
          foreground: "#A1A1AA",
        },
        accent: {
          DEFAULT: "#1A3D28",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#DC2626",
          foreground: "#FFFFFF",
        },
        background: "#08130D",
        foreground: "#F4F4F5",
        input: "#1A3D28",
        ring: "#3ECA68",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
