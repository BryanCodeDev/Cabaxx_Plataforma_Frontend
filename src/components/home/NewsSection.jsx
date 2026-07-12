import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ARTIST_SLUG } from '@/constants';
import { useFetch } from '@/hooks/useFetch';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import SectionHeading from '@/components/common/SectionHeading';
import { formatDate } from '@/utils/format';

export default function NewsSection() {
  const { data } = useFetch(`/artists/${ARTIST_SLUG}/posts`, { params: { limit: 3, type: 'news' } });
  const posts = data?.posts?.rows || [];
  const [ref, isVisible] = useScrollReveal();

  return (
    <section ref={ref} className="mx-auto max-w-6xl px-4 py-24">
      <SectionHeading
        eyebrow="Al día"
        title="Noticias"
        action={
          <Link to="/noticias">
            <Button variant="ghost" size="sm">Ver todo <ArrowRight className="ml-1 h-4 w-4" /></Button>
          </Link>
        }
      />

      {posts.length === 0 ? (
        <p className="mt-10 text-text-muted">Aún no hay noticias publicadas.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
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