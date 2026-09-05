import { useState, useEffect } from 'react';
import { ArrowLeft, Newspaper } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { postService } from '@/services/modules';
import { ROUTES } from '@/constants';
import PageSpinner from '@/components/common/PageSpinner';
import { EmptyState, Chip } from '@/components/common';
import LikeButton from '@/components/common/LikeButton';
import CommentSection from '@/components/common/CommentSection';
import { toast } from 'react-hot-toast';
import { formatDate } from '@/utils/format';

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-md';

export default function NewsPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postService
      .getPostBySlug(slug)
      .then((res) => setPost(res.data.data.post))
      .catch(() => toast.error('No encontrado'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <PageSpinner label="Cargando publicación" />;
  if (!post) {
    return (
      <div className="container-fluid py-12">
        <EmptyState title="Publicación no encontrada" description="Esta noticia ya no está disponible." />
      </div>
    );
  }

  return (
    <article className="container-fluid max-w-4xl py-10 sm:py-14">
      <Link
        to={ROUTES.NEWS}
        className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted transition hover:text-text-primary ${FOCUS}`}
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Volver a noticias
      </Link>

      <header className="mt-6">
        <Chip variant="accent" icon={<Newspaper className="h-3 w-3" aria-hidden="true" />}>
          Noticia
        </Chip>
        <h1 className="mt-4 font-display text-display-sm tracking-tight text-text-primary">
          {post.title}
        </h1>
        {post.published_at && (
          <p className="mt-2 font-mono text-xs text-text-muted tabular-nums">
            {formatDate(post.published_at, { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        )}
        <div className="mt-4">
          <LikeButton referenceType="post" referenceId={post.id} initialCount={post.likes_count || 0} />
        </div>
      </header>

      {post.cover_url && (
        <img
          src={post.cover_url}
          alt=""
          className="mt-8 aspect-video w-full rounded-2xl border border-white/[0.08] object-cover shadow-elev-2"
        />
      )}

      <div
        className="prose prose-invert mt-10 max-w-none text-base leading-relaxed text-text-secondary [&_a]:text-accent [&_a]:underline-offset-2 [&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-10 [&_h2]:font-display [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:text-text-primary [&_h3]:mt-6 [&_h3]:font-display [&_h3]:uppercase [&_h3]:text-text-primary [&_p]:my-4 [&_strong]:text-text-primary"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <CommentSection referenceType="post" referenceId={post.id} title="Comentarios" />
    </article>
  );
}
