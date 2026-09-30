import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "surface": "#f7f9fb",
        "surface-dim": "#d8dadc",
        "surface-bright": "#f7f9fb",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f4f6",
        "surface-container": "#eceef0",
        "surface-container-high": "#e6e8ea",
        "surface-container-highest": "#e0e3e5",
        "on-surface": "#191c1e",
        "on-surface-variant": "#4a4455",
        "inverse-surface": "#2d3133",
        "inverse-on-surface": "#eff1f3",
        "outline": "#7b7487",
        "outline-variant": "#ccc3d8",
        "surface-tint": "#732ee4",
        "primary": {
          DEFAULT: "#7c3aed",
          dark: "#630ed4",
          light: "#ede0ff",
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        "primary-container": "#7c3aed",
        "on-primary": "#ffffff",
        "on-primary-container": "#ede0ff",
        "secondary": {
          DEFAULT: "#b4136d",
          light: "#ffd9e4",
          container: "#fd56a7",
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          500: "#ec4899",
          600: "#db2777",
          700: "#b4136d",
        },
        "tertiary": {
          DEFAULT: "#007650",
          light: "#6ffbbe",
          dark: "#005b3d",
          50: "#ecfdf5",
          100: "#d1fae5",
          500: "#10b981",
          600: "#059669",
          700: "#007650",
        },
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
      },
      fontFamily: {
        sans: ['"Hanken Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Hanken Grotesk"', 'sans-serif'],
        body: ['"Hanken Grotesk"', 'sans-serif'],
      },
      borderRadius: {
        'card': '1.5rem',
        'pill': '9999px',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'ambient': '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
        'ambient-hover': '0 8px 30px 0 rgba(0, 0, 0, 0.10)',
        'ambient-card': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        'pill-nav': '0 -4px 20px 0 rgba(0, 0, 0, 0.05), 0 10px 30px 0 rgba(0, 0, 0, 0.08)',
      },
      spacing: {
        'container-margin': '24px',
        'section-padding': '36px',
        'card-gap': '16px',
        'inner-padding': '20px',
      }
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#7c3aed",
              foreground: "#ffffff",
            },
            secondary: {
              DEFAULT: "#b4136d",
              foreground: "#ffffff",
            },
            success: {
              DEFAULT: "#007650",
              foreground: "#ffffff",
            },
            background: "#f7f9fb",
          },
        },
      },
    }),
  ],
};

