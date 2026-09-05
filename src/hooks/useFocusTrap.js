import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Traps keyboard focus within a container while `active` is true.
 * - Auto-focuses the first focusable element on activation.
 * - Cycles Tab/Shift+Tab inside the container.
 * - Returns Escape to close (optional via onEscape).
 *
 * @param {boolean} active
 * @param {() => void} [onEscape]
 * @returns {React.RefObject}
 */
export function useFocusTrap(active, onEscape) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active || !ref.current) return undefined;
    const root = ref.current;

    const focusables = () =>
      Array.from(root.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
        (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
      );

    const first = focusables()[0];
    if (first) first.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        onEscape?.();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    root.addEventListener('keydown', onKeyDown);
    return () => root.removeEventListener('keydown', onKeyDown);
  }, [active, onEscape]);

  return ref;
}