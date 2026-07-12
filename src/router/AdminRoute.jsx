import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/common/Spinner';
import { ROLES, ROUTES } from '@/constants';
import { ARTIST_SLUG } from '@/constants';

// Redirige si no es superadmin (o artist_admin del artista activo)
export default function AdminRoute({ children }) {
  const { isAuthenticated, isLoading, isSuperadmin, hasRole } = useAuth();
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  const isArtistAdmin = hasRole(ROLES.ARTIST_ADMIN);
  if (!isSuperadmin() && !isArtistAdmin) return <Navigate to={ROUTES.HOME} replace />;
  void ARTIST_SLUG;
  return children;
}
