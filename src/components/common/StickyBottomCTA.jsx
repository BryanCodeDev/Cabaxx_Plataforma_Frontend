import Button from '@/components/common/Button';

/**
 * StickyBottomCTA — barra de acción fija en mobile que sigue al usuario
 * durante scroll. En sm+ se oculta (la acción ya está visible en el flujo).
 *
 * Props:
 *  - primary: { label, onClick, disabled?, icon? }
 *  - secondary: { label, onClick } opcional
 *  - price: texto a la izquierda del botón principal (ej. "$120.000 COP")
 *  - className: extensión extra
 */
export default function StickyBottomCTA({ primary, secondary, price, className = '' }) {
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/95 px-4 py-3 backdrop-blur-md sm:hidden ${className}`}
      role="region"
      aria-label="Acción principal"
    >
      <div className="flex items-center gap-3">
        {price && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] uppercase tracking-[0.2em] text-white/40">Total</p>
            <p className="truncate font-mono text-base font-bold text-white">{price}</p>
          </div>
        )}
        {secondary && (
          <Button variant="secondary" size="sm" onClick={secondary.onClick}>
            {secondary.label}
          </Button>
        )}
        {primary && (
          <Button
            onClick={primary.onClick}
            disabled={primary.disabled}
            loading={primary.loading}
            fullWidth={!price && !secondary}
            className={!price && !secondary ? '' : 'shrink-0'}
            icon={primary.icon}
          >
            {primary.label}
          </Button>
        )}
      </div>
    </div>
  );
}