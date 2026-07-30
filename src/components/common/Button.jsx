import { classNames } from '@/utils/classNames';

const VARIANTS = {
  primary: 'bg-accent text-white font-semibold hover:bg-accent-hover shadow-[0_4px_20px_rgba(229,9,20,0.3)] hover:shadow-[0_6px_26px_rgba(229,9,20,0.45)]',
  secondary: 'bg-surface-2 text-text-primary border border-border hover:border-accent/50 hover:bg-white/[0.04]',
  ghost: 'bg-transparent text-text-primary hover:bg-white/[0.06]',
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
 * Botón reutilizable del sistema de diseño Cabaxx.
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
  className,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classNames(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium tracking-wide transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {loading ? <SpinnerMini /> : icon}
      {children}
    </button>
  );
}