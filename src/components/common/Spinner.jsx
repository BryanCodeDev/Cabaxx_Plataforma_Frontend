import { classNames } from '@/utils/classNames';

const SIZES = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' };

const COLORS = {
  accent: 'text-accent',
  primary: 'text-text-primary',
  gold: 'text-accent',
  muted: 'text-text-muted',
};

/**
 * Spinner CSS puro (sin librerías) — círculo con un trazo de 25% que gira.
 * @param {string} size - 'sm'|'md'|'lg'
 * @param {string} color - 'accent'|'primary'|'gold'|'muted'
 */
export default function Spinner({ size = 'md', color = 'accent' }) {
  return (
    <span
      role="status"
      aria-label="Cargando"
      className={classNames('inline-block animate-spin', SIZES[size], COLORS[color])}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.18" strokeWidth="2.5" />
        <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </span>
  );
}
