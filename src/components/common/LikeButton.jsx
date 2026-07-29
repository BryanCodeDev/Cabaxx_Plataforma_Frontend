import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { communityService } from '@/services/modules';
import Button from '@/components/common/Button';
import { toast } from 'react-hot-toast';
import { Heart } from 'lucide-react';

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
    } catch (err) {
      toast.error('No se pudo actualizar el me gusta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 transition hover:border-accent ${liked ? 'bg-accent/15 text-accent' : 'text-text-secondary'} ${className}`}
    >
      <Heart className={`h-5 w-5 ${liked ? 'fill-accent text-accent' : 'text-text-secondary'}`} />
      <span className="font-mono text-sm">{count}</span>
    </button>
  );
}
