import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: { inter: ["Inter", "sans-serif"] },
      colors: {
        orange: {
          500: "#F97316",
          600: "#EA580C",
        },
      },
    },
  },
  plugins: [],
};

export default config;
