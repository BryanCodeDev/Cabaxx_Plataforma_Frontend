import Button from '@/components/common/Button';

/**
 * Barra inferior fija en mobile para flujos transaccionales (carrito/checkout).
 * En sm+ se oculta — la info ya está visible en el flujo.
 *
 * Props:
 *  - total: número o string (ej. "$120.000 COP")
 *  - primary: { label, onClick, disabled?, loading?, icon? }
 *  - secondary: { label, onClick } opcional
 */
export default function StickyCartSummary({ total, primary, secondary }) {
  return (
    <div
      role="region"
      aria-label="Resumen del pedido"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/95 px-4 py-3 backdrop-blur-md sm:hidden"
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Total</p>
          <p className="truncate font-mono text-base font-bold text-white tabular-nums">{total}</p>
        </div>
        {secondary && (
          <Button variant="secondary" size="sm" onClick={secondary.onClick}>
            {secondary.label}
          </Button>
        )}
        {primary && (
          <Button
            type="button"
            onClick={primary.onClick}
            disabled={primary.disabled}
            loading={primary.loading}
            icon={primary.icon}
          >
            {primary.label}
          </Button>
        )}
      </div>
    </div>
  );
}