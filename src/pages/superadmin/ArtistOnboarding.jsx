import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { ROUTES } from '@/constants';

import SectionHeading from '@/components/common/SectionHeading';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary';

const STEPS = ['Info básica', 'Multimedia', 'Redes', 'Tema'];

const PROGRESS_FILLED = (step) => `${((step - 1) / (STEPS.length - 1)) * 100}%`;

const emptyForm = {
  stage_name: '',
  slug: '',
  genre: '',
  country: '',
  avatar: null,
  banner: null,
  spotify: '',
  instagram: '',
  youtube: '',
  tiktok: '',
  primaryColor: '#0f172a',
  accentColor: '#f59e0b',
  font: 'display',
};

export default function ArtistOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(emptyForm);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const updateFile = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.files?.[0]?.name || null }));

  const next = () => setStep((s) => Math.min(STEPS.length, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const finish = () => {
    toast.success('Artista creado (demo)');
    navigate(ROUTES.SUPERADMIN_ARTISTS);
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <SectionHeading eyebrow="Onboarding" title="Nuevo Artista" />

      <div className="mt-8">
        <div className="flex items-center justify-between text-xs font-medium text-text-secondary">
          {STEPS.map((label, i) => (
            <span key={label} className={step >= i + 1 ? 'text-accent' : 'text-text-muted'}>
              {i + 1}. {label}
            </span>
          ))}
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-accent transition-all duration-300"
            style={{ width: PROGRESS_FILLED(step) }}
          />
        </div>
      </div>

      <Card padding="lg" className="mt-6">
        {step === 1 && (
          <div className="space-y-4">
            <Input label="Nombre artístico" name="stage_name" required value={form.stage_name} onChange={update('stage_name')} placeholder="Cabaxx" />
            <Input label="Slug" name="slug" required value={form.slug} onChange={update('slug')} placeholder="cabitaxx" hint="Identificador único en la URL" />
            <Input label="Género" name="genre" value={form.genre} onChange={update('genre')} placeholder="Reggaetón" />
            <Input label="País" name="country" value={form.country} onChange={update('country')} placeholder="Colombia" />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="avatar" className="mb-1.5 block text-sm font-medium text-text-secondary">Avatar</label>
              <input id="avatar" type="file" accept="image/*" onChange={updateFile('avatar')} className={`input-base ${FOCUS}`} />
              {form.avatar && <p className="mt-1 text-xs text-text-muted">{form.avatar}</p>}
            </div>
            <div>
              <label htmlFor="banner" className="mb-1.5 block text-sm font-medium text-text-secondary">Banner</label>
              <input id="banner" type="file" accept="image/*" onChange={updateFile('banner')} className={`input-base ${FOCUS}`} />
              {form.banner && <p className="mt-1 text-xs text-text-muted">{form.banner}</p>}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <Input label="Spotify" name="spotify" type="url" value={form.spotify} onChange={update('spotify')} placeholder="https://open.spotify.com/..." />
            <Input label="Instagram" name="instagram" type="url" value={form.instagram} onChange={update('instagram')} placeholder="https://instagram.com/..." />
            <Input label="YouTube" name="youtube" type="url" value={form.youtube} onChange={update('youtube')} placeholder="https://youtube.com/..." />
            <Input label="TikTok" name="tiktok" type="url" value={form.tiktok} onChange={update('tiktok')} placeholder="https://tiktok.com/..." />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <label htmlFor="primaryColor" className="text-sm font-medium text-text-secondary">Color primario</label>
              <input id="primaryColor" type="color" value={form.primaryColor} onChange={update('primaryColor')} className={`h-10 w-full rounded-lg border border-border bg-surface-2 ${FOCUS}`} />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <label htmlFor="accentColor" className="text-sm font-medium text-text-secondary">Color de acento</label>
              <input id="accentColor" type="color" value={form.accentColor} onChange={update('accentColor')} className={`h-10 w-full rounded-lg border border-border bg-surface-2 ${FOCUS}`} />
            </div>
            <div>
              <label htmlFor="font" className="mb-1.5 block text-sm font-medium text-text-secondary">Fuente</label>
              <select id="font" name="font" value={form.font} onChange={update('font')} className={`input-base ${FOCUS}`}>
                <option value="display">Display</option>
                <option value="mono">Mono</option>
                <option value="sans">Sans</option>
              </select>
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button variant="ghost" className={FOCUS} onClick={back} disabled={step === 1}>
            Atrás
          </Button>
          {step < STEPS.length ? (
            <Button className={FOCUS} onClick={next}>
              Siguiente
            </Button>
          ) : (
            <Button className={FOCUS} onClick={finish}>
              Crear artista
            </Button>
          )}
        </div>
      </Card>
    </main>
  );
}
