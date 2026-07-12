import { classNames } from '@/utils/classNames';

export default function Textarea({ label, name, error, className, rows = 4, ...props }) {
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
