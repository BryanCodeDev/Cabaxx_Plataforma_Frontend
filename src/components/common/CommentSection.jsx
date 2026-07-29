import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { communityService } from '@/services/modules';
import { ARTIST_SLUG } from '@/constants';
import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';
import EmptyState from '@/components/common/EmptyState';
import Avatar from '@/components/common/Avatar';
import { toast } from 'react-hot-toast';
import { MessageCircle, Send } from 'lucide-react';

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)   return 'hace un momento';
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
  return new Date(dateStr).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
}

export default function CommentSection({ referenceType, referenceId, title = 'Comentarios' }) {
  const { user } = useAuth();
  const [comments, setComments]   = useState([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent]     = useState('');
  const [page, setPage]           = useState(1);
  const textareaRef               = useRef(null);

  const load = async (pageNum = 1) => {
    setLoading(true);
    try {
      const { data } = await communityService.getComments({
        artist_slug:    ARTIST_SLUG,
        reference_type: referenceType,
        reference_id:   referenceId,
        page:           pageNum,
        limit:          10,
      });
      const rows = data?.data?.rows || data?.rows || [];
      if (pageNum === 1) {
        setComments(rows);
      } else {
        setComments((prev) => [...prev, ...rows]);
      }
      setTotal(data?.data?.total || data?.total || 0);
    } catch {
      toast.error('No se pudieron cargar los comentarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setComments([]);
    setPage(1);
    load(1);
  }, [referenceType, referenceId]);

  // Auto-resize del textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [content]);

  const submit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Inicia sesión para comentar'); return; }
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await communityService.createComment({
        reference_type: referenceType,
        reference_id:   referenceId,
        content,
      });
      const newComment = data?.data?.comment || data?.comment;
      setComments((prev) => [newComment, ...prev]);
      setTotal((t) => t + 1);
      setContent('');
      toast.success('Comentario publicado');
    } catch {
      toast.error('No se pudo publicar el comentario');
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit(e);
  };

  return (
    <div className="mt-12 border-t border-border/40 pt-10">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-text-muted" />
        <h3 className="font-display text-2xl text-text-primary">
          {title}
          {total > 0 && (
            <span className="ml-2 font-mono text-lg text-text-muted">({total})</span>
          )}
        </h3>
      </div>

      {/* Formulario */}
      {user ? (
        <form onSubmit={submit} className="mt-6">
          <div className="flex gap-3">
            <Avatar src={user.avatar_url} name={user.name} size="sm" className="shrink-0 mt-1" />
            <div className="flex-1 rounded-2xl border border-border/70 bg-surface-2 transition-colors focus-within:border-accent/60">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe un comentario… (Ctrl+Enter para enviar)"
                rows={2}
                className="w-full resize-none bg-transparent px-4 pt-3 pb-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
              />
              <div className="flex items-center justify-between px-4 pb-3">
                <span className="text-xs text-text-muted">
                  {content.length > 0 && `${content.length} caracteres`}
                </span>
                <Button
                  type="submit"
                  size="sm"
                  loading={submitting}
                  disabled={!content.trim()}
                  iconRight={!submitting && <Send className="h-3.5 w-3.5" />}
                >
                  Comentar
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mt-6 rounded-2xl border border-border/40 bg-surface/50 p-5 text-center">
          <p className="text-sm text-text-muted">
            <a href="/login" className="text-accent hover:underline">Inicia sesión</a> para dejar un comentario.
          </p>
        </div>
      )}

      {/* Lista */}
      <div className="mt-8 space-y-4">
        {loading && !comments.length ? (
          <div className="flex justify-center py-8">
            <Spinner size="md" />
          </div>
        ) : !comments.length ? (
          <EmptyState
            icon={<MessageCircle className="h-6 w-6" />}
            title="Sin comentarios aún"
            description="Sé el primero en compartir tu opinión."
          />
        ) : (
          comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <Avatar src={c.user_avatar} name={c.user_name} size="sm" className="shrink-0 mt-0.5" />
              <div className="flex-1 rounded-2xl border border-border/50 bg-surface px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-text-primary">
                    {c.user_name || 'Usuario'}
                  </p>
                  <time className="text-xs text-text-muted" dateTime={c.created_at}>
                    {timeAgo(c.created_at)}
                  </time>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{c.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cargar más */}
      {total > comments.length && !loading && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => { const next = page + 1; setPage(next); load(next); }}
          >
            Cargar más comentarios
          </Button>
        </div>
      )}
    </div>
  );
}