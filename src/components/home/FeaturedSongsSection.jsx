import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ARTIST_SLUG } from '@/constants';
import { useFetch } from '@/hooks/useFetch';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import SectionHeading from '@/components/common/SectionHeading';

export default function FeaturedSongsSection() {
  const { data } = useFetch(`/artists/${ARTIST_SLUG}/songs`, { params: { limit: 4 } });
  const songs = data?.songs?.rows || [];
  const [ref, isVisible] = useScrollReveal();

  return (
    <section ref={ref} className="mx-auto max-w-6xl px-4 py-24">
      <SectionHeading
        eyebrow="Discografía"
        title="Canciones"
        action={
          <Link to="/canciones">
            <Button variant="ghost" size="sm">Ver todas <ArrowRight className="ml-1 h-4 w-4" /></Button>
          </Link>
        }
      />

      {songs.length === 0 ? (
        <p className="mt-10 text-text-muted">Muy pronto encontrarás aquí las canciones destacadas.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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