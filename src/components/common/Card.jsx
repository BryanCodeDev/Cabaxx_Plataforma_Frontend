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
        'rounded-2xl border border-border bg-surface transition-all duration-300',
        glass && 'glass',
        hover && 'card-hover cursor-pointer hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_12px_32px_rgba(229,9,20,0.15)]',
        PADDINGS[padding],
        className
      )}
    >
      {children}
    </div>
  );
}