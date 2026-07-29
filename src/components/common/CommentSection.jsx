import { Textarea, EmptyState } from '@/components/common'
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { communityService } from '@/services/modules';
import { ARTIST_SLUG } from '@/constants';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Spinner from '@/components/common/Spinner';
import { toast } from 'react-hot-toast';

export default function CommentSection({ referenceType, referenceId, title = 'Comentarios' }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState('');
  const [page, setPage] = useState(1);

  const load = async (pageNum = 1) => {
    setLoading(true);
    try {
      const { data } = await communityService.getComments({
        artist_slug: ARTIST_SLUG,
        reference_type: referenceType,
        reference_id: referenceId,
        page: pageNum,
        limit: 10,
      });
      const rows = data?.data?.rows || data?.rows || [];
      setComments(rows);
      setTotal(data?.data?.total || data?.total || 0);
    } catch {
      toast.error('No se pudieron cargar los comentarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(page);
  }, [referenceType, referenceId, page]);

  const submit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Inicia sesión para comentar');
      return;
    }
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await communityService.createComment({
        reference_type: referenceType,
        reference_id: referenceId,
        content,
      });
      setComments((prev) => [...prev, data?.data?.comment || data?.comment]);
      setTotal((t) => t + 1);
      setContent('');
      toast.success('Comentario publicado');
    } catch {
      toast.error('No se pudo publicar el comentario');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner size="md" />
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h3 className="font-display text-2xl text-text-primary">{title} ({total})</h3>

      {user ? (
        <form onSubmit={submit} className="mt-4 grid gap-3">
          <Textarea
            label="Escribe un comentario"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Comparte tu opinión..."
            rows={3}
          />
          <div className="flex justify-end">
            <Button type="submit" loading={submitting} disabled={!content.trim()}>
              Comentar
            </Button>
          </div>
        </form>
      ) : (
        <p className="mt-3 text-sm text-text-muted">Inicia sesión para comentar.</p>
      )}

      <div className="mt-6 space-y-4">
        {!comments.length && (
          <EmptyState title="Sin comentarios" description="Sé el primero en comentar." />
        )}
        {comments.map((c) => (
          <div key={c.id} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 font-display text-sm text-accent">
                {(c.user_name || 'U')[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">{c.user_name || 'Usuario'}</p>
                <p className="text-xs text-text-muted">{new Date(c.created_at).toLocaleString('es-CO')}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-text-secondary">{c.content}</p>
          </div>
        ))}
      </div>

      {total > comments.length && (
        <div className="mt-4 flex justify-center">
          <Button variant="secondary" onClick={() => setPage((p) => p + 1)}>Cargar más</Button>
        </div>
      )}
    </div>
  );
}
