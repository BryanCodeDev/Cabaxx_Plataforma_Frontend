import { Link } from 'react-router-dom';
import { APP_NAME } from '@/constants';

export default function ArtistNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-center">
      <h1 className="text-6xl font-bold text-white">404</h1>
      <p className="mt-4 text-xl text-gray-400">Artista no encontrado</p>
      <p className="mt-2 text-gray-500">El artista que buscas no existe o ha sido eliminado.</p>
      <Link to="/" className="mt-8 rounded bg-white px-6 py-3 font-semibold text-black hover:bg-gray-200">
        Volver a {APP_NAME}
      </Link>
    </div>
  );
}
