import { lazy, Suspense } from 'react';
import { Spinner } from '@/components/common/Spinner';

export { formatNumber, formatDate, formatDuration } from './format';
export { getInitials } from './format';
export { isExternalUrl, pluralize } from './helpers';

export function formatCOP(amount) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount || 0);
}

export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function lazyLoadImages() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
  const images = document.querySelectorAll('img[data-src]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  images.forEach((img) => observer.observe(img));
}

export function prefetchRoute(routePath) {
  const links = document.querySelectorAll(`link[rel="prefetch"][href="${routePath}"]`);
  if (links.length > 0) return;
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = routePath;
  document.head.appendChild(link);
}
