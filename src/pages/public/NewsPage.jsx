import { postService } from '@/services/modules';
import ListingPage from '@/components/common/ListingPage';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import SEOHead from '@/components/seo/SEOHead';

export default function NewsPage() {
  return (
    <>
      <SEOHead title="Noticias" description="Últimas noticias y novedades de Cabitaxx." />
      <ListingPage
      title="Noticias"
      eyebrow="Al día"
      service={(slug, params) => postService.getPosts(slug, { ...params, type: 'news' })}
      renderItem={(p) => (
        <Link
          key={p.id}
          to={ROUTES.NEWS_POST.replace(':slug', p.slug)}
          className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
        >
          <Card hover padding="md">
            <div className="flex items-center gap-2">
              <Badge variant="accent" size="sm">Noticia</Badge>
              {p.published_at && (
                <span className="font-mono text-xs text-text-muted">{p.published_at}</span>
              )}
            </div>
            <p className="mt-3 font-display text-lg text-text-primary">{p.title}</p>
            <p className="mt-1 text-sm text-text-secondary">{p.excerpt}</p>
          </Card>
        </Link>
       )}
      />
     </>
  );
}
