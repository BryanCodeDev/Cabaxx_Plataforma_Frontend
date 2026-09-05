import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { classNames } from '@/utils/classNames';
import { FOCUS } from '@/constants';

/**
 * Toggle de tema claro/oscuro.
 *
 * @param {'icon'|'switch'|'pill'} variant
 * @param {string} className
 */
export default function ThemeToggle({ variant = 'icon', className = '' }) {
  const { theme, toggle } = useTheme();
  const isLight = theme === 'light';

  const label = isLight ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro';

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={label}
        aria-pressed={isLight}
        title={label}
        className={classNames(
          'inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-accent/50 hover:text-text-primary',
          FOCUS,
          className
        )}
      >
        {isLight ? <Moon className="h-4 w-4" aria-hidden="true" /> : <Sun className="h-4 w-4" aria-hidden="true" />}
      </button>
    );
  }

  if (variant === 'switch') {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={isLight}
        aria-label={label}
        onClick={toggle}
        className={classNames(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-border transition-colors',
          isLight ? 'bg-accent' : 'bg-surface-2',
          FOCUS,
          className
        )}
      >
        <span
          className={classNames(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
            isLight ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
    );
  }

  // pill: 'Tema claro' / 'Tema oscuro'
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      className={classNames(
        'inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:border-accent/50 hover:text-text-primary',
        FOCUS,
        className
      )}
    >
      {isLight ? <Moon className="h-4 w-4" aria-hidden="true" /> : <Sun className="h-4 w-4" aria-hidden="true" />}
      <span>{isLight ? 'Tema oscuro' : 'Tema claro'}</span>
    </button>
  );
}
