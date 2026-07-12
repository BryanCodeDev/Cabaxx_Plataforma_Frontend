import { classNames } from '@/utils/classNames';

export default function Select({ label, name, error, options = [], className, ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        className={classNames(
          'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary',
          error && 'border-red-500',
          className
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
