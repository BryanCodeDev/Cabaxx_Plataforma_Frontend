export function getInitials(name = '') {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency }).format(amount || 0);
}

export function formatDate(date, options = { year: 'numeric', month: 'short', day: 'numeric' }) {
  if (!date) return '';
  return new Intl.DateTimeFormat('es-CO', options).format(new Date(date));
}

export function formatNumber(value) {
  return new Intl.NumberFormat('es-CO').format(value || 0);
}

export function formatDuration(seconds) {
  if (!seconds) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
