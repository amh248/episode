import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lbd: {
          bg: "#14181c",
          header: "#2c3440",
          panel: "#1c2228",
          border: "#456",
          text: "#abc",
          muted: "#678",
          green: "#00e054",
          "green-dim": "#00c030",
          orange: "#ff8000",
        },
      },
      boxShadow: {
        poster: "0 1px 3px rgba(0,0,0,0.5)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
