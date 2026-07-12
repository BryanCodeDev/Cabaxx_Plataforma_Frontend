import { useState } from 'react';
import { classNames } from '@/utils/classNames';

export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 border-b border-border">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={classNames(
            'border-b-2 px-4 py-2 text-sm font-medium transition',
            active === t.key
              ? 'border-accent text-accent'
              : 'border-transparent text-text-muted hover:text-text-primary'
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
