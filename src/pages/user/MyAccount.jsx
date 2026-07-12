import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import SectionHeading from '@/components/common/SectionHeading';
import { toast } from 'react-hot-toast';
import SEOHead from '@/components/seo/SEOHead';

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary';

export default function MyAccount() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar_url || '');
  const [saving, setSaving] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      updateUser({ name, avatar_url: avatar });
      toast.success('Perfil actualizado');
    } catch {
      toast.error('Error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <SectionHeading eyebrow="Perfil" title="Mi cuenta" />
      <form onSubmit={saveProfile} className="mt-8 space-y-6">
        <Card padding="lg">
          <h3 className="font-display text-2xl text-text-primary">Datos personales</h3>
          <div className="mt-4 grid gap-4">
            <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Email" value={user?.email} disabled />
            <Input label="Avatar URL" value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://..." />
          </div>
          <Button className={`mt-4 ${FOCUS}`} loading={saving} type="submit">
            Guardar cambios
          </Button>
        </Card>

        <Card padding="lg">
          <h3 className="font-display text-2xl text-text-primary">Cambiar contraseña</h3>
          <div className="mt-4 grid gap-4">
            <Input label="Actual" type="password" placeholder="********" />
            <Input label="Nueva" type="password" placeholder="********" />
          </div>
          <Button variant="secondary" className={`mt-4 ${FOCUS}`}>
            Actualizar contraseña
          </Button>
        </Card>

        <Card padding="lg">
          <h3 className="font-display text-2xl text-text-primary">Notificaciones</h3>
          <div className="mt-4 space-y-3">
            {['Email', 'Push', 'SMS'].map((ch) => (
              <label key={ch} className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">{ch}</span>
                <input type="checkbox" defaultChecked className={`h-4 w-4 rounded border-border bg-surface-2 text-accent ${FOCUS}`} />
              </label>
            ))}
          </div>
        </Card>
      </form>
      <SEOHead title="Mi cuenta" description="Gestiona tu perfil y preferencias en Cabaxx." noIndex />
    </div>
  );
}
