import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        cream: {
          50: "#fffdf9",
          100: "#fdf6ec",
          200: "#f9ecd4",
          300: "#f3ddb0",
          400: "#ecc985",
          500: "#e3b45c",
        },
        beige: {
          50: "#faf7f2",
          100: "#f2ebdd",
          200: "#e5d6bb",
          300: "#d4bb8f",
          400: "#c2a06a",
          500: "#a9824f",
        },
        brown: {
          50: "#f7f1ea",
          100: "#e9d8c3",
          200: "#d4b48c",
          300: "#b98a5c",
          400: "#8f6339",
          500: "#5c3d24",
          600: "#432b19",
          700: "#2e1c10",
        },
        pink: {
          50: "#fff1f5",
          100: "#ffd9e4",
          200: "#ffb0c9",
          300: "#ff85ab",
          400: "#f4628a",
          500: "#e2436c",
        },
        blue: {
          50: "#f0f7fb",
          100: "#d6ebf5",
          200: "#aed7ea",
          300: "#7cbcda",
          400: "#4c9cc4",
          500: "#2f7ea8",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
