import { useState } from 'react';
import Button from './Button';
import { toast } from 'react-hot-toast';

export default function ShareButtons({ url, title }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? url || window.location.href : '';
  const text = encodeURIComponent(title || '');
  const encodedUrl = encodeURIComponent(shareUrl);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Enlace copiado');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('No se pudo copiar');
    }
  };

  const links = [
    { label: 'X', href: `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}` },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: 'WhatsApp', href: `https://wa.me/?text=${text}%20${encodedUrl}` },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-text-muted">Compartir:</span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
        >
          {l.label}
        </a>
      ))}
      <Button variant="secondary" size="sm" onClick={copy}>
        {copied ? 'Copiado' : 'Copiar enlace'}
      </Button>
    </div>
  );
}
