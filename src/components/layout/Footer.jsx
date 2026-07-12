import { Link } from 'react-router-dom';
import { useArtist } from '@/hooks/useArtist';
import { ROUTES, APP_NAME } from '@/constants';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const LINK_GROUPS = [
  {
    title: 'Música',
    links: [
      { label: 'Canciones', to: ROUTES.SONGS },
      { label: 'Álbumes', to: ROUTES.ALBUMS },
      { label: 'Videos', to: ROUTES.VIDEOS },
      { label: 'Galería', to: ROUTES.GALLERY },
    ],
  },
  {
    title: 'Eventos',
    links: [{ label: 'Eventos', to: ROUTES.EVENTS }],
  },
  {
    title: 'Comunidad',
    links: [
      { label: 'Blog', to: ROUTES.BLOG },
      { label: 'Noticias', to: ROUTES.NEWS },
      { label: 'Contacto', to: ROUTES.CONTACT },
    ],
  },
  {
    title: 'Tienda',
    links: [
      { label: 'Tienda', to: ROUTES.STORE },
      { label: 'Mi cuenta', to: ROUTES.ACCOUNT },
      { label: 'Mis pedidos', to: ROUTES.MY_ORDERS },
    ],
  },
];

const PLATFORM_LABELS = {
  spotify: 'Spotify',
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  facebook: 'Facebook',
};

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface';

export default function Footer() {
  const { artist } = useArtist();
  const [email, setEmail] = useState('');

  const subscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success('¡Suscrito! Te avisaremos de novedades.');
    setEmail('');
  };

  const name = artist?.name || 'Cabaxx';

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-6 md:gap-10">
          <div className="md:col-span-2">
            <span className="font-display text-2xl tracking-wide text-accent">{name}</span>
            <p className="mt-3 max-w-xs text-sm text-text-muted">
              Plataforma oficial de {name}. Música, eventos y comunidad en un solo lugar.
            </p>
            <form onSubmit={subscribe} className="mt-5 flex gap-2">
              <div className="flex-1">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  aria-label="Email de suscripción"
                />
              </div>
              <Button type="submit" size="sm">
                Suscríbete
              </Button>
            </form>
          </div>

          {LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">{group.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className={`rounded text-sm text-text-muted transition-colors hover:text-accent ${FOCUS}`}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {artist?.social_links?.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-3">
            {artist.social_links.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className={`rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-accent hover:text-accent ${FOCUS}`}
              >
                {PLATFORM_LABELS[s.platform] || s.platform}
              </a>
            ))}
          </div>
        )}

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-text-muted">
          © {new Date().getFullYear()} {name} · Cabaxx. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}