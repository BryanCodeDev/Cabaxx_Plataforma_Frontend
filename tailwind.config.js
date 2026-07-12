/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  safelist: [],
  theme: {
    extend: {
      colors: {
        primary: '#0D0D0D',
        surface: '#1A1A1A',
        'surface-2': '#252525',
        accent: '#FF3B5C',
        'accent-hover': '#E0203F',
        gold: '#FFD700',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A0A0A0',
        'text-muted': '#606060',
        border: '#2E2E2E',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        glow: '0 0 20px rgba(255,59,92,0.4)',
        'glow-sm': '0 0 8px rgba(255,59,92,0.3)',
        card: '0 4px 20px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
};
