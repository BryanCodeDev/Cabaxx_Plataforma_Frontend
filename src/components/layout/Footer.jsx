import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useArtist } from '@/hooks/useArtist';
import { ROUTES, FOCUS_SURFACE } from '@/constants';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { logoMark } from '@/assets';

const LINK_GROUPS = [
  {
    title: 'Sonido',
    links: [
      { label: 'Canciones', to: ROUTES.SONGS },
      { label: 'Álbumes',   to: ROUTES.ALBUMS },
      { label: 'Videos',    to: ROUTES.VIDEOS },
      { label: 'Galería',   to: ROUTES.GALLERY },
    ],
  },
  {
    title: 'En vivo',
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
          className="w-[3px] rounded-full bg-accent shadow-[0_0_6px_rgba(229,9,20,0.8)]"
          style={{ height: '13px', animation: `pulseBarFooter 1.1s ease-in-out ${i * 0.15}s infinite` }}
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
      toast.success('Listo. Serás de los primeros en enterarte.');
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
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-accent/[0.07] blur-[100px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-accent/[0.05] blur-[100px]" aria-hidden="true" />
      {/* Línea de firma superior */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

      <div className="container-fluid relative px-0 py-20 sm:py-24">

        {/* ── Titular editorial ── */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">Directo al oyente</p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl md:text-6xl">
            Conexión directa.
            <br />
            Bogotá para el mundo.
          </h2>
        </div>

        {/* ── Grid principal ── */}
        <div className="mt-16 grid gap-10 sm:grid-cols-2 md:grid-cols-12 md:gap-12">

          {/* Columna marca + newsletter */}
          <div className="md:col-span-4">
            <Link to={ROUTES.HOME} className={`group inline-flex items-center rounded-sm ${FOCUS_SURFACE}`} aria-label="Inicio">
              <img
                src={logoMark}
                alt={`${name} logo`}
                width="48"
                height="48"
                className="h-11 w-11 rounded-md object-contain transition-transform duration-300 group-hover:scale-105 sm:h-12 sm:w-12"
              />
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/40">
              Plataforma oficial de {name}, artista urbano bogotano. Música, eventos, tienda y comunidad — todo directo desde Bogotá D.C., Colombia.
            </p>

            {/* Newsletter inline */}
            <p className="mt-9 text-[11px] font-bold uppercase tracking-[0.28em] text-white/70">
              Lista de acceso
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
                className="shrink-0"
              >
                {loading ? '···' : 'Entrar'}
              </Button>
            </form>
          </div>

          {/* Columnas de links */}
          {LINK_GROUPS.map((group, gi) => (
            <div
              key={group.title}
              className="animate-in fade-in slide-in-from-bottom-2 duration-700 sm:col-span-1 md:col-span-2"
              style={{ animationDelay: `${gi * 75}ms`, animationFillMode: 'backwards' }}
            >
              <h4 className="text-[11px] font-bold uppercase tracking-[0.28em] text-white/50">
                {group.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className={`group inline-flex items-center gap-1 rounded text-[15px] text-white/55 transition-colors hover:text-white ${FOCUS_SURFACE}`}
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
          <div className="mt-16 flex flex-wrap gap-3">
            {artist.social_links.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className={`rounded-full border border-white/15 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/60 hover:text-white hover:shadow-[0_8px_24px_rgba(229,9,20,0.25)] ${FOCUS_SURFACE}`}
              >
                {PLATFORM_LABELS[s.platform] || s.platform}
              </a>
            ))}
          </div>
        )}

        {/* ── Copyright ── */}
        <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} {name}. Todos los derechos reservados.
          </p>
          <p className="text-xs text-white/20">
            Plataforma desarrollada por{' '}
            <a
              href="https://mastercodecompany.com"
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