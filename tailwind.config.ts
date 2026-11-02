import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        covra: {
          darkest: "#07090e",
          bg: "#0d1117",
          card: "#161b22",
          surface: "#21262d",
          border: "#30363d",
          blue: "#58a6ff",
          purple: "#8957e5",
          purpleLight: "#a371f7",
          cyan: "#39c5cf",
          green: "#3fb950",
          yellow: "#d29922",
          red: "#f85149",
          text: "#f0f6fc",
          muted: "#8b949e",
          subtle: "#484f58",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "covra-glow": "radial-gradient(circle at 50% 0%, rgba(88, 166, 255, 0.15), rgba(137, 87, 229, 0.08) 40%, transparent 70%)",
      },
      boxShadow: {
        "glow-blue": "0 0 25px -5px rgba(88, 166, 255, 0.4)",
        "glow-purple": "0 0 25px -5px rgba(137, 87, 229, 0.4)",
        "card-hover": "0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(88, 166, 255, 0.2)",
      },
      keyframes: {
        pulseScan: {
          "0%, 100%": { transform: "translateY(0%)", opacity: "0.2" },
          "50%": { transform: "translateY(100%)", opacity: "0.8" },
        },
      },
      animation: {
        "scan-line": "pulseScan 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
