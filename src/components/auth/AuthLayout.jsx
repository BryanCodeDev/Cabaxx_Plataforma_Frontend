import { useArtist } from '@/hooks/useArtist';
import { heroPoster } from '@/assets';

const FEATURES = [
  'Acceso prioritario a preventas',
  'Contenido y adelantos exclusivos',
  'Notificaciones de nuevos lanzamientos',
];

function Wordmark({ className = '' }) {
  return (
    <span
      className={`inline-flex -rotate-3 items-center rounded-xl border-2 border-primary bg-accent font-display font-black uppercase text-white shadow-glow ${className}`}
    >
      Cabax
    </span>
  );
}

export default function AuthLayout({ eyebrow, title, subtitle, children, footer }) {
  const { artist } = useArtist();
  const bgImage = artist?.banner_url || heroPoster;

  return (
    <div className="relative flex min-h-screen bg-primary">
      {/* ── Fondo — móvil/tablet ──
          La foto ocupa toda la pantalla, con un balance de overlay que la deja
          claramente visible (no un fondo negro con una sombra de imagen). */}
      <div className="absolute inset-0 lg:hidden" aria-hidden="true">
        <div
          className="absolute inset-0 bg-cover bg-center [animation:authKenBurns_20s_ease-in-out_infinite_alternate]"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/45 via-primary/30 to-primary/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-primary/20" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:repeating-linear-gradient(0deg,#fff_0,#fff_1px,transparent_1px,transparent_3px)]" />
      </div>

      {/* ── Panel de imagen — escritorio ── */}
      <div className="relative hidden w-1/2 items-center overflow-hidden lg:flex">
        <div
          className="absolute inset-0 bg-cover bg-center [animation:authKenBurns_22s_ease-in-out_infinite_alternate]"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/70 to-primary" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:repeating-linear-gradient(0deg,#fff_0,#fff_1px,transparent_1px,transparent_3px)]" />
        <div className="pointer-events-none absolute -left-16 top-1/3 h-72 w-72 rounded-full bg-accent/10 blur-[100px]" />

        <div className="relative z-10 px-14 animate-in fade-in slide-in-from-left-4 duration-700">
          <Wordmark className="px-4 py-2 text-2xl" />
          <h2 className="mt-8 max-w-sm font-display text-4xl leading-[1.05] text-text-primary">
            Gestiona tu música, eventos y comunidad.
          </h2>
          <ul className="mt-8 space-y-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3 text-text-secondary">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold shadow-[0_0_10px_rgba(255,215,0,0.25)]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Logo — solo móvil, flotando sobre la imagen ── */}
      <div className="absolute left-5 top-5 z-10 lg:hidden">
        <Wordmark className="px-3.5 py-1.5 text-base" />
      </div>

      {/* ── Panel de formulario ── */}
      <div className="relative z-10 flex w-full items-center justify-center px-4 py-16 lg:w-1/2">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-3 duration-700">
          {eyebrow && (
            <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.25em] text-gold drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] lg:text-left lg:drop-shadow-none">
              {eyebrow}
            </p>
          )}
          <h1 className="text-center font-display text-3xl text-text-primary drop-shadow-[0_2px_16px_rgba(0,0,0,0.6)] lg:text-left lg:drop-shadow-none">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-center text-sm text-text-secondary drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] lg:text-left lg:drop-shadow-none">
              {subtitle}
            </p>
          )}

          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6">{footer}</div>}
        </div>
      </div>

      <style>{`
        @keyframes authKenBurns {
          from { transform: scale(1.04); }
          to   { transform: scale(1.12); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="authKenBurns"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}