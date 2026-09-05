import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { postService } from '@/services/modules';
import { ROUTES } from '@/constants';
import PageSpinner from '@/components/common/PageSpinner';
import { EmptyState } from '@/components/common';
import LikeButton from '@/components/common/LikeButton';
import CommentSection from '@/components/common/CommentSection';
import { toast } from 'react-hot-toast';

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
    <article className="container-fluid max-w-4xl py-10 sm:py-12">
      <Link
        to={ROUTES.NEWS}
        className="inline-flex items-center gap-1 text-sm text-text-secondary transition hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-md"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a noticias
      </Link>

      <div className="mt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent">Noticia</p>
        <h1 className="font-display text-display-sm text-text-primary">{post.title}</h1>
        {post.published_at && (
          <p className="mt-3 font-mono text-sm text-text-muted">{post.published_at}</p>
        )}
        <div className="mt-4">
          <LikeButton referenceType="post" referenceId={post.id} initialCount={post.likes_count || 0} />
        </div>
      </div>

      {post.cover_url && (
        <img src={post.cover_url} alt="" className="mt-6 aspect-video w-full rounded-2xl object-cover shadow-card" />
      )}
      <div className="prose prose-invert mt-6 max-w-none leading-relaxed text-text-secondary" dangerouslySetInnerHTML={{ __html: post.content }} />
      <CommentSection referenceType="post" referenceId={post.id} title="Comentarios" />
    </article>
  );
}
