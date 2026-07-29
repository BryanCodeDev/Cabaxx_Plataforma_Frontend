import { useState, useRef, useEffect } from 'react';
import { classNames } from '@/utils/classNames';

/**
 * Dropdown accesible con soporte de íconos y variante danger.
 * @param {node}    trigger
 * @param {Array}   items    — [{ label, icon, onClick, danger, divider }]
 * @param {'left'|'right'} align
 */
export default function Dropdown({ trigger, items = [], align = 'right' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKeyDown      = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>

      {/* Panel */}
      {open && (
        <div
          role="menu"
          className={classNames(
            'absolute z-50 mt-2 min-w-[11rem] overflow-hidden rounded-2xl border border-border bg-surface py-1.5 shadow-card',
            'animate-in fade-in slide-in-from-top-1 duration-150',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {items.map((item, i) => {
            if (item.divider) {
              return <div key={i} className="my-1 border-t border-border/60" />;
            }
            const Icon = item.icon;
            return (
              <button
                key={i}
                role="menuitem"
                onClick={() => { setOpen(false); item.onClick?.(); }}
                className={classNames(
                  'flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors',
                  item.danger
                    ? 'text-error hover:bg-error/10'
                    : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary',
                  'focus-visible:outline-none focus-visible:bg-surface-2'
                )}
              >
                {Icon && <Icon className="h-4 w-4 shrink-0 opacity-70" />}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}