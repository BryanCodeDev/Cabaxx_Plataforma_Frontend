import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowRight, Play, Music, X } from 'lucide-react';
import { useArtist } from '@/hooks/useArtist';
import { useAuth } from '@/hooks/useAuth';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useFetch } from '@/hooks/useFetch';
import { communityService, artistService } from '@/services/modules';
import { ARTIST_SLUG } from '@/constants';
import { artistPortrait, artistPhotos, heroVideo, heroPoster } from '@/assets';
import { formatDate } from '@/utils/format';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Input from '@/components/common/Input';
import FollowButton from '@/components/common/FollowButton';


const PLATFORMS = ['Spotify', 'Apple Music', 'YouTube Music', 'Deezer'];

const SOCIAL_PLATFORMS = [
  { key: 'spotify', label: 'Spotify', color: 'bg-[#1DB954]' },
  { key: 'instagram', label: 'Instagram', color: 'bg-gradient-to-br from-[#f09b4a] to-[#d62976]' },
  { key: 'youtube', label: 'YouTube', color: 'bg-red-600' },
  { key: 'tiktok', label: 'TikTok', color: 'bg-black' },
  { key: 'facebook', label: 'Facebook', color: 'bg-[#1877F2]' },
];

const GALLERY_IMAGES = artistPhotos.map((url, i) => ({ id: i, url, title: 'Cabaxx' }));

const particles = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 6,
  duration: 4 + Math.random() * 5,
  size: 1 + Math.random() * 3,
  gold: i % 3 === 0,
}));

/* ---------- Hero ---------- */

function Hero({ artist }) {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary">
      <div
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: artist?.cover_url
            ? `url(${artist.cover_url})`
            : 'radial-gradient(circle at 50% 20%, #2A2430, #121016 70%)',
          transform: `translateY(${scrollY * 0.35}px) scale(1.08)`,
        }}
      />
      {!artist?.cover_url && (
        <video
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
          style={{ transform: `translateY(${scrollY * 0.35}px) scale(1.08)` }}
          autoPlay
          muted
          loop
          playsInline
          poster={heroPoster}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/50 via-primary/60 to-primary" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:repeating-linear-gradient(0deg,#fff_0,#fff_1px,transparent_1px,transparent_3px)]" />

      <div className="absolute inset-0 overflow-hidden">
        {particles.map((p) => (
          <span
            key={p.id}
            className={`absolute rounded-full ${p.gold ? 'bg-gold/50' : 'bg-accent/40'}`}
            style={{
              left: `${p.left}%`,
              bottom: '-10px',
              width: `${p.size}px`,
              height: `${p.size}px`,
              animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div
        className={`relative z-10 px-4 text-center transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="mb-5 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-gold" />
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
            Artista Urbano Colombiano
          </p>
          <span className="h-px w-8 bg-gold" />
        </div>
        <h1 className="font-display text-[15vw] leading-[0.92] tracking-tight text-text-primary drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)] sm:text-7xl md:text-8xl lg:text-9xl">
          {artist?.name?.toUpperCase() || 'CABAX'}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-text-secondary sm:text-lg md:text-xl">
          {artist?.genre || 'Reggaetón · Trap · Flow Colombiano'}
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-text-muted">
          Música, giras y contenido directo desde el estudio — sin intermediarios.
        </p>

        <div className="mx-auto mt-8 flex max-w-xs flex-col items-stretch gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
          <Button size="lg" className="w-full sm:w-auto" onClick={() => {}}>
            <Play className="mr-2 h-5 w-5" /> Escuchar Ahora
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Ver Eventos
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => document.getElementById('latest')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Music className="mr-2 h-5 w-5" /> Últimos Lanzamientos
          </Button>
        </div>
      </div>

      <button
        onClick={() => document.getElementById('latest')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Desplazarse hacia abajo"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce text-text-muted transition hover:text-gold"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-bounce { animation: none; }
        }
      `}</style>
    </section>
  );
}

function SectionHeading({ eyebrow, title, subtitle, action, align = 'left' }) {
  const centered = align === 'center';

  return (
    <div
      className={`flex gap-4 ${
        centered
          ? 'flex-col items-center text-center'
          : 'flex-col sm:flex-row sm:items-end sm:justify-between'
      }`}
    >
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">{eyebrow}</p>
        )}
        <h2 className="font-display text-3xl text-text-primary md:text-4xl">{title}</h2>
        {subtitle && <p className="mt-2 max-w-xl text-sm text-text-secondary">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ---------- Latest release ---------- */

function LatestRelease() {
  const { data } = useFetch(`/artists/${ARTIST_SLUG}/songs`, { params: { limit: 1 } });
  const latest = data?.songs?.rows?.[0];
  const [ref, isVisible] = useScrollReveal();
  const [count, setCount] = useState(0);
  const target = latest?.play_count || 0;

  useEffect(() => {
    if (!target || !isVisible) return;
    const duration = 1800;
    const startTime = performance.now();
    let frame;
    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target, isVisible]);

  if (!latest) return null;

  return (
    <section id="latest" ref={ref} className="mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-24">
      <SectionHeading eyebrow="Recién salido del horno" title="Último Lanzamiento" />

      <div
        className={`mt-8 rounded-2xl bg-gradient-to-br from-accent/50 via-border to-gold/40 p-px transition-all duration-700 sm:mt-10 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        <div className="flex flex-col items-center gap-6 rounded-2xl bg-surface p-5 sm:p-8 md:flex-row md:gap-8">
          <img
            src={latest.cover_url}
            alt={latest.title}
            className="h-40 w-40 shrink-0 rounded-xl object-cover shadow-card sm:h-48 sm:w-48 md:h-56 md:w-56"
          />
          <div className="flex-1 text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Sencillo · {latest.album_title || 'Nuevo Sencillo'}
            </p>
            <h3 className="mt-3 font-display text-3xl text-text-primary sm:text-4xl md:text-5xl">{latest.title}</h3>
            <p className="mt-2 text-text-secondary">{latest.release_date || '2025'}</p>

            <div className="mt-5 flex flex-wrap justify-center gap-2 sm:gap-3 md:justify-start">
              {PLATFORMS.map((platform) => (
                <button
                  key={platform}
                  className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary sm:px-4 sm:py-2 sm:text-sm"
                >
                  {platform}
                </button>
              ))}
            </div>

            <p className="mt-6 text-sm text-text-muted">
              <span className="font-mono text-xl text-gold">{count.toLocaleString('es-CO')}</span>{' '}
              reproducciones
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- About ---------- */

function About() {
  const { artist } = useArtist();
  const { isAuthenticated } = useAuth();
  const [ref, isVisible] = useScrollReveal({ threshold: 0.3 });
  const [stats, setStats] = useState([
    { label: 'Seguidores', value: 0, suffix: '' },
    { label: 'Reproducciones', value: 0, suffix: '' },
    { label: 'Años activo', value: 8, suffix: '' },
    { label: 'Shows realizados', value: 340, suffix: '+' },
  ]);

  useEffect(() => {
    if (!isVisible) return;
    let cancelled = false;
    (async () => {
      try {
        const [statsRes, followsRes] = await Promise.all([
          isAuthenticated ? artistService.getArtistStats(ARTIST_SLUG).catch(() => null) : Promise.resolve(null),
          communityService.countFollows(artist?.id).catch(() => null),
        ]);
        if (cancelled) return;
        const statsData = statsRes?.data?.data?.stats || statsRes?.data?.stats || {};
        const followers = followsRes?.data?.data?.total || followsRes?.data?.total || 0;
        setStats((prev) => prev.map((s, i) => {
          if (i === 0) return { ...s, value: followers };
          if (i === 1) return { ...s, value: statsData.total_plays || statsData.plays_count || 0 };
          return s;
        }));
      } catch {
        // keep defaults
      }
    })();
    return () => { cancelled = true; };
  }, [isVisible, artist?.id, isAuthenticated]);

  return (
    <section ref={ref} className="mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-24">
      <div
        className={`flex flex-col items-center gap-8 transition-all duration-700 md:flex-row md:gap-14 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        <div className="relative shrink-0">
          <div className="absolute -inset-2 -z-10 rounded-2xl bg-gradient-to-br from-accent/40 to-gold/30 blur-lg" />
          <img
            src={artist?.avatar_url || artistPortrait}
            alt={artist?.name}
            loading="lazy"
            className="h-48 w-48 rounded-2xl border border-border/60 object-cover shadow-card sm:h-60 sm:w-60 md:h-72 md:w-72"
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <SectionHeading eyebrow="Biografía" title="Acerca del Artista" />
          <p className="mt-6 leading-relaxed text-text-secondary">
            {artist?.bio ||
              'Cabaxx es uno de los artistas urbanos más representativos de Colombia. Nacido en Medellín, ha revolucionado el género con su estilo único y auténtico, fusionando reggaetón, trap y ritmos tradicionales colombianos.'}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-border bg-surface p-3 text-center transition hover:-translate-y-1 hover:border-gold/50 hover:shadow-card sm:p-4"
              >
                <p className="font-mono text-xl text-gold sm:text-2xl">
                  {(s.value || 0).toLocaleString('es-CO')}
                  {s.suffix}
                </p>
                <p className="mt-1 text-xs text-text-muted">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center md:justify-start">
            <FollowButton artistId={artist?.id} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Featured songs ---------- */

function FeaturedSongs() {
  const { data } = useFetch(`/artists/${ARTIST_SLUG}/songs`, { params: { limit: 4 } });
  const songs = data?.songs?.rows || [];
  const [ref, isVisible] = useScrollReveal();

  return (
    <section ref={ref} className="mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-24">
      <SectionHeading
        eyebrow="Discografía"
        title="Canciones"
        action={
          <Link to="/canciones">
            <Button variant="ghost" size="sm">Ver todas <ArrowRight className="ml-1 h-4 w-4" /></Button>
          </Link>
        }
      />
      <p className="mt-3 max-w-lg text-sm text-text-muted">
        Cada track cuenta algo distinto. Dale play y encuentra el tuyo.
      </p>

      {songs.length === 0 ? (
        <p className="mt-10 text-text-muted">La música está por caer. Vuelve pronto para el primer sencillo.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-4">
          {songs.map((song, i) => (
            <Link
              key={song.id}
              to={`/canciones/${song.slug}`}
              className={`transition-all duration-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <Card hover padding="sm" className="group">
                <div className="relative aspect-square overflow-hidden rounded-xl">
                  <img
                    src={song.cover_url}
                    alt={song.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-glow transition group-hover:scale-110">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="mt-3 px-1">
                  <p className="truncate font-medium text-text-primary">{song.title}</p>
                  <p className="text-xs text-text-muted">{song.album_title}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------- Upcoming events ---------- */

function UpcomingEvents() {
  const { data } = useFetch(`/artists/${ARTIST_SLUG}/events`, { params: { limit: 3 } });
  const events = data?.events?.rows || [];
  const [ref, isVisible] = useScrollReveal();

  if (!events.length) {
    return (
      <section id="events" className="mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-24">
        <SectionHeading eyebrow="Agenda" title="Próximos Eventos" />
        <p className="mt-6 text-text-muted">Pronto anunciaremos fechas. ¡Mantente atento!</p>
      </section>
    );
  }

  return (
    <section id="events" ref={ref} className="mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-24">
      <SectionHeading
        eyebrow="Agenda"
        title="Próximos Eventos"
        action={
          <Link to="/eventos">
            <Button variant="ghost" size="sm">Ver todos <ArrowRight className="ml-1 h-4 w-4" /></Button>
          </Link>
        }
      />
      <p className="mt-3 max-w-lg text-sm text-text-muted">
        Vívelo en vivo. Estas son las próximas fechas para verlo en tu ciudad.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
        {events.map((ev, i) => (
          <Link
            key={ev.id}
            to={`/eventos/${ev.slug}`}
            className={`transition-all duration-500 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <Card hover padding="md" className="h-full">
              <div className="flex items-start justify-between">
                <div className="rounded-xl border border-border bg-surface-2 px-3 py-2 text-center">
                  <p className="text-xs uppercase text-text-muted">
                    {new Date(ev.start_datetime).toLocaleString('es-CO', { month: 'short' })}
                  </p>
                  <p className="font-display text-2xl text-gold">{new Date(ev.start_datetime).getDate()}</p>
                </div>
                <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
                  {ev.is_free ? 'Gratis' : 'Entrada'}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="font-display text-2xl text-text-primary">{ev.title}</h3>
                <p className="mt-1 text-sm text-text-secondary">{ev.venue_name}</p>
                <p className="text-sm text-text-muted">{ev.city}</p>
              </div>
              <Button variant="secondary" size="sm" className="mt-4 w-full">
                Conseguir Entradas
              </Button>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ---------- Gallery preview ---------- */

function GalleryPreview() {
  const [lightbox, setLightbox] = useState(null);
  const [ref, isVisible] = useScrollReveal();

  return (
    <section ref={ref} className="mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-24">
      <SectionHeading
        eyebrow="Momentos"
        title="Galería"
        action={
          <Link to="/galeria">
            <Button variant="ghost" size="sm">Ver galería completa <ArrowRight className="ml-1 h-4 w-4" /></Button>
          </Link>
        }
      />
      <p className="mt-3 max-w-lg text-sm text-text-muted">
        Detrás de cámaras, shows en vivo y sesiones de estudio.
      </p>

      <div className="mt-8 columns-2 gap-3 sm:mt-10 sm:columns-3 sm:gap-4 lg:columns-4">
        {GALLERY_IMAGES.map((img, i) => (
          <div
            key={img.id}
            className={`mb-4 break-inside-avoid transition-all duration-500 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <button
              onClick={() => setLightbox(img)}
              className="group relative block w-full overflow-hidden rounded-xl border border-border/40"
            >
              <img src={img.url} alt={img.title} className="w-full transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-left text-sm font-medium text-white">{img.title}</p>
              </div>
              <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
            </button>
          </div>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            aria-label="Cerrar"
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          <figure className="max-w-full">
            <img src={lightbox.url} alt={lightbox.title} className="max-h-[75vh] max-w-full rounded-2xl object-contain" />
            <figcaption className="mt-3 text-center text-sm text-white/70">{lightbox.title}</figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}

/* ---------- Merchandise ---------- */

function Merchandise() {
  const { data } = useFetch(`/artists/${ARTIST_SLUG}/products`, { params: { limit: 4 } });
  const products = data?.products?.rows || [];
  const [ref, isVisible] = useScrollReveal();

  return (
    <section ref={ref} className="border-y border-border bg-surface/50">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-24">
        <SectionHeading
          eyebrow="Merch oficial"
          title="Tienda"
          action={
            <Link to="/tienda">
              <Button variant="ghost" size="sm">Ver tienda <ArrowRight className="ml-1 h-4 w-4" /></Button>
            </Link>
          }
        />
        <p className="mt-3 max-w-lg text-sm text-text-muted">
          Piezas oficiales de edición limitada, directo del estudio a tu clóset.
        </p>

        {products.length === 0 ? (
          <p className="mt-10 text-text-muted">La tienda abre pronto. Vuelve en unos días.</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 md:grid-cols-4">
            {products.map((p, i) => (
              <Link
                key={p.id}
                to={`/tienda/${p.slug}`}
                className={`transition-all duration-500 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <Card hover padding="sm" className="relative h-full">
                  {p.status === 'new' && (
                    <Badge variant="accent" size="sm" className="absolute left-2 top-2 z-10">NUEVO</Badge>
                  )}
                  {p.status === 'sold_out' && (
                    <Badge variant="error" size="sm" className="absolute left-2 top-2 z-10">AGOTADO</Badge>
                  )}
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={p.cover_url}
                      alt={p.name}
                      className="aspect-square w-full object-cover transition duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="mt-3 px-1">
                    <p className="truncate font-medium text-text-primary">{p.name}</p>
                    <p className="mt-1 font-mono text-sm text-gold">
                      ${p.price?.toLocaleString('es-CO')} COP
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- News ---------- */

function News() {
  const { data } = useFetch(`/artists/${ARTIST_SLUG}/posts`, { params: { limit: 3, type: 'news' } });
  const posts = data?.posts?.rows || [];
  const [ref, isVisible] = useScrollReveal();

  return (
    <section ref={ref} className="mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-24">
      <SectionHeading
        eyebrow="Al día"
        title="Noticias"
        action={
          <Link to="/noticias">
            <Button variant="ghost" size="sm">Ver todo <ArrowRight className="ml-1 h-4 w-4" /></Button>
          </Link>
        }
      />
      <p className="mt-3 max-w-lg text-sm text-text-muted">
        Todo lo que se mueve alrededor del proyecto, de primera mano.
      </p>

      {posts.length === 0 ? (
        <p className="mt-10 text-text-muted">Aún no hay noticias publicadas.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
          {posts.map((post, i) => (
            <Link
              key={post.id}
              to={`/noticias/${post.slug}`}
              className={`transition-all duration-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <Card hover padding="md" className="h-full">
                {post.cover_url && (
                  <img src={post.cover_url} alt="" className="h-40 w-full rounded-lg object-cover" />
                )}
                <div className="mt-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gold">
                    {post.category?.name || 'Noticia'}
                  </span>
                  <h3 className="mt-2 font-display text-2xl leading-snug text-text-primary">{post.title}</h3>
                  <p className="mt-2 text-sm text-text-secondary line-clamp-2">{post.excerpt}</p>
                  <p className="mt-3 text-xs text-text-muted">{formatDate(post.published_at)}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------- Social ---------- */

function Social() {
  const { artist } = useArtist();
  const socials = artist?.social_links || [];

  return (
    <section className="border-y border-border bg-surface/50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-gold">Conecta</p>
        <h2 className="mt-2 text-center font-display text-2xl text-text-primary sm:text-3xl">Sígueme</h2>
        <p className="mx-auto mt-2 max-w-sm text-center text-sm text-text-muted">
          Historias, adelantos y contenido que no sale en ningún otro lado.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-5 sm:mt-10 sm:gap-8">
          {SOCIAL_PLATFORMS.map((p) => {
            const link = socials.find((s) => s.platform?.toLowerCase() === p.key);
            if (!link) return null;
            return (
              <a
                key={p.key}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center gap-2 transition"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${p.color} text-white shadow-lg transition group-hover:scale-110 group-hover:shadow-glow sm:h-16 sm:w-16`}
                >
                  <span className="font-display text-xl">{p.label[0]}</span>
                </div>
                <span className="text-xs text-text-secondary">{p.label}</span>
                {link.follower_count != null && (
                  <span className="font-mono text-xs text-text-muted">
                    {link.follower_count >= 1_000_000
                      ? `${(link.follower_count / 1_000_000).toFixed(1)}M`
                      : link.follower_count.toLocaleString('es-CO')}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Newsletter ---------- */

function Newsletter() {
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
      toast.success('¡Suscrito! Te avisaremos de novedades.');
      setEmail('');
    } catch {
      toast.error('No se pudo suscribir. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-accent via-accent to-accent-hover py-16 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:repeating-linear-gradient(45deg,#fff_0,#fff_1px,transparent_1px,transparent_6px)]" />
      <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
      <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-black/20 blur-3xl" />

      <div className="relative mx-auto max-w-2xl px-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">Newsletter</p>
        <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl md:text-5xl">Sé el Primero en Saberlo</h2>
        <p className="mt-3 text-white/80">
          Lanzamientos exclusivos, fechas antes que nadie y contenido que no publicamos en ningún otro lado.
        </p>
        <form onSubmit={subscribe} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="flex-1 border-white/20 bg-white/10 text-white placeholder:text-white/60 focus:border-white"
            required
          />
          <Button type="submit" disabled={loading} className="whitespace-nowrap bg-white text-accent hover:bg-white/90">
            {loading ? 'Enviando…' : 'Suscribirse'}
          </Button>
        </form>
        <p className="mt-4 text-xs text-white/60">Sin spam. Puedes darte de baja cuando quieras.</p>
      </div>
    </section>
  );
}

/* ---------- Home page ---------- */

export default function Home() {
  const { artist } = useArtist();

  return (
    <>
      <Hero artist={artist} />
      <LatestRelease />
      <About />
      <FeaturedSongs />
      <UpcomingEvents />
      <GalleryPreview />
      <Merchandise />
      <News />
      <Social />
      <Newsletter />
    </>
  );
}