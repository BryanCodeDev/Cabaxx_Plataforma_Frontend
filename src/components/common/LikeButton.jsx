import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { communityService } from '@/services/modules';
import { toast } from 'react-hot-toast';
import { Heart } from 'lucide-react';
import { classNames } from '@/utils/classNames';

/**
 * Botón de me gusta con animación y contador.
 * @param {string}  referenceType — 'song'|'post'|'video'|'event'
 * @param {number}  referenceId
 * @param {number}  initialCount
 * @param {'sm'|'md'} size
 * @param {string}  className
 */
export default function LikeButton({
  referenceType,
  referenceId,
  initialCount = 0,
  size = 'md',
  className = '',
}) {
  const { user }                  = useAuth();
  const [liked, setLiked]         = useState(false);
  const [count, setCount]         = useState(initialCount);
  const [loading, setLoading]     = useState(false);
  const [animate, setAnimate]     = useState(false);

  // Cargar contador
  useEffect(() => {
    communityService
      .countLikes({ reference_type: referenceType, reference_id: referenceId })
      .then((res) => setCount(res.data?.data?.total ?? initialCount))
      .catch(() => {});
  }, [referenceType, referenceId, initialCount]);

  // Verificar si el usuario dio like
  useEffect(() => {
    if (!user) return;
    communityService
      .checkUserLikes({ reference_type: referenceType, reference_ids: [referenceId] })
      .then((res) => {
        const likedIds = res.data?.data?.liked || [];
        setLiked(likedIds.includes(referenceId));
      })
      .catch(() => {});
  }, [user, referenceType, referenceId]);

  const toggle = async () => {
    if (!user) { toast.error('Inicia sesión para dar me gusta'); return; }
    setLoading(true);
    // Animación optimista
    setAnimate(true);
    setTimeout(() => setAnimate(false), 400);
    try {
      const res  = await communityService.toggleLike({ reference_type: referenceType, reference_id: referenceId });
      const data = res.data?.data || res.data;
      setLiked(data.liked);
      setCount(data.count ?? count + (data.liked ? 1 : -1));
    } catch {
      toast.error('No se pudo actualizar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const sizes = {
    sm: { btn: 'px-3 py-1.5 text-xs gap-1.5', icon: 'h-3.5 w-3.5' },
    md: { btn: 'px-4 py-2 text-sm gap-2',     icon: 'h-4.5 w-4.5' },
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-label={liked ? 'Quitar me gusta' : 'Dar me gusta'}
      aria-pressed={liked}
      className={classNames(
        'inline-flex items-center rounded-full border transition-all duration-200',
        'disabled:cursor-not-allowed disabled:opacity-60',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary',
        sizes[size].btn,
        liked
          ? 'border-accent/30 bg-accent/10 text-accent hover:bg-accent/15'
          : 'border-border/70 bg-surface text-text-secondary hover:border-accent/40 hover:text-accent',
        className
      )}
    >
      <Heart
        className={classNames(
          sizes[size].icon,
          'transition-all duration-200',
          liked ? 'fill-accent text-accent' : 'fill-transparent',
          animate && 'scale-125'
        )}
      />
      <span className="font-mono font-medium tabular-nums">
        {count > 0 ? (count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count) : ''}
      </span>
    </button>
  );
}