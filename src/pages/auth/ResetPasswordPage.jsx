import { useState, startTransition } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authService } from '@/services/modules';
import { toast } from 'react-hot-toast';
import { ROUTES } from '@/constants';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import AuthLayout from '@/components/auth/AuthLayout';
import { Check, Circle } from 'lucide-react';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const hasLength = form.password.length >= 8;
  const matches = form.confirm.length > 0 && form.password === form.confirm;
  const mismatch = form.confirm.length > 0 && form.password !== form.confirm;

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Las contraseñas no coinciden');
    setLoading(true);
    try {
      await authService.resetPassword(token, form.password);
      toast.success('Contraseña actualizada');
      startTransition(() => {
        navigate(ROUTES.LOGIN);
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout eyebrow="Último paso" title="Nueva contraseña" subtitle="Elige una contraseña segura para tu cuenta.">
      <Card padding="lg">
        <form onSubmit={submit} className="space-y-4">
          <Input
            label="Contraseña"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <div>
            <Input
              label="Confirmar contraseña"
              type="password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              required
            />
            {mismatch && <p className="mt-1.5 text-xs text-error">Las contraseñas no coinciden.</p>}
          </div>

          <ul className="space-y-1.5 rounded-lg border border-border bg-surface-2 p-3">
            <li className={`flex items-center gap-2 text-xs ${hasLength ? 'text-gold' : 'text-text-muted'}`}>
              {hasLength ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />} Mínimo 8 caracteres
            </li>
            <li className={`flex items-center gap-2 text-xs ${matches ? 'text-gold' : 'text-text-muted'}`}>
              {matches ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />} Las contraseñas coinciden
            </li>
          </ul>

          <Button type="submit" fullWidth loading={loading}>
            Actualizar
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
}