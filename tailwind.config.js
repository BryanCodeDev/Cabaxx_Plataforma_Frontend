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
      // Tracking editorial extremo — usado en eyebrows y kickers de marca
      letterSpacing: {
        mega: '0.35em',
      },
      boxShadow: {
        glow: '0 0 20px rgba(255,59,92,0.4)',
        'glow-sm': '0 0 8px rgba(255,59,92,0.3)',
        'glow-lg': '0 0 60px rgba(255,59,92,0.35)',
        // Toque dorado — reservado para 1-2 momentos "premium" por página, nunca decorativo masivo
        'glow-gold': '0 0 24px rgba(255,215,0,0.22)',
        card: '0 4px 20px rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        // Grano cinematográfico reutilizable vía bg-noise
        noise:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        'mesh-red': 'radial-gradient(ellipse 60% 50% at 30% 20%, rgba(255,59,92,0.14), transparent 70%)',
        'gold-sheen': 'linear-gradient(110deg, transparent 20%, rgba(255,215,0,0.35) 50%, transparent 80%)',
      },
      // Curva de easing tipo Apple — usar como `ease-premium` junto a transition-*
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 3.2s linear infinite',
      },
    },
  },
  plugins: [],
};