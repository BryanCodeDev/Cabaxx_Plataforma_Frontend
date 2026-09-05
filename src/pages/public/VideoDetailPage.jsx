import { useState, useEffect } from 'react';
import { ArrowLeft, Film, Eye } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { videoService } from '@/services/modules';
import { ROUTES } from '@/constants';
import { formatDate, formatNumber } from '@/utils/format';
import PageSpinner from '@/components/common/PageSpinner';
import { EmptyState, Chip } from '@/components/common';
import LikeButton from '@/components/common/LikeButton';
import CommentSection from '@/components/common/CommentSection';

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-md';

export default function VideoDetailPage() {
  const { slug } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    videoService
      .getVideoBySlug(slug)
      .then((res) => {
        if (!isMounted) return;
        setVideo(res.data?.data?.video || res.data?.video || null);
      })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [slug]);

  if (loading) return <PageSpinner label="Cargando video" />;
  if (!video) {
    return (
      <div className="container-fluid py-12">
        <EmptyState title="Video no encontrado" description="Este video ya no está disponible." />
      </div>
    );
  }

  return (
    <article className="container-fluid py-10 sm:py-14">
      <Link
        to={ROUTES.VIDEOS}
        className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted transition hover:text-text-primary ${FOCUS}`}
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Volver a videos
      </Link>

      <div className="mt-8 flex flex-col gap-4">
        <Chip variant="accent" icon={<Film className="h-3 w-3" aria-hidden="true" />}>
          Video
        </Chip>
        <h1 className="font-display text-display-sm tracking-tight text-text-primary">
          {video.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-text-secondary">
          <span className="flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            {formatNumber(video.views_count)} vistas
          </span>
          <span className="font-mono text-xs text-text-muted">{formatDate(video.published_at)}</span>
        </div>
        {video.description && (
          <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">{video.description}</p>
        )}
        <div>
          <LikeButton referenceType="video" referenceId={video.id} initialCount={video.likes_count || 0} />
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-black shadow-elev-2">
        {video.youtube_id ? (
          <div className="aspect-video w-full">
            <iframe
              src={`https://www.youtube.com/embed/${video.youtube_id}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        ) : (
          <video src={video.video_url} controls className="w-full" />
        )}
      </div>

      <CommentSection referenceType="video" referenceId={video.id} title="Comentarios del video" />
    </article>
  );
}
