import { useEffect, useState } from 'react';
import Button from '@/components/common/Button';
import { heroVideo, heroPoster } from '@/assets';
import { Play, Music } from 'lucide-react';

const particles = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 6,
  duration: 4 + Math.random() * 5,
  size: 1 + Math.random() * 3,
  gold: i % 3 === 0,
}));

export default function HeroSection({ artist }) {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary">
      <div
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: artist?.cover_url
            ? `url(${artist.cover_url})`
            : 'radial-gradient(circle at 50% 20%, #2A2430, #121016 70%)',
          transform: `translateY(${scrollY * 0.35}px) scale(1.08)`,
        }}
      />
      {!artist?.cover_url && (
        <video
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
          style={{ transform: `translateY(${scrollY * 0.35}px) scale(1.08)` }}
          autoPlay
          muted
          loop
          playsInline
          poster={heroPoster}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      )}
      {/* Layered atmosphere: vignette + warm color wash, replaces a single flat gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/50 via-primary/60 to-primary" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:repeating-linear-gradient(0deg,#fff_0,#fff_1px,transparent_1px,transparent_3px)]" />

      <div className="absolute inset-0 overflow-hidden">
        {particles.map((p) => (
          <span
            key={p.id}
            className={`absolute rounded-full ${p.gold ? 'bg-gold/50' : 'bg-accent/40'}`}
            style={{
              left: `${p.left}%`,
              bottom: '-10px',
              width: `${p.size}px`,
              height: `${p.size}px`,
              animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div
        className={`relative z-10 px-4 text-center transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="mb-5 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-gold" />
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
            Artista Urbano Colombiano
          </p>
          <span className="h-px w-8 bg-gold" />
        </div>
        <h1 className="font-display text-[15vw] leading-[0.92] tracking-tight text-text-primary drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)] sm:text-7xl md:text-8xl lg:text-9xl">
          {artist?.name?.toUpperCase() || 'CABAX'}
        </h1>
        <p className="mt-4 text-base text-text-secondary sm:text-lg md:text-xl">
          {artist?.genre || 'Reggaetón · Trap · Flow Colombiano'}
        </p>
        <div className="mx-auto mt-8 flex max-w-xs flex-col items-stretch gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
          <Button size="lg" className="w-full sm:w-auto" onClick={() => {}}>
            <Play className="mr-2 h-5 w-5" /> Escuchar Ahora
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Ver Eventos
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => document.getElementById('latest')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Music className="mr-2 h-5 w-5" /> Últimos Lanzamientos
          </Button>
        </div>
      </div>

      <button
        onClick={() => document.getElementById('latest')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Desplazarse hacia abajo"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce text-text-muted transition hover:text-gold"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-bounce { animation: none; }
        }
      `}</style>
    </section>
  );
}