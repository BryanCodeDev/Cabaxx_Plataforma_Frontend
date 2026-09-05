import { classNames } from '@/utils/classNames';

const PADDINGS = { sm: 'p-4', md: 'p-6', lg: 'p-8', none: 'p-0' };

/**
 * Tarjeta base del sistema Cabaxx.
 *  - Superficie oscura con borde 1px y radio consistente
 *  - Hover sutil: realce de borde + lift de 2px sin glow saturado
 *  - Variante `glass` para overlays sobre imagen/video
 *
 * @param {node} children
 * @param {string} className
 * @param {boolean} hover
 * @param {string} padding - 'none' | 'sm' | 'md' | 'lg'
 * @param {boolean} glass
 */
export default function Card({ children, className, hover = false, padding = 'md', glass = false }) {
  return (
    <div
      className={classNames(
        'relative rounded-2xl border border-white/[0.08] bg-surface transition-all duration-300 ease-out',
        glass && 'border-white/15 bg-white/[0.04] backdrop-blur-xl',
        hover &&
          'cursor-pointer hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_12px_32px_-16px_rgba(0,0,0,0.8)]',
        PADDINGS[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
