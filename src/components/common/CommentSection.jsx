import { Textarea, EmptyState } from '@/components/common';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { communityService } from '@/services/modules';
import { ARTIST_SLUG, FOCUS } from '@/constants';
import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';
import { Avatar } from '@/components/common';
import { toast } from 'react-hot-toast';
import { MessageCircle, Send } from 'lucide-react';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referenceType, referenceId, page]);

  const submit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Inicia sesión para comentar');
      return;
    }
    const trimmed = content.trim();
    if (!trimmed) return;
    setSubmitting(true);
    try {
      const { data } = await communityService.createComment({
        reference_type: referenceType,
        reference_id: referenceId,
        content: trimmed,
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
      <section aria-busy="true" aria-live="polite" className="mt-10">
        <h3 className="font-display text-2xl uppercase text-text-primary">{title}</h3>
        <div className="mt-6 flex justify-center py-10">
          <Spinner size="md" color="accent" />
        </div>
      </section>
    );
  }

  return (
    <section aria-label={title} className="mt-10">
      <header className="flex items-baseline gap-2">
        <h3 className="font-display text-2xl uppercase text-text-primary">
          {title}
        </h3>
        <span className="font-mono text-sm text-accent" aria-label={`${total} comentarios`}>
          {total}
        </span>
      </header>

      {user ? (
        <form onSubmit={submit} className="mt-5 space-y-3">
          <div className="flex items-start gap-3">
            <Avatar src={user?.avatar_url} name={user?.name} size="sm" className="mt-1 hidden sm:block" />
            <div className="flex-1">
              <Textarea
                label="Escribe un comentario"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Comparte tu opinión..."
                rows={3}
                maxLength={1000}
                className={FOCUS}
              />
              <div className="mt-1 text-right text-[10px] text-text-muted">
                {content.length}/1000
              </div>
            </div>
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-text-muted">Sé respetuoso. Tu comentario será público.</p>
            <Button
              type="submit"
              loading={submitting}
              disabled={!content.trim()}
              icon={<Send className="h-4 w-4" />}
            >
              Publicar
            </Button>
          </div>
        </form>
      ) : (
        <p className="mt-5 rounded-lg border border-dashed border-border bg-surface/40 px-4 py-3 text-sm text-text-muted">
          Inicia sesión para comentar.
        </p>
      )}

      {comments.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={<MessageCircle />}
            title="Sin comentarios"
            description="Sé el primero en comentar."
          />
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {comments.map((c) => (
            <li key={c.id}>
              <article className="rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-accent/20 sm:p-5">
                <header className="flex items-center gap-3">
                  <Avatar
                    src={c.user_avatar_url}
                    name={c.user_name || 'Usuario'}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text-primary">
                      {c.user_name || 'Usuario'}
                    </p>
                    <time
                      dateTime={c.created_at}
                      className="block text-xs text-text-muted"
                    >
                      {new Date(c.created_at).toLocaleString('es-CO')}
                    </time>
                  </div>
                </header>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-text-secondary">
                  {c.content}
                </p>
              </article>
            </li>
          ))}
        </ul>
      )}

      {total > comments.length && (
        <div className="mt-6 flex justify-center">
          <Button variant="secondary" onClick={() => setPage((p) => p + 1)}>
            Cargar más comentarios
          </Button>
        </div>
      )}
    </section>
  );
}