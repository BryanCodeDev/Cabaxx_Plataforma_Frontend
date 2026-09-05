import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { videoService } from '@/services/modules';
import { ROUTES } from '@/constants';
import { formatDate, formatNumber } from '@/utils/format';
import Spinner from '@/components/common/Spinner';
import { EmptyState } from '@/components/common';
import Card from '@/components/common/Card';
import LikeButton from '@/components/common/LikeButton';
import CommentSection from '@/components/common/CommentSection';

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

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!video) {
    return (
      <div className="container-fluid py-12">
        <EmptyState title="Video no encontrado" description="Este video ya no está disponible." />
      </div>
    );
  }

  return (
    <div className="container-fluid py-10 sm:py-12">
      <Link
        to={ROUTES.VIDEOS}
        className="inline-flex items-center gap-1 text-sm text-text-secondary transition hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-md"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a Videos
      </Link>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Video</p>
        <h1 className="mt-2 font-display text-display-sm text-text-primary">{video.title}</h1>
        <p className="mt-3 font-mono text-sm text-text-muted">
          {formatNumber(video.views_count)} vistas · {formatDate(video.published_at)}
        </p>
        <p className="mt-4 text-text-secondary">{video.description}</p>
        <div className="mt-4">
          <LikeButton referenceType="video" referenceId={video.id} initialCount={video.likes_count || 0} />
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
        {video.youtube_id ? (
          <div className="aspect-video w-full">
            <iframe
              src={`https://www.youtube.com/embed/${video.youtube_id}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full rounded-2xl"
            />
          </div>
        ) : (
          <video src={video.video_url} controls className="w-full" />
        )}
      </div>

      <CommentSection referenceType="video" referenceId={video.id} title="Comentarios del video" />
    </div>
  );
}
