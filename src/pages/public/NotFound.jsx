import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';
import { ROUTES } from '@/constants';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-[8rem] leading-none text-accent">404</p>
      <h1 className="mt-2 font-display text-3xl text-text-primary">Página no encontrada</h1>
      <p className="mt-3 max-w-md text-sm text-text-secondary">
        La página que buscas no existe o fue movida. Vuelve al inicio para seguir explorando.
      </p>
      <Link to={ROUTES.HOME} className="mt-8">
        <Button size="lg">Volver al inicio</Button>
      </Link>
    </div>
  );
}
