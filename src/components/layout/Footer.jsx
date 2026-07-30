import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useArtist } from '@/hooks/useArtist';
import { ROUTES, FOCUS_SURFACE } from '@/constants';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

const LINK_GROUPS = [
  {
    title: 'Música',
    links: [
      { label: 'Canciones', to: ROUTES.SONGS },
      { label: 'Álbumes',   to: ROUTES.ALBUMS },
      { label: 'Videos',    to: ROUTES.VIDEOS },
      { label: 'Galería',   to: ROUTES.GALLERY },
    ],
  },
  {
    title: 'Agenda',
    links: [
      { label: 'Eventos', to: ROUTES.EVENTS },
    ],
  },
  {
    title: 'Comunidad',
    links: [
      { label: 'Blog',      to: ROUTES.BLOG },
      { label: 'Noticias',  to: ROUTES.NEWS },
      { label: 'Contacto',  to: ROUTES.CONTACT },
    ],
  },
  {
    title: 'Tienda',
    links: [
      { label: 'Productos',   to: ROUTES.STORE },
      { label: 'Mi cuenta',   to: ROUTES.ACCOUNT },
      { label: 'Mis pedidos', to: ROUTES.MY_ORDERS },
    ],
  },
];

const PLATFORM_LABELS = {
  spotify:   'Spotify',
  instagram: 'Instagram',
  youtube:   'YouTube',
  tiktok:    'TikTok',
  facebook:  'Facebook',
};

function PulseMark() {
  return (
    <span className="inline-flex items-end gap-[3px]" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-accent"
          style={{ height: '12px', animation: `pulseBarFooter 1.1s ease-in-out ${i * 0.15}s infinite` }}
        />
      ))}
      <style>{`
        @keyframes pulseBarFooter {
          0%, 100% { transform: scaleY(0.35); opacity: .55; }
          50% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </span>
  );
}

export default function Footer() {
  const { artist } = useArtist();
  const [email, setEmail]   = useState('');
  const [loading, setLoading] = useState(false);

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch('/api/v1/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      toast.success('¡Suscrito! Serás el primero en enterarte.');
      setEmail('');
    } catch {
      toast.error('No se pudo suscribir. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const name = artist?.stage_name || artist?.name || 'Cabaxx';

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black">
      {/* Resplandor decorativo rojo, sutil */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent/[0.06] blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-accent/[0.04] blur-3xl" aria-hidden="true" />
      {/* Línea de firma superior */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-20">

        {/* ── Grid principal ── */}
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-6 md:gap-12">

          {/* Columna marca + newsletter */}
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 md:col-span-2">
            <Link to={ROUTES.HOME} className={`inline-flex items-center gap-2.5 rounded-sm ${FOCUS_SURFACE}`}>
              <PulseMark />
              <span className="font-display text-2xl uppercase tracking-[0.06em] text-white transition-transform duration-300 hover:scale-[1.02] inline-block">
                {name}
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/45">
              Música directa, sin intermediarios. Todo lo que rodea a {name} en un solo lugar.
            </p>

            {/* Newsletter inline */}
            <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.25em] text-white/70">
              Newsletter
            </p>
            <p className="mt-1 text-xs text-white/40">
              Lanzamientos y fechas antes que nadie.
            </p>
            <form onSubmit={subscribe} className="mt-3 flex gap-2">
              <div className="flex-1 min-w-0">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  aria-label="Email de suscripción"
                  className="border-white/15 bg-white/[0.04] text-white placeholder:text-white/30 focus:border-accent/60"
                  required
                />
              </div>
              <Button
                type="submit"
                size="sm"
                disabled={loading}
                className="shrink-0 bg-accent font-bold text-white transition-transform hover:bg-accent/90 active:scale-95"
              >
                {loading ? '…' : 'Ir'}
              </Button>
            </form>
          </div>

          {/* Columnas de links */}
          {LINK_GROUPS.map((group, gi) => (
            <div
              key={group.title}
              className="animate-in fade-in slide-in-from-bottom-2 duration-700"
              style={{ animationDelay: `${gi * 75}ms`, animationFillMode: 'backwards' }}
            >
              <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/70">
                {group.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className={`group inline-flex items-center gap-1 rounded text-sm text-white/45 transition-colors hover:text-accent ${FOCUS_SURFACE}`}
                    >
                      <span className="relative">
                        {l.label}
                        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Redes sociales ── */}
        {artist?.social_links?.length > 0 && (
          <div className="mt-14 flex flex-wrap gap-3">
            {artist.social_links.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className={`rounded-full border border-white/15 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/60 hover:text-accent hover:shadow-[0_4px_20px_rgba(229,9,20,0.2)] ${FOCUS_SURFACE}`}
              >
                {PLATFORM_LABELS[s.platform] || s.platform}
              </a>
            ))}
          </div>
        )}

        {/* ── Copyright ── */}
        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} {name}. Todos los derechos reservados.
          </p>
          <p className="text-xs text-white/20">
            Plataforma desarrollada por{' '}
            <a
              href="https://mastercode.com.co"
              target="_blank"
              rel="noreferrer"
              className={`text-white/30 transition hover:text-accent ${FOCUS_SURFACE}`}
            >
              MasterCode Company
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}