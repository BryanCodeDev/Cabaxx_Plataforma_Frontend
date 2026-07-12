import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/modules';
import { toast } from 'react-hot-toast';
import { ROUTES } from '@/constants';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import AuthLayout from '@/components/auth/AuthLayout';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success('Te enviamos un enlace de recuperación');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Acceso"
      title="Recuperar contraseña"
      subtitle={sent ? undefined : 'Te enviaremos un enlace para restablecerla.'}
      footer={
        <button
          onClick={() => navigate(ROUTES.LOGIN)}
          className="block w-full text-center text-sm text-accent hover:underline"
        >
          Volver al login
        </button>
      }
    >
      <Card padding="lg">
        {sent ? (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1z" />
              </svg>
            </div>
            <p className="mt-4 font-medium text-text-primary">Revisa tu correo</p>
            <p className="mt-1 text-sm text-text-secondary">
              Enviamos un enlace de recuperación a <span className="text-text-primary">{email}</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Button type="submit" fullWidth loading={loading}>
              Enviar enlace
            </Button>
          </form>
        )}
      </Card>
    </AuthLayout>
  );
}