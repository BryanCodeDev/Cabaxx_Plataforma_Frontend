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

export default function Footer() {
  const { artist } = useArtist();
  const [email, setEmail] = useState('');
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
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-[#060606]">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-accent/[0.05] blur-[120px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-accent/[0.04] blur-[120px]" aria-hidden="true" />
      <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div className="container-fluid relative py-16 sm:py-20">

        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          {/* ── Marca + newsletter ── */}
          <div className="md:col-span-5">
            <Link to={ROUTES.HOME} className={`group inline-flex items-center rounded-sm ${FOCUS_SURFACE}`} aria-label="Inicio">
              <img
                src={logoMark}
                alt={`${name} logo`}
                width="44"
                height="44"
                className="h-11 w-11 rounded-md object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className="ml-3 font-display text-base font-bold uppercase tracking-wider text-white">
                {name}
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
              Plataforma oficial de {name}, artista urbano bogotano. Música, eventos, tienda y comunidad — directo desde Bogotá D.C., Colombia.
            </p>

            <form onSubmit={subscribe} className="mt-8 max-w-sm">
              <label
                htmlFor="footer-newsletter"
                className="block text-[11px] font-bold uppercase tracking-[0.22em] text-white/70"
              >
                Lista de acceso
              </label>
              <p className="mt-1 text-xs text-white/40">
                Lanzamientos y fechas antes que nadie.
              </p>
              <div className="mt-3 flex gap-2">
                <Input
                  id="footer-newsletter"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  aria-label="Email de suscripción"
                  required
                  className="flex-1"
                />
                <Button type="submit" size="md" disabled={loading} className="shrink-0">
                  {loading ? 'Enviando…' : 'Entrar'}
                </Button>
              </div>
            </form>
          </div>

          {/* ── Columnas de links ── */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 md:col-span-7 md:gap-6">
            {LINK_GROUPS.map((group) => (
              <div key={group.title}>
                <h4 className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/55">
                  {group.title}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {group.links.map((l) => (
                    <li key={l.to}>
                      <Link
                        to={l.to}
                        className={`group inline-flex items-center text-sm text-white/55 transition-colors hover:text-white ${FOCUS_SURFACE}`}
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
        </div>

        {artist?.social_links?.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2.5">
            {artist.social_links.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className={`rounded-full border border-white/[0.1] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:text-white ${FOCUS_SURFACE}`}
              >
                {PLATFORM_LABELS[s.platform] || s.platform}
              </a>
            ))}
          </div>
        )}

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-6 sm:flex-row">
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} {name}. Todos los derechos reservados.
          </p>
          <p className="text-xs text-white/25">
            Plataforma desarrollada por{' '}
            <a
              href="https://mastercodecompany.com"
              target="_blank"
              rel="noreferrer"
              className={`text-white/40 transition hover:text-accent ${FOCUS_SURFACE}`}
            >
              MasterCode Company
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
