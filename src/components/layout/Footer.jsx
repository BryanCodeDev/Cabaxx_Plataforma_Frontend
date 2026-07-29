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
    <footer className="relative overflow-hidden border-t border-border/60 bg-surface">
      {/* Resplandor decorativo sutil */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent/[0.04] blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-gold/[0.04] blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-16">

        {/* ── Grid principal ── */}
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-6 md:gap-12">

          {/* Columna marca + newsletter */}
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 md:col-span-2">
            <Link to={ROUTES.HOME} className={`inline-block rounded-sm ${FOCUS_SURFACE}`}>
              <span className="font-display text-2xl tracking-widest text-accent transition-transform duration-300 hover:scale-[1.03] hover:text-accent/80 inline-block">
                {name.toUpperCase()}
              </span>
            </Link>

            <p className="mt-3 max-w-xs text-sm leading-relaxed text-text-muted">
              Música directa, sin intermediarios. Todo lo que rodea a {name} en un solo lugar.
            </p>

            {/* Newsletter inline */}
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-text-secondary">
              Newsletter
            </p>
            <p className="mt-1 text-xs text-text-muted">
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
                  required
                />
              </div>
              <Button type="submit" size="sm" disabled={loading} className="shrink-0 transition-transform active:scale-95">
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
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-text-secondary">
                {group.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className={`group inline-flex items-center gap-1 rounded text-sm text-text-muted transition-colors hover:text-accent ${FOCUS_SURFACE}`}
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
          <div className="mt-12 flex flex-wrap gap-2.5">
            {artist.social_links.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className={`rounded-full border border-border/60 px-4 py-1.5 text-xs font-medium text-text-secondary transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/60 hover:text-accent hover:shadow-sm ${FOCUS_SURFACE}`}
              >
                {PLATFORM_LABELS[s.platform] || s.platform}
              </a>
            ))}
          </div>
        )}

        {/* ── Copyright ── */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border/40 pt-6 sm:flex-row">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} {name}. Todos los derechos reservados.
          </p>
          <p className="text-xs text-text-muted/50">
            Plataforma desarrollada por{' '}
            <a
              href="https://mastercode.com.co"
              target="_blank"
              rel="noreferrer"
              className={`text-text-muted/70 transition hover:text-accent ${FOCUS_SURFACE}`}
            >
              MasterCode Company
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}