import { useState, startTransition } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import { ROUTES } from '@/constants';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import AuthLayout from '@/components/auth/AuthLayout';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
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
       subtitle="Únete a Cabaxx y accede a preventas, contenido y descuentos."
      footer={
        <p className="text-center text-sm text-text-muted">
          ¿Ya tienes cuenta?{' '}
          <Link to={ROUTES.LOGIN} className="font-medium text-accent hover:underline">
            Inicia sesión
          </Link>
        </p>
      }
    >
      <Card padding="lg">
        <form onSubmit={submit} className="space-y-4">
          <Input
            label="Nombre"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            label="Contraseña"
            name="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <div>
            <Input
              label="Confirmar contraseña"
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              required
            />
            {passwordsMismatch && (
              <p className="mt-1.5 text-xs text-error">Las contraseñas no coinciden.</p>
            )}
          </div>
          <Button type="submit" fullWidth loading={loading}>
            Registrarme
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
}