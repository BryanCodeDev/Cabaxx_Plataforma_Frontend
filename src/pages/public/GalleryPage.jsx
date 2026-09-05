import { useState, useEffect, useCallback } from 'react';
import { ARTIST_SLUG } from '@/constants';
import { useFetch } from '@/hooks/useFetch';
import { Spinner, SectionHeading, EmptyState } from '@/components/common';
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
  ...videos.map((url) => ({
    id: `local-vid-${url}`,
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
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.body.style.overflow = reduce ? '' : 'hidden';
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

      <section className="relative overflow-hidden border-b border-white/[0.06] bg-black">
        <div className="pointer-events-none absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-accent/[0.08] blur-[160px]" aria-hidden="true" />
        <FilmGrain opacity={0.025} />
        <div className="container-fluid relative py-16 sm:py-20">
          <SectionHeading
            eyebrow="Detrás de cámaras"
            title="Galería"
            subtitle="Lo que pasa entre bambalinas, en tarima y en el estudio — capturado desde Bogotá D.C."
          />

          <div className="mt-8 flex flex-wrap items-center gap-2" role="tablist" aria-label="Filtrar por tipo">
            <Filter className="h-3.5 w-3.5 text-text-muted" aria-hidden="true" />
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                type="button"
                role="tab"
                aria-selected={filter === c.key}
                onClick={() => setFilter(c.key)}
                className={`rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] transition ${
                  filter === c.key
                    ? 'border-accent bg-accent/15 text-accent'
                    : 'border-white/[0.08] text-text-secondary hover:border-white/20 hover:text-text-primary'
                }`}
              >
                {c.label}
                {c.key === 'photo' && <span className="ml-2 font-mono text-[10px] opacity-70 tabular-nums">{photoCount}</span>}
                {c.key === 'video' && <span className="ml-2 font-mono text-[10px] opacity-70 tabular-nums">{videoCount}</span>}
              </button>
            ))}
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" color="accent" />
        </div>
      ) : (
        <section className="container-fluid py-12" aria-label="Galería de fotos y videos">
          {visibleItems.length === 0 ? (
            <EmptyState
              title="Aún no hay contenido"
              description="Las fotos están en camino. Vuelve pronto."
            />
          ) : (
            <div
              ref={ref}
              className="columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4 2xl:columns-5 4xl:columns-6"
            >
              {visibleItems.map((item, i) => {
                const tileSize = (i % 7 === 0) ? 'aspect-[4/5]' : (i % 5 === 0) ? 'aspect-[3/4]' : 'aspect-square';
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setLightbox(item)}
                    className={`group relative mb-4 w-full break-inside-avoid overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.015] text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary ${
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
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <img
                        src={item.file_url}
                        alt={item.title}
                        loading="lazy"
                        className="h-full w-full object-cover grayscale-[0.15] transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                      />
                    )}
                    <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-30" aria-hidden="true" />
                    {item.type === 'video' && (
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-text-primary backdrop-blur-sm">
                        <Play className="h-3 w-3 fill-accent text-accent" aria-hidden="true" /> Video
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
            className="absolute right-4 top-4 rounded-full border border-white/[0.2] bg-white/10 p-2.5 text-text-primary transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
              className="max-h-[85vh] max-w-[90vw] rounded-2xl shadow-elev-3"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={lightbox.file_url}
              alt={lightbox.title}
              className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-elev-3"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}
    </>
  );
}
