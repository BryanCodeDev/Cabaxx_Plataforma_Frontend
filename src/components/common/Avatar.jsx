import { getInitials } from '@/utils/format';

const SIZES = { sm: 'h-8 w-8 text-sm', md: 'h-10 w-10 text-base', lg: 'h-14 w-14 text-lg' };

/**
 * Avatar circular. Si no hay src, muestra iniciales.
 * @param {string} src
 * @param {string} name
 * @param {string} size - 'sm'|'md'|'lg'
 */
export default function Avatar({ src, name = '', size = 'md' }) {
  if (src) {
    return <img src={src} alt={name} className={`${SIZES[size]} rounded-full object-cover border border-border`} />;
  }
  return (
    <div className={`${SIZES[size]} flex items-center justify-center rounded-full bg-accent/20 font-semibold text-accent`}>
      {getInitials(name)}
    </div>
  );
}
