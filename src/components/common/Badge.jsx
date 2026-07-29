import { classNames } from '@/utils/classNames';

const VARIANTS = {
  default:  'bg-surface-2 text-text-secondary border border-border/60',
  accent:   'bg-accent/12 text-accent border border-accent/20',
  success:  'bg-success/12 text-success border border-success/20',
  warning:  'bg-warning/12 text-warning border border-warning/20',
  error:    'bg-error/12 text-error border border-error/20',
  gold:     'bg-gold/12 text-gold border border-gold/20',
  outline:  'bg-transparent border border-border text-text-secondary',
};

const SIZES = {
  xs: 'text-[10px] px-1.5 py-0.5',
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
};

/**
 * Badge / etiqueta.
 * @param {'default'|'accent'|'success'|'warning'|'error'|'gold'|'outline'} variant
 * @param {'xs'|'sm'|'md'} size
 * @param {boolean} dot  — muestra punto de estado a la izquierda
 */
export default function Badge({ variant = 'default', size = 'sm', dot = false, children, className = '' }) {
  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
    >
      {dot && (
        <span
          className={classNames(
            'h-1.5 w-1.5 rounded-full',
            variant === 'accent'  && 'bg-accent',
            variant === 'success' && 'bg-success',
            variant === 'warning' && 'bg-warning',
            variant === 'error'   && 'bg-error',
            variant === 'gold'    && 'bg-gold',
            variant === 'default' && 'bg-text-muted',
            variant === 'outline' && 'bg-text-muted',
          )}
        />
      )}
      {children}
    </span>
  );
}