import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ff5c00",
        secondary: "#1D1D1D",
        error: "#d90000",
      },
      fontFamily: {
        inter: ["var(--font-inter)"],
        mono: ["var(--font-jetbrains-mono)"],
      },
    },
  },
  plugins: [],
} satisfies Config;