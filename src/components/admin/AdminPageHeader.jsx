import { classNames } from '@/utils/classNames';

/**
 * Header estándar para todas las páginas del panel de control.
 * Muestra eyebrow + título + descripción + acciones alineadas.
 * Responsive: stacked en mobile, horizontal ≥sm.
 *
 * @param {string} eyebrow - texto pequeño sobre el título (ej. "PANEL")
 * @param {string} title
 * @param {string} subtitle
 * @param {node} icon - lucide icon a la izquierda del título
 * @param {node} actions - botones a la derecha
 * @param {string} className
 */
export default function AdminPageHeader({ eyebrow, title, subtitle, icon: Icon, actions, className = '' }) {
  return (
    <header
      className={classNames(
        'flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between',
        className
      )}
    >
      <div className="flex min-w-0 items-start gap-4">
        {Icon && (
          <span
            aria-hidden="true"
            className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent sm:flex [&_svg]:h-5 [&_svg]:w-5"
          >
            <Icon />
          </span>
        )}
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">{eyebrow}</p>
          )}
          <h1 className="mt-1 font-display text-2xl text-text-primary sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-text-muted">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 sm:shrink-0">{actions}</div>}
    </header>
  );
}