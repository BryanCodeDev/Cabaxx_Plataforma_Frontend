import { postService } from '@/services/modules';
import ListingPage from '@/components/common/ListingPage';
import Card from '@/components/common/Card';
import { Badge } from '@/components/common';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { formatDate } from '@/utils/format';
import SEOHead from '@/components/seo/SEOHead';
import { useArtist } from '@/hooks/useArtist';

export default function NewsPage() {
  const { artist } = useArtist();
  return (
    <>
      <SEOHead title="Noticias" description={`Últimas noticias y novedades de ${artist?.stage_name || 'Cabaxx'}.`} />
      <ListingPage
        title="Noticias"
        eyebrow="Al día"
        subtitle="Lo que se mueve alrededor del proyecto, contado directo desde la fuente."
        resource="posts"
        service={(params) => postService.getPosts({ ...params, type: 'news' })}
        gridClass="grid-feature"
        renderItem={(p) => (
          <Link
            key={p.id}
            to={ROUTES.NEWS_POST.replace(':slug', p.slug)}
            className="group block"
          >
            <Card hover padding="md" className="h-full">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="accent" size="sm">Noticia</Badge>
                {p.published_at && (
                  <span className="font-mono text-xs text-text-muted">
                    {formatDate(p.published_at, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
              <p className="mt-3 font-display text-xl uppercase tracking-wide leading-snug text-text-primary transition-colors group-hover:text-accent">
                {p.title}
              </p>
              {p.excerpt && (
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-text-secondary">
                  {p.excerpt}
                </p>
              )}
            </Card>
          </Link>
        )}
      />
    </>
  );
}
