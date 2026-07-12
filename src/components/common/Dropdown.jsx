import { useState, useRef, useEffect } from 'react';
import { classNames } from '@/utils/classNames';

/**
 * Dropdown simple que abre al hacer click en trigger.
 * @param {node} trigger
 * @param {Array} items - [{ label, onClick }]
 * @param {string} align - 'left'|'right'
 */
export default function Dropdown({ trigger, items = [], align = 'right' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={classNames(
            'absolute z-50 mt-2 min-w-[10rem] rounded-lg border border-border bg-surface py-1 shadow-card animate-fade-in',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                setOpen(false);
                item.onClick?.();
              }}
              className="block w-full px-4 py-2 text-left text-sm text-text-secondary transition hover:bg-surface-2 hover:text-text-primary"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
