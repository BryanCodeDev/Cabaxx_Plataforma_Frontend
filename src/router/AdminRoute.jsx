import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/common/Spinner';
import { ROLES, ROUTES } from '@/constants';

// Redirige si no es administrador del artista
export default function AdminRoute({ children }) {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  if (!hasRole(ROLES.ARTIST_ADMIN)) return <Navigate to={ROUTES.HOME} replace />;
  return children;
}
