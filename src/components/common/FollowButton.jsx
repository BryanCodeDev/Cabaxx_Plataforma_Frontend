import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { communityService } from '@/services/modules';
import Button from '@/components/common/Button';
import { toast } from 'react-hot-toast';
import { Check, Plus } from 'lucide-react';

export default function FollowButton({ artistId, className = '' }) {
  const { user } = useAuth();
  const [following, setFollowing] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!artistId) return;
    communityService.countFollows(artistId).then((res) => {
      setCount(res.data?.data?.total ?? 0);
    });
  }, [artistId]);

  useEffect(() => {
    if (!user || !artistId) return;
    communityService.checkFollow().then((res) => {
      const data = res.data?.data || res.data;
      setFollowing(!!data.following);
    }).catch(() => {});
  }, [user, artistId]);

  const toggle = async () => {
    if (!user) {
      toast.error('Inicia sesión para seguir');
      return;
    }
    setLoading(true);
    try {
      const res = await communityService.toggleFollow();
      const data = res.data?.data || res.data;
      setFollowing(data.following);
      setCount(data.count ?? count);
    } catch (err) {
      toast.error('No se pudo actualizar el seguimiento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={following ? 'secondary' : 'primary'}
      onClick={toggle}
      loading={loading}
      icon={following ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      className={`uppercase tracking-wide ${className}`}
    >
      {following ? 'Siguiendo' : 'Seguir'}
      {count > 0 && <span className="ml-1 font-mono text-xs opacity-60">· {count.toLocaleString('es-CO')}</span>}
    </Button>
  );
}