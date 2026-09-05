import { classNames } from '@/utils/classNames';

const AVATAR_SIZES = { sm: 'h-8 w-8 text-sm', md: 'h-10 w-10 text-base', lg: 'h-14 w-14 text-lg' };

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() || '')
    .join('') || '?';
}

export default function Avatar({ src, name = '', size = 'md' }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={classNames(
          AVATAR_SIZES[size],
          'rounded-full object-cover border border-white/[0.08]'
        )}
      />
    );
  }
  return (
    <div
      className={classNames(
        AVATAR_SIZES[size],
        'flex items-center justify-center rounded-full bg-accent/15 font-semibold text-accent border border-accent/20'
      )}
    >
      {getInitials(name)}
    </div>
  );
}
