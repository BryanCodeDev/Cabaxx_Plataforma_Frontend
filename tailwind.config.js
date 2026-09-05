import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  safelist: [],
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
      '4xl': '2560px',
    },
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        surface: 'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
        accent: '#FF3B5C',
        'accent-hover': '#E0203F',
        gold: '#FF3B5C',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        border: 'var(--color-border)',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['Inter', ...defaultTheme.fontFamily.sans],
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
      },
      fontSize: {
        eyebrow: ['11px', { lineHeight: '1', letterSpacing: '0.3em' }],
        kicker: ['13px', { lineHeight: '1.2', letterSpacing: '0.16em' }],
        'display-sm': ['clamp(2.25rem,5.5vw,3.5rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(3rem,8vw,5rem)', { lineHeight: '0.92', letterSpacing: '-0.025em' }],
        'display-lg': ['clamp(3.5rem,11.5vw,8.5rem)', { lineHeight: '0.84', letterSpacing: '-0.03em' }],
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '112rem',
        '10xl': '132rem',
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
        'elev-1': '0 2px 8px rgba(0,0,0,0.4)',
        'elev-2': '0 8px 24px rgba(0,0,0,0.5)',
        'elev-3': '0 24px 60px rgba(0,0,0,0.7)',
        'glow-sm': '0 0 8px rgba(255,59,92,0.3)',
        glow: '0 0 20px rgba(255,59,92,0.4)',
        'glow-lg': '0 0 60px rgba(255,59,92,0.35)',
        card: '0 4px 20px rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        // Grano cinematográfico reutilizable vía bg-noise
        noise:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        'mesh-red': 'radial-gradient(ellipse 60% 50% at 30% 20%, rgba(255,59,92,0.14), transparent 70%)',
        'red-sheen': 'linear-gradient(110deg, transparent 20%, rgba(255,59,92,0.35) 50%, transparent 80%)',
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