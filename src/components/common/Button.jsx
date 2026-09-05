import { classNames } from '@/utils/classNames';

const VARIANTS = {
  primary:
    'bg-accent text-white font-semibold shadow-[0_8px_24px_-10px_rgba(229,9,20,0.55)] hover:bg-accent-hover hover:shadow-[0_10px_28px_-10px_rgba(229,9,20,0.7)]',
  secondary:
    'bg-white/[0.04] text-text-primary border border-white/15 hover:border-white/30 hover:bg-white/[0.07]',
  ghost:
    'bg-transparent text-text-secondary hover:bg-white/[0.05] hover:text-text-primary',
  danger:
    'bg-error text-white hover:opacity-90',
  outline:
    'bg-transparent border border-accent/70 text-accent hover:bg-accent hover:text-white',
  premium:
    'bg-white text-black font-semibold shadow-[0_8px_24px_-10px_rgba(255,255,255,0.35)] hover:bg-white hover:shadow-[0_10px_28px_-10px_rgba(255,255,255,0.5)]',
};

const SIZES = {
  sm: 'h-9 px-4 text-xs',
  md: 'h-11 px-6 text-sm',
  lg: 'h-12 px-7 text-[15px]',
};

const SpinnerMini = () => (
  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

/**
 * Botón del sistema Cabaxx.
 *  - Silueta de cápsula (rounded-full)
 *  - Acento reservado para la acción primaria
 *  - Estados focus/disabled accesibles
 *
 * @param {string} variant - 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'premium'
 * @param {string} size    - 'sm' | 'md' | 'lg'
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
        'group relative inline-flex items-center justify-center gap-2 rounded-full uppercase tracking-[0.12em] transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {loading ? <SpinnerMini /> : icon}
      <span>{children}</span>
    </button>
  );
}
