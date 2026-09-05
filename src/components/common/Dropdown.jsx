import { useState, useRef, useEffect } from 'react';
import { classNames } from '@/utils/classNames';

/**
 * Dropdown accesible:
 *  - role="menu" + role="menuitem" para lectores de pantalla
 *  - aria-expanded/haspopup en el trigger
 *  - ArrowDown/ArrowUp/Enter navegan entre items
 *  - Escape y click fuera cierran
 *  - Devuelve foco al trigger al cerrar
 *
 * @param {node} trigger - elemento clickable (botón recomendado)
 * @param {Array} items - [{ label, icon, onClick, danger, disabled }]
 * @param {string} align - 'left'|'right'
 * @param {string} ariaLabel - etiqueta accesible del menú
 */
export default function Dropdown({ trigger, items = [], align = 'right', ariaLabel = 'Menú' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const items = menuRef.current?.querySelectorAll('[role="menuitem"]:not([disabled])');
        if (items?.length) items[0].focus();
      }
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const focusItem = (current, direction) => {
    const all = menuRef.current?.querySelectorAll('[role="menuitem"]:not([disabled])');
    if (!all?.length) return;
    const idx = Array.from(all).indexOf(current);
    const next = (idx + direction + all.length) % all.length;
    all[next]?.focus();
  };

  return (
    <div className="relative" ref={ref}>
      <div
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        role="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        {trigger}
      </div>
      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label={ariaLabel}
          className={classNames(
            'animate-in fade-in slide-in-from-top-1 absolute z-50 mt-2 min-w-[12rem] overflow-hidden rounded-xl border border-border bg-surface py-1.5 shadow-elev-3 duration-150',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                tabIndex={open ? 0 : -1}
                onClick={() => {
                  setOpen(false);
                  triggerRef.current?.focus();
                  item.onClick?.();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') { e.preventDefault(); focusItem(e.currentTarget, 1); }
                  else if (e.key === 'ArrowUp') { e.preventDefault(); focusItem(e.currentTarget, -1); }
                }}
                className={classNames(
                  'flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm transition-colors',
                  'focus:bg-white/[0.08] focus:outline-none',
                  item.disabled && 'opacity-50 cursor-not-allowed',
                  item.danger
                    ? 'text-error hover:bg-error/10'
                    : 'text-text-secondary hover:bg-white/[0.05] hover:text-text-primary'
                )}
              >
                {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}