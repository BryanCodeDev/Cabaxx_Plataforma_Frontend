import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { X } from 'lucide-react';
import { useFocusTrap } from '@/hooks/useFocusTrap';

export default function FormModal({ isOpen, onClose, title, children, onSubmit, loading }) {
  const panelRef = useFocusTrap(isOpen, onClose);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Formulario'}
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-t-2xl border border-border bg-surface shadow-elev-3 sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="font-display text-lg text-text-primary">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-text-muted transition hover:bg-white/5 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="max-h-[calc(100vh-8rem)] overflow-y-auto p-5 sm:max-h-[calc(100vh-12rem)]">
          {children}
          <div className="sticky bottom-0 -mx-5 mt-6 flex justify-end gap-2 border-t border-border bg-surface px-5 pt-4">
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
