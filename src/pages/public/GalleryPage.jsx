import { useState, useEffect, useCallback } from 'react';
import { ARTIST_SLUG } from '@/constants';
import { useFetch } from '@/hooks/useFetch';
import Spinner from '@/components/common/Spinner';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import SEOHead from '@/components/seo/SEOHead';
import { artistPhotos, videos } from '@/assets';
import { useArtist } from '@/hooks/useArtist';
import { X, Play, Filter } from 'lucide-react';

const CAPTIONS = [
  'Detrás del escenario, minutos antes de salir',
  'Sesión de estudio en Bogotá D.C.',
  'Tarima encendida, luces rojas',
  'Camerino, pre-show',
  'Primera fila, multitud',
  'Ensayo de sonido',
  'Después del show',
  'En gira por Colombia',
];

const CATEGORIES = [
  { key: 'all', label: 'Todo' },
  { key: 'photo', label: 'Fotos' },
  { key: 'video', label: 'Videos' },
];

const localItems = [
  ...artistPhotos.map((url, i) => ({
    id: `local-img-${i}`,
    file_url: url,
    title: `Cabaxx en vivo — ${CAPTIONS[i % CAPTIONS.length]}`,
    type: 'image',
    category: 'photo',
  })),
  ...videos.map((url, i) => ({
    id: `local-vid-${i}`,
    file_url: url,
    title: 'Showreel oficial',
    type: 'video',
    category: 'video',
  })),
];

function FilmGrain({ opacity = 0.04 }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 bg-noise mix-blend-overlay"
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}

export default function GalleryPage() {
  const { artist } = useArtist();
  const { data, loading } = useFetch(`/artists/${ARTIST_SLUG}/gallery`, { params: { limit: 24 } });
  const apiRows = Array.isArray(data?.data?.gallery?.rows) ? data.data.gallery.rows : [];
  const apiItems = apiRows.map((it) => ({
    ...it,
    type: it.file_type || it.type || 'image',
    category: it.category || it.file_type || 'photo',
  }));
  const items = (apiItems.length ? apiItems : localItems).map((it) => ({
    ...it,
    id: it.id ?? `${it.file_url}-${it.type}`,
  }));
  const [ref, isVisible] = useScrollReveal();
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState(null);

  const safeItems = Array.isArray(items) ? items : [];
  const visibleItems = filter === 'all' ? safeItems : safeItems.filter((it) => it.category === filter);
  const photoCount = safeItems.filter((it) => it.category === 'photo').length;
  const videoCount = safeItems.filter((it) => it.category === 'video').length;

  const closeLightbox = useCallback(() => setLightbox(null), []);
  useEffect(() => {
    if (!lightbox) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') closeLightbox(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [lightbox, closeLightbox]);

  return (
    <>
      <SEOHead
        title="Galería"
        description={`Galería oficial de ${artist?.stage_name || 'Cabaxx'}: fotografías en vivo, sesiones de estudio y videoclips grabados en Bogotá D.C., Colombia.`}
        image={items.find((it) => it.type === 'image')?.file_url}
      />
      <section className="relative overflow-hidden bg-black">
        <div className="pointer-events-none absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-accent/[0.10] blur-[160px]" aria-hidden="true" />
        <FilmGrain opacity={0.035} />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Detrás de cámaras</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-black uppercase leading-[0.95] text-white sm:text-5xl md:text-6xl">
            La vida entre bambalinas
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/55">
            Lo que pasa entre bambalinas, en tarima y en el estudio — capturado desde Bogotá D.C.
            para los que quieren ver más allá del escenario.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-white/40" aria-hidden="true" />
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setFilter(c.key)}
                aria-pressed={filter === c.key}
                className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
                  filter === c.key
                    ? 'border-accent bg-accent text-white shadow-[0_0_18px_rgba(255,59,92,0.35)]'
                    : 'border-white/15 text-white/55 hover:border-white/40 hover:text-white'
                }`}
              >
                {c.label}
                {c.key === 'photo' && <span className="ml-2 font-mono text-[10px] opacity-70">{photoCount}</span>}
                {c.key === 'video' && <span className="ml-2 font-mono text-[10px] opacity-70">{videoCount}</span>}
              </button>
            ))}
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center py-24">
          <Spinner size="lg" color="accent" />
        </div>
      ) : (
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-8" aria-label="Galería de fotos y videos">
          {visibleItems.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-12 text-center text-white/50">
              Las fotos están en camino. Vuelve pronto.
            </div>
          ) : (
            <div ref={ref} className="columns-2 gap-4 md:columns-3 lg:columns-4">
              {visibleItems.map((item, i) => {
                const tileSize = (i % 7 === 0) ? 'aspect-[4/5]' : (i % 5 === 0) ? 'aspect-[3/4]' : 'aspect-square';
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setLightbox(item)}
                    className={`group relative mb-4 w-full break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] text-left transition-all duration-500 ease-premium hover:border-accent/40 hover:shadow-glow ${
                      tileSize
                    } ${
                      isVisible ? 'translate-y-0 opacity-100' : ''
                    }`}
                    style={{ transitionDelay: `${(i % 12) * 60}ms` }}
                    aria-label={`Ver ${item.type === 'video' ? 'video' : 'imagen'}: ${item.title}`}
                  >
                    {item.type === 'video' ? (
                      <video
                        src={item.file_url}
                        muted
                        playsInline
                        preload="metadata"
                        className="h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
                      />
                    ) : (
                      <img
                        src={item.file_url}
                        alt={item.title}
                        loading="lazy"
                        className="h-full w-full object-cover grayscale-[0.15] transition-all duration-700 ease-premium group-hover:scale-105 group-hover:grayscale-0"
                      />
                    )}
                    <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-30" aria-hidden="true" />
                    {item.type === 'video' && (
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur-sm">
                        <Play className="h-3 w-3 fill-accent text-accent" /> Video
                      </span>
                    )}
                    <span className="absolute inset-x-3 bottom-3 line-clamp-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {item.title}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Vista ampliada de ${lightbox.title}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/10 p-2.5 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            onClick={closeLightbox}
            aria-label="Cerrar vista ampliada"
          >
            <X className="h-5 w-5" />
          </button>
          {lightbox.type === 'video' ? (
            <video
              src={lightbox.file_url}
              controls
              autoPlay
              className="max-h-[85vh] max-w-[90vw] rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={lightbox.file_url}
              alt={lightbox.title}
              className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}
    </>
  );
}
