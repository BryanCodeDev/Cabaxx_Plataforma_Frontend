import { classNames } from '@/utils/classNames';
import { getInitials } from '@/utils/format';

const AVATAR_SIZES = { sm: 'h-8 w-8 text-sm', md: 'h-10 w-10 text-base', lg: 'h-14 w-14 text-lg' };

export function Avatar({ src, name = '', size = 'md' }) {
  if (src) {
    return <img src={src} alt={name} className={`${AVATAR_SIZES[size]} rounded-full object-cover border border-white/[0.08]`} />;
  }
  return (
    <div className={`${AVATAR_SIZES[size]} flex items-center justify-center rounded-full bg-accent/15 font-semibold text-accent border border-accent/20`}>
      {getInitials(name)}
    </div>
  );
}

const BADGE_VARIANTS = {
  default: 'bg-white/[0.06] text-text-secondary border border-white/[0.08]',
  accent: 'bg-accent/15 text-accent border border-accent/20',
  success: 'bg-success/15 text-success border border-success/20',
  warning: 'bg-warning/15 text-warning border border-warning/20',
  error: 'bg-error/15 text-error border border-error/20',
  gold: 'bg-accent/15 text-accent border border-accent/20',
};

const BADGE_SIZES = { sm: 'text-[10px] px-2 py-0.5 tracking-[0.1em]', md: 'text-xs px-2.5 py-0.5 tracking-[0.08em]' };

export function Badge({ variant = 'default', size = 'md', children }) {
  return (
    <span className={classNames('inline-flex items-center rounded-full font-semibold uppercase', BADGE_VARIANTS[variant], BADGE_SIZES[size])}>
      {children}
    </span>
  );
}

/**
 * Chip — etiqueta inline minimalista (eyebrow, meta, tag).
 * @param {string} variant
 * @param {node} icon
 * @param {node} children
 */
export function Chip({ variant = 'default', icon, children, className = '' }) {
  const styles = {
    default: 'border-white/[0.08] bg-white/[0.03] text-text-secondary',
    accent:  'border-accent/25 bg-accent/10 text-accent',
    subtle:  'border-white/[0.06] bg-transparent text-text-muted',
  };
  return (
    <span className={classNames(
      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em]',
      styles[variant] || styles.default,
      className
    )}>
      {icon}
      {children}
    </span>
  );
}

export function EmptyState({ title, description, action, icon, className = '' }) {
  return (
    <div
      role="status"
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.015] px-6 py-14 text-center sm:py-20 ${className}`}
    >
      {icon && (
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-text-muted [&_svg]:h-5 [&_svg]:w-5">
          {icon}
        </div>
      )}
      <p className="font-display text-lg uppercase tracking-wide text-text-primary sm:text-xl">{title}</p>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-text-muted">{description}</p>
      )}
      {action && <div className="mt-7">{action}</div>}
    </div>
  );
}

export function SectionHeading({ eyebrow, title, subtitle, action, align = 'left' }) {
  const centered = align === 'center';
  return (
    <div
      className={`flex gap-4 ${
        centered ? 'flex-col items-center text-center' : 'flex-col sm:flex-row sm:items-end sm:justify-between'
      }`}
    >
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">{eyebrow}</p>
        )}
        <h2 className="font-display text-3xl uppercase leading-[1] tracking-tight text-text-primary md:text-4xl">
          {title}
        </h2>
        {subtitle && <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 border-b border-white/[0.08]" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={active === t.key}
          onClick={() => onChange(t.key)}
          className={classNames(
            'relative -mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-t-sm',
            active === t.key
              ? 'border-accent text-text-primary'
              : 'border-transparent text-text-muted hover:text-text-primary'
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function Textarea({ label, name, error, className, rows = 4, hint, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={name} className="block text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
          {label}
          {props.required && <span className="ml-0.5 text-accent">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        rows={rows}
        aria-invalid={error ? 'true' : undefined}
        className={classNames(
          'w-full rounded-lg border border-white/[0.1] bg-white/[0.03] px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted/70 outline-none transition-colors focus:border-accent/70 focus:bg-white/[0.05] focus:ring-1 focus:ring-accent/40 disabled:opacity-50',
          error && 'border-error/70 focus:border-error focus:ring-error/40',
          className
        )}
        {...props}
      />
      {error ? (
        <p className="text-xs text-error">{error}</p>
      ) : hint ? (
        <p className="text-xs text-text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
