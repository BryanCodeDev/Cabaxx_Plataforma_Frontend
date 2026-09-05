import { Badge, SectionHeading } from '@/components/common'
import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Music, X, MapPin, Clock, ChevronRight, Ticket } from 'lucide-react';
import { useArtist } from '@/hooks/useArtist';
import { useAuth } from '@/hooks/useAuth';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useFetch } from '@/hooks/useFetch';
import { communityService, artistService } from '@/services/modules';
import { ARTIST_SLUG } from '@/constants';
import { artistPortrait, artistPhotos, heroVideo, heroPoster } from '@/assets';
import { formatDate } from '@/utils/format';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import FollowButton from '@/components/common/FollowButton';

// Curva de movimiento única para toda la página — la firma "Apple" del brief
const EASE = [0.16, 1, 0.3, 1];

const PLATFORMS = [
  { label: 'Spotify', href: '#' },
  { label: 'Apple Music', href: '#' },
  { label: 'YouTube Music', href: '#' },
  { label: 'Deezer', href: '#' },
];

const SOCIAL_PLATFORMS = [
  { key: 'spotify',   label: 'Spotify' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'youtube',   label: 'YouTube' },
  { key: 'tiktok',    label: 'TikTok' },
  { key: 'facebook',  label: 'Facebook' },
];

const GALLERY_CAPTIONS = [
  'Backstage, minutos antes de salir',
  'Estudio — sesión de grabación',
  'Tarima, luces rojas',
  'Entre bastidores',
  'Camerino, pre-show',
  'Multitud, primera fila',
  'Ensayo de sonido',
  'Después del show',
];

const GALLERY_IMAGES = artistPhotos.slice(0, 8).map((url, i) => ({
  id: i,
  url,
  title: `Cabaxx en vivo — ${GALLERY_CAPTIONS[i % GALLERY_CAPTIONS.length]}`,
}));

// ── Hitos de la carrera de Cabaxx, radicado y produciendo desde Bogotá D.C., Colombia ──
const CAREER_MILESTONES = [
  { year: '2019', label: 'Primeras grabaciones en la sabana de Bogotá' },
  { year: '2021', label: 'Debut en plataformas digitales con su primer sencillo' },
  { year: '2023', label: 'Primeras presentaciones en escenarios de la capital colombiana' },
  { year: '2025', label: 'Consolidación de su plataforma digital con sede en Bogotá D.C.' },
];

const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 7,
  duration: 7 + Math.random() * 6,
  size: 1 + Math.random() * 1.75,
}));

/* ─────────────────────────────────────────
   Firma visual: barras de pulso (identidad de flow / ritmo)
───────────────────────────────────────── */
function PulseBars({ count = 5, className = '' }) {
  return (
    <span className={`inline-flex items-end gap-[3px] ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-accent shadow-[0_0_6px_rgba(255,59,92,0.8)]"
          style={{ height: '14px', animation: `homePulse 1.2s ease-in-out ${i * 0.12}s infinite` }}
        />
      ))}
      <style>{`
        @keyframes homePulse {
          0%, 100% { transform: scaleY(0.3); opacity: .5; }
          50% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </span>
  );
}

/* ─────────────────────────────────────────
   Divisor de sección con firma de marca
   (moderado: sólo en las transiciones que
   necesitan una pausa antes de cambiar de tono)
───────────────────────────────────────── */
function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-0" aria-hidden="true">
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-white/15 sm:w-24" />
      <PulseBars count={3} />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-white/15 sm:w-24" />
    </div>
  );
}

/* ─────────────────────────────────────────
   Grano cinematográfico reutilizable —
   presente sólo en las escenas "atmosféricas"
───────────────────────────────────────── */
function FilmGrain({ opacity = 0.045 }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 bg-noise mix-blend-overlay"
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}

/* ─────────────────────────────────────────
   Hero — el titular. Todo lo demás en la página
   responde a esta primera declaración.
───────────────────────────────────────── */
function Hero({ artist }) {
  const [scrollY, setScrollY] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleVideoEnded = () => {
    const v = videoRef.current;
    if (v) { v.currentTime = 0; v.play(); }
  };

  const displayName = artist?.stage_name || artist?.name || 'Cabaxx';

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] scroll-mt-16 items-end overflow-hidden bg-black sm:items-center"
      aria-label={`${displayName} — artista urbano bogotano`}
    >
      {/* Fondo: banner o video cinematográfico */}
      <div
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: artist?.banner_url
            ? `url(${artist.banner_url})`
            : 'radial-gradient(ellipse at 30% 20%, #1a0505, #050505 70%)',
          transform: `translateY(${scrollY * 0.3}px) scale(1.08)`,
          filter: 'grayscale(0) contrast(1)',
        }}
      />
      {!artist?.banner_url && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
          style={{ transform: `translateY(${scrollY * 0.3}px) scale(1.08)`, filter: 'grayscale(0) contrast(1)' }}
          autoPlay muted loop playsInline
          poster={heroPoster}
          onEnded={handleVideoEnded}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      )}

{/* Overlays: negro suave + iluminación roja + vignette */}
       <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10" />
       <div className="absolute inset-0 bg-gradient-to-t from-accent/20 via-transparent to-transparent" />
       <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/15" />
       <div className="pointer-events-none absolute inset-0 [box-shadow:inset_0_0_220px_140px_rgba(0,0,0,0.4)]" aria-hidden="true" />
       <FilmGrain opacity={0.02} />

      {/* Partículas */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full bg-accent/50"
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

      {/* Contenido — composición asimétrica, alineada a la izquierda */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-24 pt-40 sm:px-8 sm:pb-32 sm:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-7 flex items-center gap-3"
        >
          <PulseBars count={3} />
          <p className="text-[11px] font-bold uppercase tracking-mega text-white/70 sm:text-xs">
            {artist?.genre || 'Bogotá D.C., Colombia · Música urbana hecha en la capital'}
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 36, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, delay: 0.08, ease: EASE }}
          className="max-w-5xl text-balance font-display font-black leading-[0.84] tracking-tight text-white drop-shadow-[0_12px_50px_rgba(0,0,0,0.7)] text-display-lg"
        >
          NO TRADUZCO LA CALLE.
          <br />
          LA <span className="text-accent">GRABO</span> TAL CUAL.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.24, ease: EASE }}
          className="mt-8 max-w-lg text-base font-light leading-relaxed text-white/60 sm:text-lg"
        >
          {artist?.tagline ||
            `${displayName}, artista urbano bogotano — trap, reggaetón y drill grabados sin filtro desde el corazón de Bogotá D.C., Colombia. Cada lanzamiento queda como evidencia.`
          }
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.36, ease: EASE }}
          className="mt-11 flex max-w-xs flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
        >
          <Button
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => document.getElementById('latest')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Play className="mr-1 h-4 w-4" /> Escuchar el catálogo
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Ver el origen <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => document.getElementById('latest')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Ir a la música"
        className="absolute bottom-8 right-6 z-10 hidden flex-col items-center gap-1.5 text-white/50 transition hover:text-accent sm:flex sm:right-8"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Bajar</span>
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
   Marquee — cinta de identidad; el ritmo visual
   lleva incrustadas las palabras que importan para SEO
───────────────────────────────────────── */
function Marquee({ artist }) {
  const words = [
    artist?.stage_name?.toUpperCase() || 'CABAXX',
    '·',
    'ARTISTA URBANO BOGOTANO',
    '·',
    artist?.genre?.toUpperCase() || 'REGGAETÓN · TRAP · DRILL DESDE BOGOTÁ',
    '·',
    'BOGOTÁ D.C., COLOMBIA',
    '·',
    'SIN TRADUCIR',
    '·',
  ];
  const track = [...words, ...words, ...words, ...words];

  return (
    <div className="overflow-hidden border-y border-white/10 bg-[#0a0a0a] py-4">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap motion-reduce:animate-none">
        {[...track, ...track].map((w, i) => (
          <span
            key={i}
            className={`flex items-center gap-10 font-display text-sm font-bold uppercase tracking-[0.3em] ${
              w === '·' ? 'text-accent' : 'text-white/30'
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
   Lo Nuevo — split editorial: la portada se
   desborda del contenedor, la info vive en una
   columna angosta y numérica al lado. Composición
   completamente distinta a las demás secciones.
───────────────────────────────────────── */
function LatestRelease() {
  const { data } = useFetch(`/artists/${ARTIST_SLUG}/songs`, { params: { limit: 1 } });
  const latest = data?.data?.songs?.rows?.[0];
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
    <section id="latest" ref={ref} className="relative scroll-mt-20 overflow-hidden bg-black py-24 sm:py-28 lg:py-36">
      <div
        className="pointer-events-none absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full bg-accent/[0.10] blur-[150px]"
        aria-hidden="true"
      />

      <div className="container-fluid">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent">Recién salido del estudio</p>
        <h2 className="sr-only">Lo Nuevo de Cabaxx</h2>
      </div>

      <div
        className={`mt-10 grid transition-all duration-700 ease-premium md:mt-16 md:grid-cols-12 md:items-center ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        {/* Portada — se desborda hacia el margen izquierdo del viewport */}
        <div className="relative md:col-span-7 md:-ml-[6vw]">
          <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-accent/15 blur-3xl md:-inset-10" aria-hidden="true" />
          <div className="mx-4 overflow-hidden rounded-[1.75rem] border border-white/10 shadow-2xl sm:mx-8 md:mx-0 md:rounded-[2.5rem]">
            <img
              src={latest.cover_url}
              alt={`Portada del sencillo "${latest.title}" de Cabaxx`}
              className="aspect-[4/5] w-full object-cover grayscale-[0.15] transition-transform duration-[900ms] ease-premium hover:scale-[1.03] sm:aspect-[16/10] md:aspect-[4/5]"
              loading="lazy"
            />
          </div>
        </div>

        {/* Info — columna angosta, numérica, alineada a la derecha */}
        <div className="relative z-10 mt-10 px-4 sm:px-8 md:col-span-5 md:mt-0 md:pl-14">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/40">
            Sencillo · {latest.album_title || 'Catálogo 2025'}
          </p>
          <h3 className="mt-4 font-display font-black uppercase leading-[0.92] text-white text-display-md">
            {latest.title}
          </h3>
          <p className="mt-3 text-sm text-white/40">{latest.release_date || '2025'} · Streaming en todas las plataformas</p>

          {/* Plataformas */}
          <div className="mt-8 flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <a
                key={p.label}
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-white/60 transition hover:border-accent/50 hover:text-white hover:shadow-glow-sm sm:text-sm"
              >
                {p.label}
                <ChevronRight className="h-3 w-3 opacity-60" />
              </a>
            ))}
          </div>

          {/* Reproducciones */}
          {target > 0 && (
            <div className="mt-10 border-t border-white/10 pt-6">
              <span className="block font-mono text-4xl font-bold text-accent">
                {count.toLocaleString('es-CO')}
              </span>
              <span className="mt-1 block text-xs uppercase tracking-[0.25em] text-white/40">Reproducciones</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   Origen — orden invertido respecto a "Lo Nuevo".
   La cita funciona como pieza gráfica, las cifras
   como evidencia, la línea de tiempo como archivo.
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
            ? artistService.getArtistStats().catch(() => null)
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

  const displayName = artist?.stage_name || artist?.name || 'Cabaxx';

  return (
    <section id="about" ref={ref} className="relative overflow-hidden border-y border-white/10 bg-[#0a0a0a] scroll-mt-20 px-4 py-24 sm:px-8 sm:py-28 lg:py-32">
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-[460px] w-[460px] rounded-full bg-accent/[0.08] blur-[160px]"
        aria-hidden="true"
      />

      <div className="container-fluid relative">
        <div
          className={`grid gap-12 transition-all duration-700 ease-premium md:grid-cols-12 md:items-start md:gap-10 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          {/* Texto — arranca la composición */}
          <div className="order-2 md:order-1 md:col-span-7">
            <SectionHeading eyebrow="Origen" title="La Historia" />

            {artist?.bio ? (
              <p className="mt-6 max-w-lg leading-loose text-white/55">{artist.bio}</p>
            ) : (
              <div className="mt-6 max-w-lg space-y-4 leading-loose text-white/55">
                <p>
                  Nacido y radicado en Bogotá D.C., Cabaxx construyó su sonido lejos de cualquier
                  fórmula. Reggaetón, trap, drill y la calle colombiana conviven en cada tema, sin
                  poses y sin traducir nada para nadie.
                </p>
                <p>
                  Desde el primer track hasta hoy, la regla no ha cambiado: si no es real,
                  no se graba. Eso es lo único que separa a un artista de un catálogo de canciones.
                </p>
              </div>
            )}

            <blockquote className="mt-8 border-l-2 border-accent pl-6 font-display font-bold uppercase leading-snug text-white text-display-sm">
              &ldquo;No grabo para llenar un espacio.
              <br />
              Grabo para que se quede.&rdquo;
            </blockquote>

            <div className="mt-8">
              <FollowButton artistId={artist?.id} />
            </div>
          </div>

          {/* Foto — retrato grande, columna derecha */}
          <div className="order-1 md:order-2 md:col-span-5 md:pt-8">
            <div className="group relative mx-auto max-w-xs md:max-w-none">
              <div className="absolute -inset-3 -z-10 rounded-3xl bg-accent/20 blur-2xl transition-all duration-700 ease-premium group-hover:blur-3xl" aria-hidden="true" />
              <img
                src={artist?.avatar_url || artistPortrait}
                alt={`${displayName}, artista urbano bogotano, retrato de estudio`}
                loading="lazy"
                className="aspect-[4/5] w-full rounded-3xl border border-white/10 object-cover shadow-2xl grayscale transition-all duration-500 ease-premium hover:-rotate-1 hover:scale-[1.02] hover:grayscale-0"
              />
            </div>
          </div>
        </div>

        {/* Stats — evidencia, no decoración */}
        <div className="grid-stat mt-16">
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{ transitionDelay: `${i * 80}ms` }}
              className={`group rounded-2xl border border-white/10 bg-black p-5 text-center transition-all duration-500 ease-premium hover:-translate-y-1 hover:border-accent/30 hover:shadow-glow ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
            >
              <p className="font-mono text-xl font-bold text-accent sm:text-2xl">
                {s.value > 0
                  ? (s.value >= 1000
                      ? `${(s.value / 1000).toFixed(s.value >= 10000 ? 0 : 1)}K`
                      : s.value.toLocaleString('es-CO'))
                  : '—'}
                {s.suffix}
              </p>
              <p className="mt-1 text-xs text-white/40">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Timeline — el archivo, no la cronología genérica */}
        <div className="mt-20">
          <p className="text-center text-xs font-bold uppercase tracking-mega text-accent md:text-left">
            El camino hasta aquí
          </p>
          <div className="relative mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div
              className="absolute left-0 right-0 top-3.5 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent lg:block"
              aria-hidden="true"
            />
            {CAREER_MILESTONES.map((m, i) => (
              <div
                key={m.year}
                style={{ transitionDelay: `${i * 120}ms` }}
                className={`relative text-center transition-all duration-700 ease-premium md:text-left ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}
              >
                <div className="relative z-10 mx-auto flex h-7 w-7 items-center justify-center rounded-full border border-accent/50 bg-black text-xs font-bold text-accent md:mx-0">
                  {i + 1}
                </div>
                <p className="mt-3 font-mono text-sm font-semibold text-accent">{m.year}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/50">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <SectionDivider />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   Canciones — el catálogo como discografía,
   presentado como una lista ordenada real
───────────────────────────────────────── */
function FeaturedSongs() {
  const { data } = useFetch(`/artists/${ARTIST_SLUG}/songs`, { params: { limit: 4 } });
  const songs = data?.data?.songs?.rows || [];
  const [ref, isVisible] = useScrollReveal();

  return (
    <section id="music" ref={ref} className="container-fluid scroll-mt-20 py-20 sm:py-24 lg:py-28">
      <SectionHeading
        eyebrow="Discografía"
        title="Canciones"
        action={
          <Link to="/canciones">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-accent">
              Ver todas <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        }
      />
      <p className="mt-3 max-w-lg text-sm text-white/40">
        Cuatro capítulos del mismo catálogo. Cada uno se sostiene solo.
      </p>

      {songs.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-white/10 bg-[#0a0a0a] p-10 text-center">
          <Music className="mx-auto mb-3 h-8 w-8 text-white/20" />
          <p className="text-white/40">La música está por caer. Vuelve pronto.</p>
        </div>
      ) : (
        <ol className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]">
          {songs.map((song, i) => (
            <li
              key={song.id}
              className={`transition-all duration-500 ease-premium ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <Link
                to={`/canciones/${song.slug}`}
                className="group flex items-center gap-4 border-b border-white/5 px-4 py-3.5 transition-colors duration-300 last:border-b-0 hover:bg-white/[0.03] sm:px-6"
              >
                <span className="hidden w-5 shrink-0 text-center font-mono text-sm text-white/25 group-hover:text-accent sm:block">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={song.cover_url}
                    alt={`Portada de "${song.title}", canción de Cabaxx`}
                    className="h-full w-full object-cover transition duration-500 ease-premium group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/50 group-hover:opacity-100">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent shadow-glow-sm">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white transition-colors group-hover:text-accent">{song.title}</p>
                  <p className="mt-0.5 truncate text-xs text-white/35">{song.album_title || 'Sencillo'}</p>
                </div>

                <span className="hidden shrink-0 text-xs uppercase tracking-wide text-white/25 sm:block">
                  {song.duration || '—:—'}
                </span>

                <ChevronRight className="h-4 w-4 shrink-0 text-white/20 transition-transform group-hover:translate-x-1 group-hover:text-accent" />
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────
   En Vivo — línea de tiempo vertical con
   cuenta regresiva, boletos como evidencia
───────────────────────────────────────── */
function CountdownChip({ date }) {
  const [left, setLeft] = useState(null);

  useEffect(() => {
    const target = new Date(date).getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setLeft(null); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      setLeft({ d, h });
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [date]);

  if (!left) return null;
  return (
    <span className="font-mono text-[11px] font-semibold uppercase tracking-wide text-accent">
      Faltan {left.d}d {left.h}h
    </span>
  );
}

function UpcomingEvents() {
  const { data } = useFetch(`/artists/${ARTIST_SLUG}/events`, { params: { limit: 3 } });
  const events = data?.data?.events?.rows || [];
  const [ref, isVisible] = useScrollReveal();

  if (!events.length) {
    return (
      <section id="events" className="container-fluid scroll-mt-20 py-20 sm:py-24 lg:py-28">
        <SectionHeading eyebrow="Agenda" title="Próximos Shows" />
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#0a0a0a] p-10 text-center">
          <p className="text-white/40">Próximamente, fechas de concierto en tu ciudad. Activa las notificaciones.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="events" ref={ref} className="relative overflow-hidden border-y border-white/10 bg-[#0a0a0a] scroll-mt-20 py-20 sm:py-24 lg:py-28">
      <FilmGrain opacity={0.025} />
      <div className="container-fluid relative">
        <SectionHeading
          eyebrow="Agenda"
          title="Próximos Shows"
          action={
            <Link to="/eventos">
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-accent">
                Ver todos <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          }
        />
        <p className="mt-3 max-w-lg text-sm text-white/40">
          Un show en vivo no se repite. Consigue tu entrada antes de que se agote la tanda.
        </p>

        <div className="relative mt-12">
          <div className="absolute left-[27px] top-0 bottom-0 hidden w-px bg-white/10 sm:block" aria-hidden="true" />
          <div className="space-y-5">
            {events.map((ev, i) => (
              <Link
                key={ev.id}
                to={`/eventos/${ev.slug}`}
                className={`group relative flex flex-col gap-5 rounded-2xl border border-white/10 bg-black p-5 transition-all duration-500 ease-premium hover:border-accent/40 hover:shadow-glow-sm sm:flex-row sm:items-center sm:gap-8 sm:pl-16 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="absolute left-0 top-5 z-10 hidden h-14 w-14 items-center justify-center rounded-full border border-accent/40 bg-black text-center sm:flex">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-wide text-accent/70">
                      {new Date(ev.start_datetime).toLocaleString('es-CO', { month: 'short' })}
                    </p>
                    <p className="font-display text-lg leading-none text-white">
                      {new Date(ev.start_datetime).getDate()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:hidden">
                  <div className="rounded-xl border border-accent/30 bg-accent/5 px-3.5 py-2.5 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-accent/70">
                      {new Date(ev.start_datetime).toLocaleString('es-CO', { month: 'short' })}
                    </p>
                    <p className="font-display text-2xl leading-none text-white">
                      {new Date(ev.start_datetime).getDate()}
                    </p>
                  </div>
                  <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
                    {ev.is_free ? 'Entrada libre' : 'Boletería'}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="font-display text-2xl font-bold uppercase text-white transition-colors group-hover:text-accent">
                    {ev.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/45">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> {ev.venue_name}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs">
                      <Clock className="h-3 w-3" /> {ev.city}
                    </span>
                  </div>
                  <div className="mt-2">
                    <CountdownChip date={ev.start_datetime} />
                  </div>
                </div>

                <div className="hidden shrink-0 sm:block">
                  <span className="mb-3 block text-right text-xs font-semibold uppercase tracking-wide text-white/40">
                    {ev.is_free ? 'Entrada libre' : 'Boletería'}
                  </span>
                  <Button size="sm">
                    <Ticket className="mr-1.5 h-4 w-4" /> Entradas
                  </Button>
                </div>
                <Button size="sm" className="w-full sm:hidden">
                  <Ticket className="mr-1.5 h-4 w-4" /> Asegurar entrada
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   Galería — mosaico editorial con créditos
   tipo backstage-pass, revelados en hover
───────────────────────────────────────── */
function GalleryPreview() {
  const [lightbox, setLightbox] = useState(null);
  const [ref, isVisible] = useScrollReveal();

  const tileClass = (i) =>
    `group relative overflow-hidden rounded-2xl border border-white/10 transition-all duration-500 ease-premium cursor-pointer ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
    } ${i === 0 ? 'col-span-2 row-span-2 aspect-[4/3]' : 'aspect-square'}`;

  return (
    <section id="gallery" ref={ref} className="container-fluid scroll-mt-20 py-20 sm:py-24 lg:py-28">
      <SectionHeading
        eyebrow="Detrás de cámaras"
        title="Galería"
        action={
          <Link to="/galeria">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-accent">
              Ver galería completa <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        }
      />
      <p className="mt-3 max-w-lg text-sm text-white/40">
        Shows en vivo, sesiones de estudio y lo que la cámara sigue grabando cuando ya nadie está mirando.
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
              aria-label={`Ver imagen ampliada: ${img.title}`}
            >
              <img
                src={img.url}
                alt={img.title}
                className="h-full w-full object-cover grayscale-[0.3] transition duration-700 ease-premium group-hover:scale-105 group-hover:grayscale-0"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-40" />
              <p className="absolute bottom-2 left-2.5 right-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:text-[11px]">
                {GALLERY_CAPTIONS[i % GALLERY_CAPTIONS.length]}
              </p>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="rounded-full border border-accent/50 bg-black/40 p-2.5 backdrop-blur-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="#FF3B5C" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-white/10 bg-[#0a0a0a] p-10 text-center">
          <p className="text-white/40">Las fotos están en camino.</p>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
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
   Tienda — piezas de edición limitada,
   presentadas como drop, no como catálogo
───────────────────────────────────────── */
function Merchandise() {
  const { data } = useFetch(`/artists/${ARTIST_SLUG}/products`, { params: { limit: 4 } });
  const products = data?.data?.products?.rows || [];
  const [ref, isVisible] = useScrollReveal();

  return (
    <section id="store" ref={ref} className="border-y border-white/10 bg-[#0a0a0a] scroll-mt-20 py-20 sm:py-24 lg:py-28">
      <div className="container-fluid">
        <SectionHeading
          eyebrow="Merch oficial"
          title="Tienda"
          action={
            <Link to="/tienda">
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-accent">
                Ver tienda <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          }
        />
        <p className="mt-3 max-w-lg text-sm text-white/40">
          Piezas de edición limitada. Cuando se agotan, no vuelven.
        </p>

        {products.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-black p-10 text-center">
            <p className="text-white/40">El próximo drop está en producción. Activa las notificaciones para ser el primero.</p>
          </div>
        ) : (
          <div className="grid-cards mt-10">
            {products.map((p, i) => (
              <Link
                key={p.id}
                to={`/tienda/${p.slug}`}
                className={`group transition-all duration-500 ease-premium ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="overflow-hidden rounded-2xl bg-black">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={p.cover_url}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    {p.stock_quantity === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                        <Badge variant="default">Agotado</Badge>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 px-1 pb-1">
                    <p className="truncate text-sm font-semibold text-white transition-colors group-hover:text-accent">{p.name}</p>
                    <p className="mt-1 font-mono text-sm font-bold text-white/70">
                      ${p.price?.toLocaleString('es-CO')} COP
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   Noticias — al día, sin relleno
───────────────────────────────────────── */
function News() {
  const { data } = useFetch(`/artists/${ARTIST_SLUG}/posts`, { params: { limit: 3, type: 'news' } });
  const posts = data?.data?.posts?.rows || [];
  const [ref, isVisible] = useScrollReveal();

  return (
    <section id="news" ref={ref} className="container-fluid scroll-mt-20 py-20 sm:py-24 lg:py-28">
      <SectionHeading
        eyebrow="Al día"
        title="Noticias"
        action={
          <Link to="/noticias">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-accent">
              Ver todo <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        }
      />
      <p className="mt-3 max-w-lg text-sm text-white/40">
        Lo que se mueve alrededor del proyecto, contado directo desde la fuente.
      </p>

      {posts.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-white/10 bg-[#0a0a0a] p-10 text-center">
          <p className="text-white/40">Las noticias llegan pronto.</p>
        </div>
      ) : (
        <div className="grid-feature mt-10">
          {posts.map((post, i) => (
            <Link
              key={post.id}
              to={`/noticias/${post.slug}`}
              className={`transition-all duration-500 ease-premium ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="group h-full overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] transition-all duration-300 hover:border-accent/40">
                {post.cover_url && (
                  <div className="overflow-hidden">
                    <img
                      src={post.cover_url}
                      alt={post.title ? `Imagen de la noticia: ${post.title}` : ''}
                      className="h-40 w-full object-cover transition-transform duration-500 ease-premium group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-5">
                  <span className="text-xs font-bold uppercase tracking-wide text-accent">
                    {post.category?.name || 'Noticia'}
                  </span>
                  <h3 className="mt-2 font-display text-2xl font-bold leading-snug text-white">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/45 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <p className="mt-3 text-xs text-white/30">{formatDate(post.published_at)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────
   Social — donde vive el contenido que no
   pasa por ningún otro canal
───────────────────────────────────────── */
function Social() {
  const { artist } = useArtist();
  const socials = artist?.social_links || [];

  return (
    <section className="border-y border-white/10 bg-[#0a0a0a]">
      <div className="container-fluid py-16 sm:py-20">
        <p className="text-center text-xs font-bold uppercase tracking-mega text-accent">Conecta</p>
        <h2 className="mt-2 text-center font-display text-3xl font-black uppercase text-white sm:text-4xl">
          Sígueme de cerca
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-center text-sm text-white/40">
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
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black text-white transition-all duration-300 ease-premium group-hover:-translate-y-1 group-hover:border-accent group-hover:shadow-glow sm:h-16 sm:w-16">
                  <span className="font-display text-xl font-bold">{p.label[0]}</span>
                </div>
                <span className="text-xs font-medium text-white/50 transition group-hover:text-white">
                  {p.label}
                </span>
                {link.follower_count != null && link.follower_count > 0 && (
                  <span className="font-mono text-xs text-white/30">
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
   Newsletter — el cierre. El único momento
   donde el dorado aparece, como un sello.
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
      toast.success('Listo. Serás el primero en enterarte.');
      setEmail('');
    } catch {
      toast.error('No se pudo suscribir. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-black py-24 sm:py-32">
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-accent/15 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-24 -right-12 h-80 w-80 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
      <FilmGrain opacity={0.035} />

      <div className="relative mx-auto max-w-2xl px-4 text-center">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-mega text-accent">
          <span className="h-px w-6 bg-accent/60" aria-hidden="true" />
          Lista de acceso
          <span className="h-px w-6 bg-accent/60" aria-hidden="true" />
        </p>
        <h2 className="mt-4 text-balance font-display text-4xl font-black uppercase leading-[0.95] text-white sm:text-5xl">
          Sé el primero
          <br />
          en enterarte
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/50">
          Lanzamientos exclusivos, fechas de conciertos antes que nadie y contenido que no existe en redes sociales.
        </p>

        <form onSubmit={subscribe} className="mx-auto mt-8 flex max-w-sm flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="flex-1 border-white/15 bg-white/[0.04] text-white placeholder:text-white/30 focus:border-accent/60"
            required
          />
          <Button type="submit" disabled={loading} className="whitespace-nowrap">
            {loading ? 'Enviando…' : 'Suscribirme'}
          </Button>
        </form>
        <p className="mt-4 text-xs text-white/25">Sin spam. Te puedes dar de baja cuando quieras.</p>
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
    <main className="bg-black">
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