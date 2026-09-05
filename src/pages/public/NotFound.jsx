import { Link } from 'react-router-dom';
import { Home as HomeIcon, ShoppingBag, Music2 } from 'lucide-react';
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
          className="font-display font-black leading-none tracking-tighter text-accent"
          style={{ fontSize: 'clamp(6rem, 18vw, 10rem)' }}
        >
          404
        </p>
        <p className="mt-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-text-muted">
          <span className="h-px w-8 bg-accent/50" aria-hidden="true" />
          Fuera del mapa
          <span className="h-px w-8 bg-accent/50" aria-hidden="true" />
        </p>
        <h1 className="mt-3 font-display text-display-sm uppercase tracking-tight text-text-primary">
          Página no encontrada
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
          Esta ruta no existe o fue movida. Vuelve al inicio o explora el catálogo para encontrar lo que buscas.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          <Link to={ROUTES.HOME}>
            <Button size="lg" icon={<HomeIcon className="h-4 w-4" aria-hidden="true" />}>
              Volver al inicio
            </Button>
          </Link>
          <Link to={ROUTES.SONGS}>
            <Button size="lg" variant="outline" icon={<Music2 className="h-4 w-4" aria-hidden="true" />}>
              Escuchar música
            </Button>
          </Link>
          <Link to={ROUTES.STORE}>
            <Button size="lg" variant="ghost" icon={<ShoppingBag className="h-4 w-4" aria-hidden="true" />}>
              Ir a la tienda
            </Button>
          </Link>
        </div>
      </CenteredContainer>
    </>
  );
}
