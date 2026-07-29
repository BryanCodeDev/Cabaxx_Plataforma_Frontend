import { classNames } from '@/utils/classNames';

const PADDINGS = { sm: 'p-3', md: 'p-5', lg: 'p-7' };

/**
 * Tarjeta base.
 * @param {node} children
 * @param {string} className
 * @param {boolean} hover - aplica efecto card-hover
 * @param {string} padding - 'sm'|'md'|'lg'
 * @param {boolean} glass - aplica estilo glassmorphism
 */
export default function Card({ children, className, hover = false, padding = 'md', glass = false }) {
  return (
    <div
      className={classNames(
        'rounded-2xl border border-border bg-surface',
        glass && 'glass',
        hover && 'card-hover cursor-pointer',
        PADDINGS[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
