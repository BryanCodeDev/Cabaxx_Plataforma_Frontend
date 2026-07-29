import { Badge, SectionHeading } from '@/components/common'
import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowRight, Play, Music, X, Menu, MapPin, Clock, ChevronRight } from 'lucide-react';
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
import Input from '@/components/common/Input';
import FollowButton from '@/components/common/FollowButton';

const PLATFORMS = [
  { label: 'Spotify', href: '#' },
  { label: 'Apple Music', href: '#' },
  { label: 'YouTube Music', href: '#' },
  { label: 'Deezer', href: '#' },
];

const SOCIAL_PLATFORMS = [
  { key: 'spotify',   label: 'Spotify',   color: 'bg-[#1DB954]' },
  { key: 'instagram', label: 'Instagram', color: 'bg-gradient-to-br from-[#f09b4a] to-[#d62976]' },
  { key: 'youtube',   label: 'YouTube',   color: 'bg-red-600' },
  { key: 'tiktok',    label: 'TikTok',    color: 'bg-[#010101]' },
  { key: 'facebook',  label: 'Facebook',  color: 'bg-[#1877F2]' },
];

const GALLERY_IMAGES = artistPhotos.slice(0, 5).map((url, i) => ({ id: i, url, title: 'Cabaxx' }));

// ── Actualiza estos hitos con la historia real de Juan Esteban ──
const CAREER_MILESTONES = [
  { year: '2019', label: 'Primeras grabaciones en Mosquera, Cundinamarca' },
  { year: '2021', label: 'Primer sencillo lanzado en plataformas digitales' },
  { year: '2023', label: 'Primeras presentaciones en escenarios de la región' },
  { year: '2025', label: 'Lanzamiento oficial con ecosistema digital propio' },
];

const particles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 7,
  duration: 7 + Math.random() * 6,
  size: 1 + Math.random() * 1.75,
  gold: i % 3 === 0,
}));

/* ─────────────────────────────────────────
   Hero
───────────────────────────────────────── */
function Hero({ artist }) {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleVideoEnded = () => {
    const v = videoRef.current;
    if (v) { v.currentTime = 0; v.play(); }
  };

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] scroll-mt-16 items-center justify-center overflow-hidden bg-primary"
    >
      {/* Fondo: banner o video */}
      <div
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: artist?.banner_url
            ? `url(${artist.banner_url})`
            : 'radial-gradient(ellipse at 30% 20%, #1a0a2e, #0d0d0d 70%)',
          transform: `translateY(${scrollY * 0.3}px) scale(1.07)`,
        }}
      />
      {!artist?.banner_url && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
          style={{ transform: `translateY(${scrollY * 0.3}px) scale(1.07)` }}
          autoPlay muted loop playsInline
          poster={heroPoster}
          onEnded={handleVideoEnded}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      )}

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-primary" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-transparent to-primary/20" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:repeating-linear-gradient(0deg,#fff_0,#fff_1px,transparent_1px,transparent_4px)]" />

      {/* Partículas */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {particles.map((p) => (
          <span
            key={p.id}
            className={`absolute rounded-full ${p.gold ? 'bg-gold/40' : 'bg-accent/20'}`}
            style={{
              left: `${p.left}%`,
              bottom: '-10px',
              width: `${p.size}px`,
              height: `${p.size}px`,
              animation: `floatUp ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Contenido central */}
      <div
        className={`relative z-10 px-4 text-center transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        {/* Badge superior */}
        <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-gold/25 bg-gold/[0.06] px-5 py-2 backdrop-blur-sm">
          <span className="h-1 w-1 rounded-full bg-gold" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold sm:text-xs">
            {artist?.genre || 'Artista · Colombia'}
          </p>
        </div>

        {/* Nombre */}
        <h1 className="font-display leading-[0.9] tracking-tight drop-shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
            style={{ fontSize: 'clamp(3.25rem,14vw,7.25rem)' }}>
          <span className="bg-gradient-to-br from-white via-white to-gold/70 bg-clip-text text-transparent">
            {artist?.stage_name?.toUpperCase() || artist?.name?.toUpperCase() || 'CABAXX'}
          </span>
        </h1>

        {/* Separador */}
        <div className="mx-auto mt-6 h-px w-16 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

        {/* Tagline */}
        <p className="mx-auto mt-6 max-w-md text-base font-light leading-relaxed text-text-secondary sm:text-lg">
          {artist?.tagline || 'Música que se siente antes de escucharse.'}
        </p>

        {/* CTAs */}
        <div className="mx-auto mt-11 flex max-w-xs flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
          <Button
            size="lg"
            className="w-full sm:w-auto shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_8px_36px_rgba(0,0,0,0.45)] transition-shadow"
            onClick={() => document.getElementById('latest')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Play className="mr-2 h-5 w-5" /> Escuchar Ahora
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto border border-white/15 text-white hover:border-gold/50 hover:bg-white/5"
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Music className="mr-2 h-4 w-4" /> Conocer al Artista
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => document.getElementById('latest')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Ir a la música"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-1.5 text-text-muted/70 transition hover:text-gold"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Explorar</span>
        <svg
          className="animate-bounce"
          width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="1.75"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(15px); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) { .animate-bounce { animation: none; } }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────
   Marquee
───────────────────────────────────────── */
function Marquee({ artist }) {
  const words = [
    artist?.stage_name?.toUpperCase() || 'CABAXX',
    '·',
    artist?.genre?.toUpperCase() || 'REGGAETÓN · TRAP · FLOW COLOMBIANO',
    '·',
    'COLOMBIA',
    '·',
  ];
  const track = [...words, ...words, ...words, ...words];

  return (
    <div className="overflow-hidden border-y border-gold/15 bg-surface/40 py-3.5">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap motion-reduce:animate-none">
        {[...track, ...track].map((w, i) => (
          <span
            key={i}
            className={`flex items-center gap-10 text-xs font-semibold uppercase tracking-[0.3em] ${
              w === '·' ? 'text-gold/70' : 'text-text-muted'
            }`}
          >
            {w}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 28s linear infinite; }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────
   Latest Release
───────────────────────────────────────── */
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
    <section id="latest" ref={ref} className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:py-20 lg:py-24">
      <SectionHeading eyebrow="Recién salido" title="Último Lanzamiento" />

      <div
        className={`mt-10 transition-all duration-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        {/* Borde gradiente */}
        <div className="rounded-2xl bg-gradient-to-br from-accent/40 via-border/60 to-gold/30 p-px">
          <div className="flex flex-col items-center gap-8 rounded-2xl bg-surface p-6 sm:p-10 md:flex-row md:gap-12">
            {/* Cover */}
            <div className="relative shrink-0">
              <div className="absolute -inset-3 -z-10 rounded-2xl bg-gradient-to-br from-accent/30 to-gold/20 blur-xl" />
              <img
                src={latest.cover_url}
                alt={latest.title}
                className="h-44 w-44 rounded-2xl object-cover shadow-card sm:h-52 sm:w-52 md:h-60 md:w-60"
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
                Sencillo · {latest.album_title || 'Nuevo Sencillo'}
              </p>
              <h3 className="mt-3 font-display text-4xl text-text-primary sm:text-5xl md:text-6xl">
                {latest.title}
              </h3>
              <p className="mt-2 text-sm text-text-muted">{latest.release_date || '2025'}</p>

              {/* Plataformas */}
              <div className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
                {PLATFORMS.map((p) => (
                  <a
                    key={p.label}
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3.5 py-2 text-xs font-medium text-text-secondary transition hover:border-accent/50 hover:text-text-primary sm:text-sm"
                  >
                    {p.label}
                    <ChevronRight className="h-3 w-3 opacity-60" />
                  </a>
                ))}
              </div>

              {/* Reproducciones */}
              {target > 0 && (
                <p className="mt-6 text-sm text-text-muted">
                  <span className="font-mono text-2xl font-bold text-gold">
                    {count.toLocaleString('es-CO')}
                  </span>{' '}
                  reproducciones
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   About
───────────────────────────────────────── */
function About() {
  const { artist } = useArtist();
  const { isAuthenticated } = useAuth();
  const [ref, isVisible] = useScrollReveal({ threshold: 0.2 });
  const [stats, setStats] = useState([
    { label: 'Seguidores', value: 0, suffix: '' },
    { label: 'Reproducciones', value: 0, suffix: '' },
    { label: 'Años activo', value: 6, suffix: '' },
    { label: 'Shows realizados', value: 0, suffix: '+' },
  ]);

  useEffect(() => {
    if (!isVisible) return;
    let cancelled = false;
    (async () => {
      try {
        const [statsRes, followsRes] = await Promise.all([
          isAuthenticated
            ? artistService.getArtistStats(ARTIST_SLUG).catch(() => null)
            : Promise.resolve(null),
          communityService.countFollows(artist?.id).catch(() => null),
        ]);
        if (cancelled) return;
        const statsData = statsRes?.data?.data?.stats || statsRes?.data?.stats || {};
        const followers = followsRes?.data?.data?.total || followsRes?.data?.total || 0;
        setStats((prev) =>
          prev.map((s, i) => {
            if (i === 0) return { ...s, value: followers };
            if (i === 1) return { ...s, value: statsData.total_plays || 0 };
            return s;
          })
        );
      } catch { /* mantener defaults */ }
    })();
    return () => { cancelled = true; };
  }, [isVisible, artist?.id, isAuthenticated]);

  return (
    <section id="about" ref={ref} className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:py-20 lg:py-24">
      <div
        className={`flex flex-col items-center gap-10 transition-all duration-700 md:flex-row md:gap-16 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        {/* Foto */}
        <div className="group relative shrink-0">
          <div className="absolute -inset-3 -z-10 rounded-3xl bg-gradient-to-br from-accent/35 to-gold/25 blur-2xl transition-all duration-700 group-hover:blur-3xl" />
          <img
            src={artist?.avatar_url || artistPortrait}
            alt={artist?.stage_name || artist?.name || 'Cabaxx'}
            loading="lazy"
            className="h-52 w-52 rounded-3xl border border-border/40 object-cover shadow-card transition-transform duration-500 hover:-rotate-1 hover:scale-[1.02] sm:h-64 sm:w-64 md:h-80 md:w-80"
          />
        </div>

        {/* Texto */}
        <div className="flex-1 text-center md:text-left">
          <SectionHeading eyebrow="Biografía" title="El Artista" />

          {artist?.bio ? (
            <p className="mt-6 leading-loose text-text-secondary">{artist.bio}</p>
          ) : (
            <div className="mt-6 space-y-4 leading-loose text-text-secondary">
              <p>
                Cabaxx es un artista urbano nacido en Mosquera, Cundinamarca. Su música fusiona
                reggaetón, trap y la identidad sonora colombiana en un estilo directo, sin filtros
                y profundamente conectado con quienes lo escuchan.
              </p>
              <p>
                Desde sus primeras grabaciones hasta hoy, cada canción cuenta algo real. No hay
                poses, no hay intermediarios — solo sonido honesto que va directo al oyente.
              </p>
            </div>
          )}

          {/* Cita */}
          <blockquote className="mt-7 border-l-[3px] border-gold/50 pl-5 text-left font-display text-xl italic leading-snug text-text-primary sm:text-2xl">
            "No hago música para llenar un espacio.
            <br />
            La hago para que se quede."
          </blockquote>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                style={{ transitionDelay: `${i * 80}ms` }}
                className={`rounded-2xl border border-border bg-surface p-4 text-center transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:shadow-card ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
              >
                <p className="font-mono text-xl font-bold text-gold sm:text-2xl">
                  {s.value > 0
                    ? (s.value >= 1000
                        ? `${(s.value / 1000).toFixed(s.value >= 10000 ? 0 : 1)}K`
                        : s.value.toLocaleString('es-CO'))
                    : '—'}
                  {s.suffix}
                </p>
                <p className="mt-1 text-xs text-text-muted">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 flex justify-center md:justify-start">
            <FollowButton artistId={artist?.id} />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-20">
        <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-gold md:text-left">
          El camino hasta aquí
        </p>
        <div className="relative mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Línea horizontal */}
          <div
            className="absolute left-0 right-0 top-3.5 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block"
            aria-hidden="true"
          />
          {CAREER_MILESTONES.map((m, i) => (
            <div
              key={m.year}
              style={{ transitionDelay: `${i * 120}ms` }}
              className={`relative text-center transition-all duration-700 md:text-left ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
            >
              {/* Dot */}
              <div className="relative z-10 mx-auto flex h-7 w-7 items-center justify-center rounded-full border border-gold/40 bg-surface text-xs font-bold text-gold md:mx-0">
                {i + 1}
              </div>
              <p className="mt-3 font-mono text-sm font-semibold text-gold">{m.year}</p>
              <p className="mt-1 text-sm leading-relaxed text-text-secondary">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   Featured Songs
───────────────────────────────────────── */
function FeaturedSongs() {
  const { data } = useFetch(`/artists/${ARTIST_SLUG}/songs`, { params: { limit: 4 } });
  const songs = data?.songs?.rows || [];
  const [ref, isVisible] = useScrollReveal();

  return (
    <section
      id="music"
      ref={ref}
      className="border-y border-border/40 bg-surface/30 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl scroll-mt-20 px-4">
        <SectionHeading
          eyebrow="Discografía"
          title="Canciones"
          action={
            <Link to="/canciones">
              <Button variant="ghost" size="sm">
                Ver todas <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          }
        />
        <p className="mt-3 max-w-lg text-sm text-text-muted">
          Cada track cuenta algo distinto. Encuentra el tuyo.
        </p>

        {songs.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-border/40 bg-surface/50 p-10 text-center">
            <Music className="mx-auto mb-3 h-8 w-8 text-text-muted/40" />
            <p className="text-text-muted">La música está por caer. Vuelve pronto.</p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent shadow-[0_0_20px_rgba(230,57,70,0.5)] transition-transform duration-300 group-hover:scale-110">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 px-1">
                    <p className="truncate text-sm font-semibold text-text-primary">{song.title}</p>
                    <p className="mt-0.5 truncate text-xs text-text-muted">{song.album_title}</p>
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

/* ─────────────────────────────────────────
   Upcoming Events
───────────────────────────────────────── */
function UpcomingEvents() {
  const { data } = useFetch(`/artists/${ARTIST_SLUG}/events`, { params: { limit: 3 } });
  const events = data?.events?.rows || [];
  const [ref, isVisible] = useScrollReveal();

  if (!events.length) {
    return (
      <section id="events" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:py-20 lg:py-24">
        <SectionHeading eyebrow="Agenda" title="Próximos Eventos" />
        <div className="mt-8 rounded-2xl border border-border/40 bg-surface/40 p-10 text-center">
          <p className="text-text-muted">Próximamente fechas en tu ciudad. Activa las notificaciones.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="events" ref={ref} className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:py-20 lg:py-24">
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
        En vivo es otra experiencia. Consigue tu entrada antes de que se agoten.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
        {events.map((ev, i) => (
          <Link
            key={ev.id}
            to={`/eventos/${ev.slug}`}
            className={`transition-all duration-500 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <Card hover padding="md" className="group h-full">
              <div className="flex items-start justify-between">
                {/* Fecha */}
                <div className="rounded-xl border border-gold/30 bg-gold/5 px-3.5 py-2.5 text-center min-w-[60px]">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gold/70">
                    {new Date(ev.start_datetime).toLocaleString('es-CO', { month: 'short' })}
                  </p>
                  <p className="font-display text-3xl leading-none text-gold">
                    {new Date(ev.start_datetime).getDate()}
                  </p>
                </div>
                <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
                  {ev.is_free ? 'Gratis' : 'Con entrada'}
                </span>
              </div>
              <div className="mt-5">
                <h3 className="font-display text-2xl text-text-primary">{ev.title}</h3>
                <div className="mt-2 flex items-center gap-1.5 text-sm text-text-secondary">
                  <MapPin className="h-3.5 w-3.5 text-text-muted" />
                  {ev.venue_name}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-text-muted">
                  <Clock className="h-3 w-3" />
                  {ev.city}
                </div>
              </div>
              <Button variant="secondary" size="sm" className="mt-5 w-full group-hover:border-accent/50">
                Conseguir Entradas
              </Button>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   Gallery Preview
───────────────────────────────────────── */
function GalleryPreview() {
  const [lightbox, setLightbox] = useState(null);
  const [ref, isVisible] = useScrollReveal();

  const tileClass = (i) =>
    `group relative overflow-hidden rounded-2xl border border-border/30 transition-all duration-500 cursor-pointer ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
    } ${i === 0 ? 'col-span-2 row-span-2 aspect-[4/3]' : 'aspect-square'}`;

  return (
    <section
      id="gallery"
      ref={ref}
      className="border-y border-border/40 bg-surface/20 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Momentos"
          title="Galería"
          action={
            <Link to="/galeria">
              <Button variant="ghost" size="sm">
                Ver galería completa <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          }
        />
        <p className="mt-3 max-w-lg text-sm text-text-muted">
          Shows en vivo, estudio y detrás de cámaras.
        </p>

        {GALLERY_IMAGES.length > 0 ? (
          <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-4">
            {GALLERY_IMAGES.map((img, i) => (
              <div
                key={img.id}
                className={tileClass(i)}
                style={{ transitionDelay: `${i * 80}ms` }}
                onClick={() => setLightbox(img)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setLightbox(img)}
                aria-label={`Ver imagen ${i + 1}`}
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/25 group-hover:backdrop-blur-[1px]" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="rounded-full border border-white/40 bg-white/10 p-2.5 backdrop-blur-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-border/40 bg-surface/40 p-10 text-center">
            <p className="text-text-muted">Las fotos están en camino.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/10 p-2.5 text-white transition hover:bg-white/20"
            onClick={() => setLightbox(null)}
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={lightbox.url}
            alt={lightbox.title}
            className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────
   Merchandise
───────────────────────────────────────── */
function Merchandise() {
  const { data } = useFetch(`/artists/${ARTIST_SLUG}/products`, { params: { limit: 4 } });
  const products = data?.products?.rows || [];
  const [ref, isVisible] = useScrollReveal();

  return (
    <section id="store" ref={ref} className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:py-20 lg:py-24">
      <SectionHeading
        eyebrow="Merch oficial"
        title="Tienda"
        action={
          <Link to="/tienda">
            <Button variant="ghost" size="sm">
              Ver tienda <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        }
      />
      <p className="mt-3 max-w-lg text-sm text-text-muted">
        Piezas oficiales de edición limitada, directo del estudio a tu clóset.
      </p>

      {products.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-border/40 bg-surface/40 p-10 text-center">
          <p className="text-text-muted">La tienda abre pronto. Activa las notificaciones para ser el primero.</p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
          {products.map((p, i) => (
            <Link
              key={p.id}
              to={`/tienda/${p.slug}`}
              className={`transition-all duration-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <Card hover padding="sm" className="group">
                <div className="relative aspect-square overflow-hidden rounded-xl">
                  <img
                    src={p.cover_url}
                    alt={p.name}
                    className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  {p.stock_quantity === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <Badge variant="default">Agotado</Badge>
                    </div>
                  )}
                </div>
                <div className="mt-3 px-1">
                  <p className="truncate text-sm font-semibold text-text-primary">{p.name}</p>
                  <p className="mt-1 font-mono text-sm font-bold text-gold">
                    ${p.price?.toLocaleString('es-CO')} COP
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────
   News
───────────────────────────────────────── */
function News() {
  const { data } = useFetch(`/artists/${ARTIST_SLUG}/posts`, { params: { limit: 3, type: 'news' } });
  const posts = data?.posts?.rows || [];
  const [ref, isVisible] = useScrollReveal();

  return (
    <section
      id="news"
      ref={ref}
      className="border-t border-border/40 bg-surface/20 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4">
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
          Todo lo que se mueve alrededor del proyecto, directo desde la fuente.
        </p>

        {posts.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-border/40 bg-surface/40 p-10 text-center">
            <p className="text-text-muted">Las noticias llegan pronto.</p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
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
                    <img
                      src={post.cover_url}
                      alt=""
                      className="h-40 w-full rounded-xl object-cover"
                    />
                  )}
                  <div className="mt-4">
                    <span className="text-xs font-bold uppercase tracking-wide text-gold">
                      {post.category?.name || 'Noticia'}
                    </span>
                    <h3 className="mt-2 font-display text-2xl leading-snug text-text-primary">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary line-clamp-2">
                      {post.excerpt}
                    </p>
                    <p className="mt-3 text-xs text-text-muted">{formatDate(post.published_at)}</p>
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

/* ─────────────────────────────────────────
   Social
───────────────────────────────────────── */
function Social() {
  const { artist } = useArtist();
  const socials = artist?.social_links || [];

  return (
    <section className="border-y border-border/40 bg-surface/40">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-18">
        <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-gold">Conecta</p>
        <h2 className="mt-2 text-center font-display text-3xl text-text-primary sm:text-4xl">
          Sígueme
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-center text-sm text-text-muted">
          Contenido exclusivo, adelantos y lo que no publicamos en ningún otro lado.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-6 sm:gap-10">
          {SOCIAL_PLATFORMS.map((p) => {
            const link = socials.find((s) => s.platform?.toLowerCase() === p.key);
            if (!link) return null;
            return (
              <a
                key={p.key}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center gap-2.5 transition"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${p.color} text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow sm:h-16 sm:w-16`}
                >
                  <span className="font-display text-xl font-bold">{p.label[0]}</span>
                </div>
                <span className="text-xs font-medium text-text-secondary transition group-hover:text-text-primary">
                  {p.label}
                </span>
                {link.follower_count != null && link.follower_count > 0 && (
                  <span className="font-mono text-xs text-text-muted">
                    {link.follower_count >= 1_000_000
                      ? `${(link.follower_count / 1_000_000).toFixed(1)}M`
                      : link.follower_count >= 1_000
                      ? `${(link.follower_count / 1_000).toFixed(1)}K`
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

/* ─────────────────────────────────────────
   Newsletter
───────────────────────────────────────── */
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
      toast.success('¡Suscrito! Serás el primero en enterarte.');
      setEmail('');
    } catch {
      toast.error('No se pudo suscribir. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1a0a12] via-accent/90 to-[#150810] py-18 sm:py-24">
      {/* Luces de fondo */}
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-12 h-80 w-80 rounded-full bg-black/25 blur-3xl" />

      <div className="relative mx-auto max-w-2xl px-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold/90">Newsletter</p>
        <h2 className="mt-3 font-display text-4xl text-white sm:text-5xl">
          Sé el Primero en Saberlo
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/70">
          Lanzamientos exclusivos, fechas antes que nadie y contenido que no existe en redes sociales.
        </p>

        <form onSubmit={subscribe} className="mx-auto mt-8 flex max-w-sm flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="flex-1 border-white/15 bg-white/[0.07] text-white placeholder:text-white/40 focus:border-gold/50"
            required
          />
          <Button
            type="submit"
            disabled={loading}
            className="whitespace-nowrap bg-gold text-primary font-bold hover:bg-gold/90 shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
          >
            {loading ? 'Enviando…' : 'Suscribirme'}
          </Button>
        </form>
        <p className="mt-4 text-xs text-white/40">Sin spam. Te puedes dar de baja cuando quieras.</p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   Home Page
───────────────────────────────────────── */
export default function Home() {
  const { artist } = useArtist();

  return (
    <main>
      <Hero artist={artist} />
      <Marquee artist={artist} />
      <LatestRelease />
      <About />
      <FeaturedSongs />
      <UpcomingEvents />
      <GalleryPreview />
      <Merchandise />
      <News />
      <Social />
      <Newsletter />
    </main>
  );
}