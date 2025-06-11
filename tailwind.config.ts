import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"], // Ensures Tailwind scans your app directory
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5", // Custom primary color (adjust as needed)
        secondary: "#9333EA", // Custom secondary color
        background: "#0F172A", // Deep blue background for modern look
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
