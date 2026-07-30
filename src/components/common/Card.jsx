import { classNames } from '@/utils/classNames';

const PADDINGS = { sm: 'p-4', md: 'p-6', lg: 'p-8' };

/**
 * Tarjeta base del sistema Cabaxx. Superficie oscura con borde de 1px que se
 * ilumina en rojo al interactuar, y una variante `glass` para overlays sobre imagen/video.
 * @param {node} children
 * @param {string} className
 * @param {boolean} hover - eleva la tarjeta y añade resplandor rojo al pasar el cursor
 * @param {string} padding - 'sm'|'md'|'lg'
 * @param {boolean} glass - glassmorphism (blur + borde translúcido)
 */
export default function Card({ children, className, hover = false, padding = 'md', glass = false }) {
  return (
    <div
      className={classNames(
        'relative rounded-2xl border border-white/10 bg-surface transition-all duration-500 ease-out',
        glass && 'border-white/15 bg-white/[0.04] backdrop-blur-xl',
        hover &&
          'cursor-pointer hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-[0_20px_50px_-15px_rgba(229,9,20,0.35)]',
        PADDINGS[padding],
        className
      )}
    >
      {hover && (
        <div
          className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-accent/0 opacity-0 blur-2xl transition-all duration-500 group-hover:bg-accent/10 group-hover:opacity-100"
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
}