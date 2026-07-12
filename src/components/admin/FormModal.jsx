import { useState } from 'react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { X } from 'lucide-react';

export default function FormModal({ isOpen, onClose, title, children, onSubmit, loading }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-border bg-surface shadow-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="font-display text-lg text-text-primary">{title}</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-5">
          {children}
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
            <Button type="submit" loading={loading}>Guardar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function FormField({ label, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm text-text-secondary">{label}</label>}
      <Input {...props} />
    </div>
  );
}
