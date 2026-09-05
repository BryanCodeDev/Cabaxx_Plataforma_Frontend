import { classNames } from '@/utils/classNames';

/**
 * Textarea con label, estados de error/hint y soporte para `required`.
 * @param {string} label
 * @param {string} name
 * @param {string} error
 * @param {string} hint
 * @param {string} className
 * @param {number} rows
 */
export default function Textarea({ label, name, error, className, rows = 4, hint, ...props }) {
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
