import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';
import SEOHead from '@/components/seo/SEOHead';
import { ROUTES } from '@/constants';

export default function NotFound() {
  return (
    <>
      <SEOHead title="Página no encontrada" description="La página que buscas no existe o fue movida." noIndex />
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <p className="font-display text-[8rem] leading-none text-accent">404</p>
        <h1 className="mt-2 font-display text-3xl text-text-primary">Página no encontrada</h1>
        <p className="mt-3 max-w-md text-sm text-text-secondary">
          La página que buscas no existe o fue movida. Vuelve al inicio para seguir explorando.
        </p>
        <div className="mt-8 flex gap-3">
          <Link to={ROUTES.HOME}>
            <Button size="lg">Volver al inicio</Button>
          </Link>
          <Link to={ROUTES.STORE}>
            <Button size="lg" variant="outline">Ir a la tienda</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
