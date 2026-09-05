import { postService } from '@/services/modules';
import ListingPage from '@/components/common/ListingPage';
import Card from '@/components/common/Card';
import { Badge } from '@/components/common';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { formatDate } from '@/utils/format';
import SEOHead from '@/components/seo/SEOHead';
import { useArtist } from '@/hooks/useArtist';

export default function BlogPage() {
  const { artist } = useArtist();
  return (
    <>
      <SEOHead title="Blog" description={`Historias, entrevistas y detrás de cámaras de ${artist?.stage_name || 'Cabaxx'}.`} />
      <ListingPage
        title="Blog"
        eyebrow="Historias"
        subtitle="Reflexiones, entrevistas y lo que hay detrás de cada lanzamiento. Lectura larga."
        resource="posts"
        service={(params) => postService.getPosts({ ...params, type: 'blog' })}
        gridClass="grid-feature"
        renderItem={(p) => (
          <Link
            key={p.id}
            to={ROUTES.BLOG_POST.replace(':slug', p.slug)}
            className="group block"
          >
            <Card hover padding="md" className="h-full">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="accent" size="sm">Blog</Badge>
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
                <p className="mt-2 text-sm leading-relaxed text-text-secondary line-clamp-3">
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
