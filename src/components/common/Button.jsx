import { classNames } from '@/utils/classNames';

const VARIANTS = {
  primary:
    'relative bg-accent text-white font-bold shadow-[0_1px_0_rgba(255,255,255,0.15)_inset,0_10px_30px_-8px_rgba(229,9,20,0.55)] hover:shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_14px_38px_-8px_rgba(229,9,20,0.7)] before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-b before:from-white/15 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300',
  secondary:
    'bg-white/[0.03] text-text-primary border border-white/15 hover:border-accent/50 hover:bg-white/[0.06] backdrop-blur-sm',
  ghost:
    'bg-transparent text-text-primary hover:bg-white/[0.06]',
  danger:
    'bg-error text-white hover:opacity-90',
  outline:
    'relative bg-transparent border border-accent/70 text-accent overflow-hidden transition-colors hover:text-white before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:bg-accent before:transition-transform before:duration-300 before:ease-out hover:before:scale-x-100',
  premium:
    'relative bg-white text-black font-bold shadow-[0_10px_30px_-10px_rgba(255,255,255,0.35)] hover:shadow-[0_14px_38px_-10px_rgba(255,255,255,0.5)] hover:-translate-y-0.5',
};

const SIZES = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-[15px]',
};

const SpinnerMini = () => (
  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

/**
 * Botón del sistema de diseño Cabaxx — silueta nítida, peso tipográfico marcado,
 * microinteracción de una sola capa (sin exceso) por variante.
 * @param {string} variant - 'primary'|'secondary'|'ghost'|'danger'|'outline'|'premium'
 * @param {string} size - 'sm'|'md'|'lg'
 * @param {boolean} loading
 * @param {boolean} disabled
 * @param {boolean} fullWidth
 * @param {function} onClick
 * @param {node} children
 * @param {string} type
 * @param {node} icon
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
        'group inline-flex items-center justify-center gap-2 overflow-hidden rounded-full uppercase tracking-[0.08em] transition-all duration-300 ease-out active:scale-[0.96] disabled:opacity-40 disabled:pointer-events-none disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {loading ? <SpinnerMini /> : icon}
      <span className="relative">{children}</span>
    </button>
  );
}