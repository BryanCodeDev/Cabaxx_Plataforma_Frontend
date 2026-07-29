import { classNames } from '@/utils/classNames';

/**
 * Input con label, estados de error/hint e icono opcional.
 * @param {string} label
 * @param {string} name
 * @param {string} type
 * @param {string} placeholder
 * @param {any} value
 * @param {function} onChange
 * @param {string} error - mensaje de error
 * @param {string} hint - texto de ayuda
 * @param {boolean} required
 * @param {boolean} disabled
 * @param {node} icon - icono a la izquierda
 * @param {node} suffix - elemento a la derecha
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
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-text-secondary">
          {label}
          {required && <span className="text-accent"> *</span>}
        </label>
      )}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">{icon}</span>}
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={classNames(
            'input-base',
            icon && 'pl-10',
            suffix && 'pr-10',
            error && 'border-error focus:border-error focus:ring-error'
          )}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">{suffix}</span>}
      </div>
      {error ? (
        <p className="text-xs text-error">{error}</p>
      ) : hint ? (
        <p className="text-xs text-text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
