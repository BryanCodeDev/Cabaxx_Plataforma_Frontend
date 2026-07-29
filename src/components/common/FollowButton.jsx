import { classNames } from '@/utils/classNames';

/**
 * Estado vacío reutilizable.
 * @param {string}  title
 * @param {string}  description
 * @param {node}    action    — botón u otro CTA
 * @param {node}    icon      — ícono de Lucide o SVG
 * @param {'sm'|'md'|'lg'} size
 * @param {string}  className
 */
export default function EmptyState({ title, description, action, icon, size = 'md', className = '' }) {
  const paddings = { sm: 'py-10 px-4', md: 'py-16 px-6', lg: 'py-24 px-8' };

  return (
    <div
      className={classNames(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-surface/30 text-center',
        paddings[size],
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-2 text-text-muted">
          {icon}
        </div>
      )}
      <p className="font-display text-xl text-text-primary">{title}</p>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-text-muted">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}