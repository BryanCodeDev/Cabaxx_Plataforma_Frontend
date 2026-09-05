import { useEffect, useRef } from 'react';
import { classNames } from '@/utils/classNames';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { X } from 'lucide-react';

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[min(96vw,1100px)]',
};

/**
 * Modal accesible: focus-trap, retorno de foco al cerrar,
 * cierre con Escape/click fuera, lock de scroll del body.
 *
 * @param {boolean} isOpen
 * @param {function} onClose
 * @param {string} title
 * @param {string} description (opcional, para aria-describedby)
 * @param {node} children
 * @param {string} size - 'sm'|'md'|'lg'|'xl'|'full'
 * @param {boolean} showCloseButton
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
}) {
  const triggerRef = useRef(null);
  const panelRef = useFocusTrap(isOpen, onClose);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.body.style.overflow = reduce ? '' : 'hidden';
    } else {
      document.body.style.overflow = '';
      const t = triggerRef.current;
      if (t && typeof t.focus === 'function') {
        requestAnimationFrame(() => t.focus());
      }
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const titleId = 'modal-title';
  const descId = description ? 'modal-desc' : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={descId}
        className={classNames(
          'relative z-10 w-full overflow-hidden rounded-t-2xl border border-white/[0.08] bg-app-modal shadow-elev-3 animate-slide-up sm:rounded-2xl',
          SIZES[size]
        )}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-4">
            <h3 id={titleId} className="truncate font-display text-base uppercase tracking-wide text-text-primary">
              {title}
            </h3>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-md p-1.5 text-text-muted transition hover:bg-white/[0.06] hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="Cerrar diálogo"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
        {description && (
          <p id={descId} className="sr-only">
            {description}
          </p>
        )}
        <div className="max-h-[calc(100vh-8rem)] overflow-y-auto p-5 sm:max-h-[calc(100vh-12rem)]">
          {children}
        </div>
      </div>
    </div>
  );
}
