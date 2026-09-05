import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { communityService } from '@/services/modules';
import { toast } from 'react-hot-toast';
import { Heart } from 'lucide-react';
import { FOCUS } from '@/constants';

export default function LikeButton({ referenceType, referenceId, initialCount = 0, className = '' }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    communityService.countLikes({ reference_type: referenceType, reference_id: referenceId }).then((res) => {
      setCount(res.data?.data?.total ?? initialCount);
    });
  }, [referenceType, referenceId, initialCount]);

  const toggle = async () => {
    if (!user) {
      toast.error('Inicia sesión para dar me gusta');
      return;
    }
    setLoading(true);
    try {
      const res = await communityService.toggleLike({ reference_type: referenceType, reference_id: referenceId });
      const data = res.data?.data || res.data;
      setLiked(data.liked);
      setCount(data.count ?? count);
    } catch {
      toast.error('No se pudo actualizar el me gusta');
    } finally {
      setLoading(false);
    }
  };

  const label = liked ? 'Quitar me gusta' : 'Dar me gusta';

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-pressed={liked}
      aria-label={`${label} (${count} en total)`}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-200 active:scale-95 disabled:opacity-50 ${FOCUS} ${
        liked
          ? 'border-accent/50 bg-accent/10 text-accent'
          : 'border-border text-text-secondary hover:border-accent/40 hover:text-text-primary'
      } ${className}`}
    >
      <Heart
        className={`h-4 w-4 shrink-0 transition-transform ${
          liked ? 'scale-110 fill-accent text-accent' : 'text-text-secondary'
        }`}
        aria-hidden="true"
      />
      <span className="font-mono text-sm tabular-nums">
        {count.toLocaleString('es-CO')}
      </span>
    </button>
  );
}