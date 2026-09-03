import { useState } from 'react';
import { contactService } from '@/services/modules';
import { toast } from 'react-hot-toast';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import SEOHead from '@/components/seo/SEOHead';
import { Music, Newspaper, Handshake } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await contactService.send(form);
      toast.success('Mensaje enviado correctamente');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'No se pudo enviar el mensaje');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Hablemos</p>
      <h1 className="mt-2 font-display text-4xl text-text-primary sm:text-5xl">Contacto</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
        Escríbenos desde cualquier lugar. Respondemos personalmente cada mensaje desde Bogotá D.C.,
        Colombia — para booking, prensa o alianzas.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card padding="md" className="flex flex-col items-center text-center">
          <div className="mb-3 text-2xl"><Music className="h-7 w-7 text-accent" /></div>
          <p className="font-display text-text-primary">Booking</p>
          <p className="mt-1 text-sm text-text-secondary">Contrataciones para shows en vivo en Colombia y Latinoamérica.</p>
        </Card>
        <Card padding="md" className="flex flex-col items-center text-center">
          <div className="mb-3 text-2xl"><Newspaper className="h-7 w-7 text-accent" /></div>
          <p className="font-display text-text-primary">Prensa</p>
          <p className="mt-1 text-sm text-text-secondary">Entrevistas, notas periodísticas y material oficial.</p>
        </Card>
        <Card padding="md" className="flex flex-col items-center text-center">
          <div className="mb-3 text-2xl"><Handshake className="h-7 w-7 text-accent" /></div>
          <p className="font-display text-text-primary">Empresas</p>
          <p className="mt-1 text-sm text-text-secondary">Alianzas comerciales, patrocinios y colaboraciones de marca.</p>
        </Card>
      </div>

      <Card padding="lg" className="mt-10">
        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
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
          </div>
          <Input
            label="Asunto"
            name="subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            required
          />
          <div>
            <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-text-secondary">Mensaje</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              className="input-base w-full rounded-lg border border-border bg-surface px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary"
            />
          </div>
          <Button type="submit" loading={sending} fullWidth>
            Enviar mensaje
          </Button>
        </form>
      </Card>
      <SEOHead title="Contacto" description="Contacta a Cabaxx, artista urbano bogotano, para booking, prensa y alianzas comerciales desde Bogotá D.C., Colombia." />
    </div>
  );
}
