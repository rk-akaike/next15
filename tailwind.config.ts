import type { Config } from "tailwindcss";

export default {
  darkMode: "selector",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "bg-red-200",
    "shadow-red-300",
    "bg-orange-200",
    "shadow-orange-300",
    "bg-yellow-200",
    "shadow-yellow-300",
    "bg-green-200",
    "shadow-green-300",
    "bg-blue-200",
    "shadow-blue-300",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
