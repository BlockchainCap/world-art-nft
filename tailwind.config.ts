import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'custom-black': '#2D2C2C',
        'custom-white': '#E2DFDA',
        'custom-hover': '#D5D2CD',
        'custom-focus': '#C8C5C0',
      },
      fontFamily: {
        'twk-lausanne': ['TWKLausanne', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
