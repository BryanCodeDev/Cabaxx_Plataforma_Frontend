import { useState, startTransition } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import { ROUTES } from '@/constants';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import AuthLayout from '@/components/auth/AuthLayout';

export default function LoginPage() {
  const { login, isArtistAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success('¡Bienvenido de vuelta!');
      let target = ROUTES.HOME;
      if (isArtistAdmin()) {
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
      title="Entrar"
      subtitle="Vuelve a tu cuenta y sigue toda la actividad, de primera mano."
      footer={
        <p className="text-center text-sm text-text-secondary">
          ¿Todavía no tienes cuenta?{' '}
          <Link to={ROUTES.REGISTER} className="font-semibold text-accent transition hover:text-text-primary">
            Regístrate gratis
          </Link>
        </p>
      }
    >
      <Card padding="lg" glass className="shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
        <form onSubmit={submit} className="space-y-5">
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="tu@email.com"
            icon={<Mail className="h-4 w-4" />}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <div>
            <Input
              label="Contraseña"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              icon={<Lock className="h-4 w-4" />}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="pointer-events-auto text-text-muted transition hover:text-white"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <div className="mt-2.5 text-right">
              <Link to={ROUTES.FORGOT_PASSWORD} className="text-xs text-text-secondary transition hover:text-accent">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>
          <Button type="submit" fullWidth loading={loading} size="lg">
            Entrar a Cabaxx
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
}