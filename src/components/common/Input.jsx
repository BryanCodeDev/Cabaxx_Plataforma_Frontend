import { classNames } from '@/utils/classNames';

/**
 * Input con label, estados de error/hint e icono opcional.
 * @param {string} label
 * @param {string} name
 * @param {string} type
 * @param {string} placeholder
 * @param {any} value
 * @param {function} onChange
 * @param {string} error
 * @param {string} hint
 * @param {boolean} required
 * @param {boolean} disabled
 * @param {node} icon
 * @param {node} suffix
 * @param {string} className
 */
export default function Input({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  hint,
  required = false,
  disabled = false,
  icon,
  suffix,
  className,
  ...rest
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={name} className="block text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
          {label}
          {required && <span className="ml-0.5 text-accent">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            {icon}
          </span>
        )}
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error || hint ? `${name}-desc` : undefined}
          className={classNames(
            'h-11 w-full rounded-lg border border-white/[0.1] bg-white/[0.03] px-3.5 text-sm text-text-primary placeholder:text-text-muted/70 outline-none transition-colors focus:border-accent/70 focus:bg-white/[0.05] focus:ring-1 focus:ring-accent/40 disabled:opacity-50',
            icon && 'pl-10',
            suffix && 'pr-10',
            error && 'border-error/70 focus:border-error focus:ring-error/40',
            className
          )}
          {...rest}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
            {suffix}
          </span>
        )}
      </div>
      {(error || hint) && (
        <p
          id={`${name}-desc`}
          className={classNames('text-xs', error ? 'text-error' : 'text-text-muted')}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}
