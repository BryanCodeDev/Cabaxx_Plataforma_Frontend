import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch('/api/v1/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      toast.success('¡Suscrito! Te avisaremos de novedades.');
      setEmail('');
    } catch {
      toast.error('No se pudo suscribir. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-accent via-accent to-accent-hover py-24">
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:repeating-linear-gradient(45deg,#fff_0,#fff_1px,transparent_1px,transparent_6px)]" />
      <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
      <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-black/20 blur-3xl" />

      <div className="relative mx-auto max-w-2xl px-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">Newsletter</p>
        <h2 className="mt-3 font-display text-4xl text-white md:text-5xl">Sé el Primero en Saberlo</h2>
        <p className="mt-3 text-white/80">
          Recibe lanzamientos exclusivos, noticias y acceso prioritario a eventos.
        </p>
        <form onSubmit={subscribe} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="flex-1 border-white/20 bg-white/10 text-white placeholder:text-white/60 focus:border-white"
            required
          />
          <Button type="submit" disabled={loading} className="whitespace-nowrap bg-white text-accent hover:bg-white/90">
            {loading ? 'Enviando…' : 'Suscribirse'}
          </Button>
        </form>
        <p className="mt-4 text-xs text-white/60">Sin spam. Puedes darte de baja cuando quieras.</p>
      </div>
    </section>
  );
}