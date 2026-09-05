import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { SectionHeading } from '@/components/common';
import { toast } from 'react-hot-toast';
import SEOHead from '@/components/seo/SEOHead';
import { FOCUS } from '@/constants';
import { User, Lock, Bell, Save } from 'lucide-react';

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
    <>
      <SEOHead title="Mi cuenta" description="Gestiona tu perfil y preferencias en Cabaxx." noIndex />
      <div className="container-fluid max-w-3xl py-10 sm:py-12">
        <SectionHeading eyebrow="Perfil" title="Mi cuenta" />

        <form onSubmit={saveProfile} className="mt-8 space-y-6">
          <Card padding="lg">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent [&_svg]:h-4 [&_svg]:w-4">
                <User />
              </span>
              <h3 className="font-display text-xl text-text-primary sm:text-2xl">Datos personales</h3>
            </div>
            <div className="mt-5 grid gap-4">
              <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input label="Email" value={user?.email} disabled />
              <Input label="Avatar URL" value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://..." />
              {avatar && (
                <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-2/50 p-3">
                  <img src={avatar} alt="" className="h-12 w-12 rounded-full border border-border object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  <span className="text-xs text-text-muted">Vista previa</span>
                </div>
              )}
            </div>
            <Button className={`mt-5 ${FOCUS}`} loading={saving} type="submit" icon={<Save className="h-4 w-4" />}>
              Guardar cambios
            </Button>
          </Card>

          <Card padding="lg">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent [&_svg]:h-4 [&_svg]:w-4">
                <Lock />
              </span>
              <h3 className="font-display text-xl text-text-primary sm:text-2xl">Cambiar contraseña</h3>
            </div>
            <div className="mt-5 grid gap-4">
              <Input label="Actual" type="password" placeholder="********" />
              <Input label="Nueva" type="password" placeholder="********" />
            </div>
            <Button variant="secondary" className={`mt-5 ${FOCUS}`}>
              Actualizar contraseña
            </Button>
          </Card>

          <Card padding="lg">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent [&_svg]:h-4 [&_svg]:w-4">
                <Bell />
              </span>
              <h3 className="font-display text-xl text-text-primary sm:text-2xl">Notificaciones</h3>
            </div>
            <ul className="mt-5 space-y-2.5">
              {[
                { key: 'email', label: 'Email', desc: 'Resumen semanal y alertas importantes.' },
                { key: 'push', label: 'Push', desc: 'Notificaciones en tiempo real.' },
                { key: 'sms', label: 'SMS', desc: 'Sólo para shows y preventas.' },
              ].map((ch) => (
                <li key={ch.key} className="flex items-start justify-between gap-3 rounded-lg border border-border bg-surface-2/40 p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary">{ch.label}</p>
                    <p className="mt-0.5 text-xs text-text-muted">{ch.desc}</p>
                  </div>
                  <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                    <input type="checkbox" defaultChecked className="peer sr-only" />
                    <span className="h-6 w-11 rounded-full bg-surface-2 transition-colors peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-primary" />
                    <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                  </label>
                </li>
              ))}
            </ul>
          </Card>
        </form>
      </div>
    </>
  );
}
