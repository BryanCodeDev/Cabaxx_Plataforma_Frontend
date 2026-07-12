import { classNames } from '@/utils/classNames';

const VARIANTS = {
  primary: 'bg-accent text-white hover:bg-accent-hover shadow-glow-sm',
  secondary: 'bg-surface-2 text-text-primary border border-border hover:border-accent/50',
  ghost: 'bg-transparent text-text-primary hover:bg-surface-2',
  danger: 'bg-error text-white hover:opacity-90',
  outline: 'bg-transparent border border-accent text-accent hover:bg-accent hover:text-white',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
};

const SpinnerMini = () => (
  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

/**
 * Botón reutilizable del sistema de diseño MAP.
 * @param {string} variant - 'primary'|'secondary'|'ghost'|'danger'|'outline'
 * @param {string} size - 'sm'|'md'|'lg'
 * @param {boolean} loading - muestra spinner y deshabilita click
 * @param {boolean} disabled
 * @param {boolean} fullWidth
 * @param {function} onClick
 * @param {node} children
 * @param {string} type
 * @param {node} icon - ícono a la izquierda
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  children,
  type = 'button',
  icon,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classNames(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full'
      )}
    >
      {loading ? <SpinnerMini /> : icon}
      {children}
    </button>
  );
}
