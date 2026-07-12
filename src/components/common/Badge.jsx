import { classNames } from '@/utils/classNames';

const VARIANTS = {
  default: 'bg-surface-2 text-text-secondary',
  accent: 'bg-accent/15 text-accent',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  error: 'bg-error/15 text-error',
  gold: 'bg-gold/15 text-gold',
};

const SIZES = { sm: 'text-xs px-2 py-0.5', md: 'text-sm px-2.5 py-1' };

/**
 * Badge / etiqueta.
 * @param {string} variant - 'default'|'accent'|'success'|'warning'|'error'|'gold'
 * @param {string} size - 'sm'|'md'
 * @param {node} children
 */
export default function Badge({ variant = 'default', size = 'md', children }) {
  return (
    <span className={classNames('inline-flex items-center rounded-full font-medium', VARIANTS[variant], SIZES[size])}>
      {children}
    </span>
  );
}
