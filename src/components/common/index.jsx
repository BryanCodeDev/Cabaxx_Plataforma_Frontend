import { classNames } from '@/utils/classNames';
import { getInitials } from '@/utils/format';

const AVATAR_SIZES = { sm: 'h-8 w-8 text-sm', md: 'h-10 w-10 text-base', lg: 'h-14 w-14 text-lg' };

export function Avatar({ src, name = '', size = 'md' }) {
  if (src) {
    return <img src={src} alt={name} className={`${AVATAR_SIZES[size]} rounded-full object-cover border border-border`} />;
  }
  return (
    <div className={`${AVATAR_SIZES[size]} flex items-center justify-center rounded-full bg-accent/20 font-semibold text-accent`}>
      {getInitials(name)}
    </div>
  );
}

const BADGE_VARIANTS = {
  default: 'bg-surface-2 text-text-secondary',
  accent: 'bg-accent/15 text-accent',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  error: 'bg-error/15 text-error',
  gold: 'bg-accent/15 text-accent',
};

const BADGE_SIZES = { sm: 'text-xs px-2 py-0.5', md: 'text-sm px-2.5 py-1' };

export function Badge({ variant = 'default', size = 'md', children }) {
  return (
    <span className={classNames('inline-flex items-center rounded-full font-medium', BADGE_VARIANTS[variant], BADGE_SIZES[size])}>
      {children}
    </span>
  );
}

export function EmptyState({ title, description, action, icon, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface/40 px-6 py-16 text-center ${className}`}>
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-text-muted">
          {icon}
        </div>
      )}
      <p className="text-lg font-display text-text-primary">{title}</p>
      {description && <p className="mt-2 max-w-sm text-sm text-text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
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
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">{eyebrow}</p>
        )}
        <h2 className="font-display text-3xl text-text-primary md:text-4xl">{title}</h2>
        {subtitle && <p className="mt-2 max-w-xl text-sm text-text-secondary">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 border-b border-border">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={classNames(
            'border-b-2 px-4 py-2 text-sm font-medium transition',
            active === t.key
              ? 'border-accent text-accent'
              : 'border-transparent text-text-muted hover:text-text-primary'
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function Textarea({ label, name, error, className, rows = 4, ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        rows={rows}
        className={classNames(
          'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary',
          error && 'border-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}