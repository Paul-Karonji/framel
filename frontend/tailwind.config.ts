import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Framel Custom Color Palette
        primary: {
          DEFAULT: '#E89FAE',    // Blush Pink
          light: '#F5C5D0',
          dark: '#D67B8C',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#A8C3A6',    // Sage Green
          light: '#C5D8C3',
          dark: '#8AA888',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#D9B26F',    // Gold
          light: '#E5C68E',
          dark: '#C39E55',
          foreground: '#3A3A3A',
        },
        background: {
          DEFAULT: '#FFF9F5',    // Ivory White
          paper: '#FFFFFF',
        },
        text: {
          primary: '#3A3A3A',    // Charcoal Gray
          secondary: '#6B6B6B',
        },
        error: {
          DEFAULT: '#E57373',    // Soft Red
          light: '#FFCDD2',
          dark: '#D32F2F',
        },
        success: {
          DEFAULT: '#7BAE7F',    // Muted Green
          light: '#C8E6C9',
          dark: '#388E3C',
        },
        // shadcn/ui compatibility
        border: '#E89FAE',
        input: '#E89FAE',
        ring: '#E89FAE',
        foreground: '#3A3A3A',
        muted: {
          DEFAULT: '#F5F5F5',
          foreground: '#6B6B6B',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#3A3A3A',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#3A3A3A',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Playfair Display', 'serif'],
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
