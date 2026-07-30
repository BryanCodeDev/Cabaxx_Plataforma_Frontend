import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '@/constants';
import { artistPortrait } from '@/assets';
import { useArtist } from '@/hooks/useArtist';

function PulseMark({ className = '' }) {
  return (
    <span className={`inline-flex items-end gap-[3px] ${className}`} aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-accent shadow-[0_0_6px_rgba(229,9,20,0.8)]"
          style={{ height: '13px', animation: `authPulse 1.1s ease-in-out ${i * 0.15}s infinite` }}
        />
      ))}
      <style>{`
        @keyframes authPulse {
          0%, 100% { transform: scaleY(0.3); opacity: .5; }
          50% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </span>
  );
}

/**
 * Layout compartido por las páginas de autenticación.
 * La imagen del artista es el fondo a pantalla completa en todos los breakpoints
 * (no un panel lateral que se oculta en móvil) — así la identidad visual nunca desaparece.
 * @param {string} eyebrow
 * @param {string} title
 * @param {string} subtitle
 * @param {node} footer
 * @param {node} children - normalmente un <Card> con el formulario
 */
export default function AuthLayout({ eyebrow, title, subtitle, footer, children }) {
  const { artist } = useArtist();
  const name = artist?.stage_name || artist?.name || 'Cabaxx';
  const bgImage = artist?.banner_url || artist?.avatar_url || artistPortrait;

  return (
    <div className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-black px-4 py-10 sm:py-16">
      {/* Fondo cinematográfico — visible en TODOS los tamaños de pantalla */}
      <div
        className="absolute inset-0 bg-cover [animation:authKenBurns_24s_ease-in-out_infinite_alternate]"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundPosition: 'center 20%',
          filter: 'grayscale(0.45) contrast(1.15)',
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/75 to-black" />
      <div className="absolute inset-0 bg-gradient-to-t from-accent/25 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:repeating-linear-gradient(0deg,#fff_0,#fff_1px,transparent_1px,transparent_4px)]" />
      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-accent/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-24 bottom-1/4 h-72 w-72 rounded-full bg-accent/10 blur-[100px]" />

      {/* Logo */}
      <Link
        to={ROUTES.HOME}
        className="absolute left-5 top-5 z-10 flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:left-8 sm:top-8"
        aria-label="Inicio"
      >
        <PulseMark />
        <span className="font-display text-xl font-black uppercase tracking-tight text-white">{name}</span>
      </Link>

      {/* Contenido */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-8 text-center">
          {eyebrow && (
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.35em] text-accent">{eyebrow}</p>
          )}
          <h1 className="font-display text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-white/50">{subtitle}</p>
          )}
        </div>

        {children}

        {footer && <div className="mt-6">{footer}</div>}
      </motion.div>

      <style>{`
        @keyframes authKenBurns {
          from { transform: scale(1.06) translateY(0); }
          to   { transform: scale(1.14) translateY(-1.5%); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="authKenBurns"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}