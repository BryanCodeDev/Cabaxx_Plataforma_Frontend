const VITE_ARTIST_SLUG = import.meta.env.VITE_ARTIST_SLUG || 'cabaxx';

function getSubdomain() {
  if (typeof window === 'undefined') return null;
  const host = window.location.hostname;
  const parts = host.split('.');
  if (parts.length > 2) return parts[0];
  if (parts.length === 2 && parts[1] !== 'localhost' && parts[1] !== 'local') return parts[0];
  return null;
}

export function detectArtistSlug() {
  const subdomain = getSubdomain();
  if (subdomain && subdomain !== 'www' && subdomain !== 'map') return subdomain;
  return VITE_ARTIST_SLUG;
}
