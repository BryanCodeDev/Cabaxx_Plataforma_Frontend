import { RouterProvider } from 'react-router-dom';
import { router } from './AppRouter';

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
