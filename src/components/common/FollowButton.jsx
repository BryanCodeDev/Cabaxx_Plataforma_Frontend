import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { communityService } from '@/services/modules';
import Button from '@/components/common/Button';
import { toast } from 'react-hot-toast';

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
      className={className}
    >
      {following ? 'Siguiendo' : 'Seguir'}
    </Button>
  );
}
