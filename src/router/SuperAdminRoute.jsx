import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/common/Spinner';
import { ROUTES } from '@/constants';

// Solo accesible para rol superadmin
export default function SuperAdminRoute({ children }) {
  const { isAuthenticated, isLoading, isSuperadmin } = useAuth();
  const location = useLocation();
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  if (!isSuperadmin()) return <Navigate to={ROUTES.HOME} replace />;
  return children;
}
