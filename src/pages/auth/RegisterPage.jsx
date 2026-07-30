import { useState, startTransition } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import { ROUTES } from '@/constants';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import AuthLayout from '@/components/auth/AuthLayout';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordsMismatch = form.confirm.length > 0 && form.password !== form.confirm;

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Las contraseñas no coinciden');
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      toast.success('Cuenta creada. Verifica tu email.');
      startTransition(() => {
        navigate(ROUTES.HOME);
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Únete"
      title="Crear cuenta"
      subtitle="Acceso a preventas, contenido exclusivo y descuentos en la tienda."
      footer={
        <p className="text-center text-sm text-white/40">
          ¿Ya tienes cuenta?{' '}
          <Link to={ROUTES.LOGIN} className="font-semibold text-accent transition hover:text-white">
            Inicia sesión
          </Link>
        </p>
      }
    >
      <Card padding="lg" glass className="shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
        <form onSubmit={submit} className="space-y-5">
          <Input
            label="Nombre"
            name="name"
            placeholder="Tu nombre"
            icon={<User className="h-4 w-4" />}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
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
          <Input
            label="Contraseña"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Mínimo 8 caracteres"
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
          <div>
            <Input
              label="Confirmar contraseña"
              name="confirm"
              type={showPassword ? 'text' : 'password'}
              placeholder="Repite tu contraseña"
              icon={<Lock className="h-4 w-4" />}
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              error={passwordsMismatch ? 'Las contraseñas no coinciden.' : undefined}
              required
            />
          </div>
          <Button type="submit" fullWidth loading={loading} size="lg">
            Crear mi cuenta
          </Button>
          <p className="text-center text-[11px] leading-relaxed text-white/30">
            Al registrarte aceptas nuestros Términos y la Política de privacidad.
          </p>
        </form>
      </Card>
    </AuthLayout>
  );
}