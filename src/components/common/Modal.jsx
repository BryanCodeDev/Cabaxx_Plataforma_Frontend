import { useEffect } from 'react';
import { classNames } from '@/utils/classNames';
import { X } from 'lucide-react';

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

/**
 * Modal con overlay oscuro, animación de entrada y cierre con Escape/click fuera.
 * @param {boolean} isOpen
 * @param {function} onClose
 * @param {string} title
 * @param {node} children
 * @param {string} size - 'sm'|'md'|'lg'|'xl'
 * @param {boolean} showCloseButton
 */
export default function Modal({ isOpen, onClose, title, children, size = 'md', showCloseButton = true }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={classNames('relative z-10 w-full rounded-2xl border border-border bg-surface shadow-[0_24px_60px_rgba(0,0,0,0.6)] animate-slide-up', SIZES[size])}>
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="font-display text-lg uppercase text-text-primary">{title}</h3>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="rounded-full p-1 text-text-muted transition hover:bg-white/5 hover:text-accent"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}