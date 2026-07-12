import { useArtist } from '@/hooks/useArtist';
import { heroPoster } from '@/assets';

const FEATURES = [
  'Acceso prioritario a preventas',
  'Contenido y adelantos exclusivos',
  'Notificaciones de nuevos lanzamientos',
];

export default function AuthLayout({ eyebrow, title, subtitle, children, footer }) {
  const { artist } = useArtist();

  return (
    <div className="flex min-h-screen bg-primary">
      <div className="relative hidden w-1/2 items-center overflow-hidden lg:flex">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: artist?.cover_url
                ? `url(${artist.cover_url})`
                : `url(${heroPoster})`,
            }}
          />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/70 to-primary" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:repeating-linear-gradient(0deg,#fff_0,#fff_1px,transparent_1px,transparent_3px)]" />

        <div className="relative z-10 px-14">
          <div className="inline-flex -rotate-3 items-center rounded-xl border-2 border-primary bg-accent px-4 py-2 font-display text-2xl text-white shadow-glow">
            CABAX
          </div>
      <h2 className="mt-8 max-w-sm font-display text-4xl leading-[1.05] text-text-primary">
        Gestiona tu música, eventos y comunidad.
      </h2>
      <ul className="mt-8 space-y-3">
        {FEATURES.map((f) => (
          <li key={f} className="flex items-center gap-3 text-text-secondary">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold">
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

      <div className="flex w-full items-center justify-center px-4 py-16 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center lg:hidden">
            <div className="-rotate-3 rounded-xl border-2 border-primary bg-accent px-4 py-1.5 font-display text-lg text-white shadow-glow">
              CABAX
            </div>
          </div>

          {eyebrow && (
            <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.25em] text-gold lg:text-left">
              {eyebrow}
            </p>
          )}
          <h1 className="text-center font-display text-3xl text-text-primary lg:text-left">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-center text-sm text-text-secondary lg:text-left">{subtitle}</p>
          )}

          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
