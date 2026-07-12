import { useState, startTransition } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import { ROUTES } from '@/constants';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import AuthLayout from '@/components/auth/AuthLayout';

export default function LoginPage() {
  const { login, isSuperadmin, isArtistAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success('¡Bienvenido!');
      let target = ROUTES.HOME;
      if (isSuperadmin()) {
        target = ROUTES.SUPERADMIN;
      } else if (isArtistAdmin()) {
        target = ROUTES.ADMIN;
      }
      startTransition(() => {
        navigate(target);
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Bienvenido de vuelta"
      title="Iniciar sesión"
      subtitle="Entra a tu cuenta para seguir toda la actividad de Cabaxx."
      footer={
        <p className="text-center text-sm text-text-muted">
          ¿No tienes cuenta?{' '}
          <Link to={ROUTES.REGISTER} className="font-medium text-accent hover:underline">
            Regístrate
          </Link>
        </p>
      }
    >
      <Card padding="lg">
        <form onSubmit={submit} className="space-y-4">
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <div>
            <Input
              label="Contraseña"
              name="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <div className="mt-2 text-right">
              <Link to={ROUTES.FORGOT_PASSWORD} className="text-xs text-text-muted hover:text-accent hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>
          <Button type="submit" fullWidth loading={loading}>
            Entrar
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
}