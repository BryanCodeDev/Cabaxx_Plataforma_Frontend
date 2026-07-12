import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import Button from '@/components/common/Button';
import SectionHeading from '@/components/common/SectionHeading';
import { artistPhotos } from '@/assets';
import { X } from 'lucide-react';

const IMAGES = artistPhotos.map((url, i) => ({ id: i, url, title: 'Cabaxx' }));

export default function GalleryPreviewSection() {
  const [lightbox, setLightbox] = useState(null);
  const [ref, isVisible] = useScrollReveal();

  return (
    <section ref={ref} className="mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-24">
      <SectionHeading
        eyebrow="Momentos"
        title="Galería"
        action={
          <Link to="/galeria">
            <Button variant="ghost" size="sm">Ver galería completa <ArrowRight className="ml-1 h-4 w-4" /></Button>
          </Link>
        }
      />

      <div className="mt-8 columns-2 gap-3 sm:mt-10 sm:columns-3 sm:gap-4 lg:columns-4">
        {IMAGES.map((img, i) => (
          <div
            key={img.id}
            className={`mb-4 break-inside-avoid transition-all duration-500 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <button
              onClick={() => setLightbox(img)}
              className="group relative block w-full overflow-hidden rounded-xl border border-border/40"
            >
              <img src={img.url} alt={img.title} className="w-full transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-left text-sm font-medium text-white">{img.title}</p>
              </div>
              <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
            </button>
          </div>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            aria-label="Cerrar"
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          <figure className="max-w-full">
            <img src={lightbox.url} alt={lightbox.title} className="max-h-[75vh] max-w-full rounded-2xl object-contain" />
            <figcaption className="mt-3 text-center text-sm text-white/70">{lightbox.title}</figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}