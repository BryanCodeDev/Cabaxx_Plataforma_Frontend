import { useState } from 'react';
import { contactService } from '@/services/modules';
import { toast } from 'react-hot-toast';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { Chip, SectionHeading, Textarea } from '@/components/common';
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
    <section className="container-fluid max-w-3xl py-10 sm:py-14">
      <SectionHeading
        eyebrow="Hablemos"
        title="Contacto"
        subtitle="Respondemos personalmente cada mensaje desde Bogotá D.C., Colombia — para booking, prensa o alianzas."
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Card padding="md" className="flex flex-col items-center text-center">
          <Chip variant="accent" icon={<Music className="h-3 w-3" aria-hidden="true" />}>
            Booking
          </Chip>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            Contrataciones para shows en vivo en Colombia y Latinoamérica.
          </p>
        </Card>
        <Card padding="md" className="flex flex-col items-center text-center">
          <Chip variant="accent" icon={<Newspaper className="h-3 w-3" aria-hidden="true" />}>
            Prensa
          </Chip>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            Entrevistas, notas periodísticas y material oficial.
          </p>
        </Card>
        <Card padding="md" className="flex flex-col items-center text-center">
          <Chip variant="accent" icon={<Handshake className="h-3 w-3" aria-hidden="true" />}>
            Empresas
          </Chip>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            Alianzas comerciales, patrocinios y colaboraciones de marca.
          </p>
        </Card>
      </div>

      <Card padding="lg" className="mt-10">
        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
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
          <Textarea
            label="Mensaje"
            name="message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={5}
            required
            hint="Cuéntanos el contexto: fechas, ciudades, presupuesto o detalles del proyecto."
          />
          <Button type="submit" loading={sending} fullWidth>
            Enviar mensaje
          </Button>
        </form>
      </Card>
      <SEOHead title="Contacto" description="Contacta a Cabaxx, artista urbano bogotano, para booking, prensa y alianzas comerciales desde Bogotá D.C., Colombia." />
    </section>
  );
}
