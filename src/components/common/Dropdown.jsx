import { useState, useRef, useEffect } from 'react';
import { classNames } from '@/utils/classNames';

/**
 * Dropdown simple que abre al hacer click en trigger.
 * @param {node} trigger
 * @param {Array} items - [{ label, icon, onClick, danger }]
 * @param {string} align - 'left'|'right'
 */
export default function Dropdown({ trigger, items = [], align = 'right' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={classNames(
            'animate-in fade-in slide-in-from-top-1 absolute z-50 mt-2 min-w-[11rem] overflow-hidden rounded-xl border border-border bg-surface py-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.5)] duration-150',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={() => {
                  setOpen(false);
                  item.onClick?.();
                }}
                className={classNames(
                  'flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm transition-colors',
                  item.danger
                    ? 'text-error hover:bg-error/10'
                    : 'text-text-secondary hover:bg-white/[0.05] hover:text-text-primary'
                )}
              >
                {Icon && <Icon className="h-4 w-4 shrink-0" />}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}