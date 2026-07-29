import { classNames } from '@/utils/classNames';

/**
 * Checkbox alineado al sistema de diseño Cabaxx.
 * @param {string}  label
 * @param {string}  name
 * @param {string}  hint      — texto de ayuda debajo del label
 * @param {boolean} disabled
 * @param {string}  className
 */
export default function Checkbox({ label, name, hint, disabled = false, className = '', ...props }) {
  return (
    <label
      className={classNames(
        'group flex cursor-pointer items-start gap-3',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <div className="relative mt-0.5 shrink-0">
        <input
          type="checkbox"
          name={name}
          id={name}
          disabled={disabled}
          className={classNames(
            'peer h-4 w-4 cursor-pointer appearance-none rounded border border-border bg-surface-2',
            'checked:border-accent checked:bg-accent',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary',
            'transition-colors duration-150',
            disabled && 'cursor-not-allowed'
          )}
          {...props}
        />
        {/* Checkmark SVG visible cuando está checked */}
        <svg
          className="pointer-events-none absolute left-0.5 top-0.5 hidden h-3 w-3 text-white peer-checked:block"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M2 6l3 3 5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div>
        {label && (
          <span className="block text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">
            {label}
          </span>
        )}
        {hint && (
          <span className="mt-0.5 block text-xs text-text-muted">{hint}</span>
        )}
      </div>
    </label>
  );
}