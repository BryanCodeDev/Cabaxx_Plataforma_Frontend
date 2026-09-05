import { Link } from 'react-router-dom';
import { Home as HomeIcon, ShoppingBag } from 'lucide-react';
import Button from '@/components/common/Button';
import SEOHead from '@/components/seo/SEOHead';
import CenteredContainer from '@/components/common/CenteredContainer';
import { ROUTES } from '@/constants';

export default function NotFound() {
  return (
    <>
      <SEOHead title="Página no encontrada" description="La página que buscas no existe o fue movida." noIndex />
      <CenteredContainer maxWidth="md" className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <p
          aria-hidden="true"
          className="font-display font-black leading-none text-accent"
          style={{ fontSize: 'clamp(6rem, 18vw, 10rem)' }}
        >
          404
        </p>
        <h1 className="mt-2 font-display text-display-sm text-text-primary">Página no encontrada</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
          La página que buscas no existe o fue movida. Vuelve al inicio para seguir explorando.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-3">
          <Link to={ROUTES.HOME}>
            <Button size="lg" icon={<HomeIcon className="h-4 w-4" />} fullWidth>
              Volver al inicio
            </Button>
          </Link>
          <Link to={ROUTES.STORE}>
            <Button size="lg" variant="outline" icon={<ShoppingBag className="h-4 w-4" />} fullWidth>
              Ir a la tienda
            </Button>
          </Link>
        </div>
      </CenteredContainer>
    </>
  );
}
