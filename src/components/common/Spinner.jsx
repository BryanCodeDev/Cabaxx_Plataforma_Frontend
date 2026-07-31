import { classNames } from '@/utils/classNames';

const SIZES = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };

const COLORS = {
  accent: 'text-accent',
  primary: 'text-text-primary',
  gold: 'text-accent',
  muted: 'text-text-muted',
};

/**
 * Spinner CSS puro (sin librerías).
 * @param {string} size - 'sm'|'md'|'lg'
 * @param {string} color - 'accent'|'primary'|'gold'|'muted'
 */
export default function Spinner({ size = 'md', color = 'accent' }) {
  return (
    <svg className={classNames('animate-spin', SIZES[size], COLORS[color])} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}
