import { getInitials } from '@/utils/format';
import { classNames } from '@/utils/classNames';

const SIZES = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-xl',
};

/**
 * Avatar circular. Si no hay src muestra iniciales con degradado.
 * @param {string}  src
 * @param {string}  name
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} size
 * @param {string}  className
 * @param {boolean} ring  — añade anillo de acento
 */
export default function Avatar({ src, name = '', size = 'md', className = '', ring = false }) {
  const base = classNames(
    SIZES[size],
    'shrink-0 rounded-full object-cover select-none',
    ring && 'ring-2 ring-accent ring-offset-2 ring-offset-primary',
    className
  );

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={classNames(base, 'border border-border/60')}
        loading="lazy"
      />
    );
  }

  return (
    <div
      aria-label={name || 'Avatar'}
      className={classNames(
        base,
        'flex items-center justify-center bg-gradient-to-br from-accent/30 to-gold/20 font-bold text-accent'
      )}
    >
      {getInitials(name)}
    </div>
  );
}