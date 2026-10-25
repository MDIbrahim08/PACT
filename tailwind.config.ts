import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080c14",
        surface: "#0f172a",
        "surface-card": "#131f37",
        "surface-light": "#f8fafc",
        industrial: {
          50: "#f0f6ff",
          100: "#e0edfe",
          200: "#bae0fd",
          300: "#7cc8fb",
          400: "#38acf6",
          500: "#0e91e6",
          600: "#0273c5",
          700: "#035ba0",
          800: "#074d84",
          900: "#0c416e",
          950: "#082a4a",
        },
        slate: {
          850: "#172033",
          925: "#0b1220",
        },
        brand: {
          blue: "#2563eb",
          electric: "#0066FF",
          navy: "#0a192f",
          steel: "#64748b",
          border: "#1e293b",
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        elevation: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)",
        glow: "0 0 20px -2px rgba(14, 145, 230, 0.35)",
        "glow-red": "0 0 25px 2px rgba(239, 68, 68, 0.4)",
        "glow-emerald": "0 0 25px 2px rgba(16, 185, 129, 0.4)",
      },
    },
  },
  plugins: [],
};
export default config;
