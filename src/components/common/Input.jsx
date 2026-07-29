import { classNames } from '@/utils/classNames';

/**
 * Input del sistema de diseño Cabaxx.
 * @param {string}  label
 * @param {string}  name
 * @param {string}  type
 * @param {string}  placeholder
 * @param {any}     value
 * @param {function} onChange
 * @param {string}  error    — mensaje de error
 * @param {string}  hint     — texto de ayuda
 * @param {boolean} required
 * @param {boolean} disabled
 * @param {boolean} readOnly
 * @param {node}    icon     — ícono izquierdo (Lucide)
 * @param {node}    suffix   — elemento derecho (ícono, texto, botón)
 * @param {string}  className — clases extra para el input
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
  readOnly = false,
  icon,
  suffix,
  className = '',
  ...rest
}) {
  const id = name || `input-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="flex items-center gap-1 text-sm font-medium text-text-secondary">
          {label}
          {required && <span className="text-accent" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
            {icon}
          </span>
        )}

        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={classNames(
            // base
            'w-full rounded-xl border bg-surface-2 px-4 py-2.5 text-sm text-text-primary',
            'placeholder:text-text-muted',
            'transition-colors duration-150',
            // focus
            'focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/60',
            // estados
            error
              ? 'border-error/60 focus:border-error focus:ring-error/30'
              : 'border-border/70 hover:border-border',
            disabled && 'cursor-not-allowed opacity-50',
            readOnly && 'cursor-default',
            // íconos
            icon   && 'pl-10',
            suffix && 'pr-10',
            className
          )}
          {...rest}
        />

        {suffix && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted">
            {suffix}
          </span>
        )}
      </div>

      {error ? (
        <p id={`${id}-error`} role="alert" className="flex items-center gap-1 text-xs text-error">
          <svg className="h-3 w-3 shrink-0" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 3.5a.5.5 0 01.5.5v2a.5.5 0 01-1 0V5a.5.5 0 01.5-.5zm0 4.25a.625.625 0 110-1.25.625.625 0 010 1.25z"/>
          </svg>
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-text-muted">{hint}</p>
      ) : null}
    </div>
  );
}