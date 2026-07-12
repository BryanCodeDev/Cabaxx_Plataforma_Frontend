import { ARTIST_SLUG } from '@/constants';
import { useFetch } from '@/hooks/useFetch';
import Spinner from '@/components/common/Spinner';
import SectionHeading from '@/components/common/SectionHeading';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import SEOHead from '@/components/seo/SEOHead';
import { artistPhotos, videos } from '@/assets';

const localItems = [
  ...artistPhotos.map((url, i) => ({ id: `local-img-${i}`, file_url: url, title: 'Cabaxx', type: 'image' })),
  ...videos.map((url, i) => ({ id: `local-vid-${i}`, file_url: url, title: 'Cabaxx', type: 'video' })),
];

export default function GalleryPage() {
  const { data, loading } = useFetch(`/artists/${ARTIST_SLUG}/gallery`, { params: { limit: 24 } });
  const apiItems = data?.gallery?.rows || [];
  const items = apiItems.length ? apiItems : localItems;
  const [ref, isVisible] = useScrollReveal();

  return (
    <>
      <SEOHead title="Galería" description={`Galería de fotos y videos de ${artist?.stage_name || 'Cabaxx'}.`} />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <SectionHeading eyebrow="Visuales" title="Galería" />

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" color="accent" />
        </div>
      ) : (
        <div ref={ref} className="mt-8 columns-2 gap-4 md:columns-3">
          {items.map((item, i) => (
            <div
              key={item.id}
              className={`mb-4 break-inside-avoid transition-all duration-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {item.type === 'video' ? (
                <video
                  src={item.file_url}
                  controls
                  className="w-full rounded-xl border border-border/40 shadow-card"
                />
              ) : (
                <img
                  src={item.file_url}
                  alt={item.title}
                  loading="lazy"
                  className="w-full rounded-xl border border-border/40 object-cover shadow-card"
                />
              )}
            </div>
          ))}
        </div>
      )}
      </div>
    </>
  );
}
