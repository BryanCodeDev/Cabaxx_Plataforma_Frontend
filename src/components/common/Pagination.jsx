import { classNames } from '@/utils/classNames';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function getRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, '…', total];
  if (current >= total - 2) return [1, '…', total - 3, total - 2, total - 1, total];
  return [1, '…', current - 1, current, current + 1, '…', total];
}

/**
 * Paginación responsive:
 * - En <sm muestra sólo "Anterior / X / Y / Siguiente" + iconos compactos
 * - En sm+ muestra la tira de páginas con elipsis
 * - Accesible: aria-label, aria-current, foco visible
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showInfo = true,
  total,
}) {
  if (totalPages <= 1) return null;
  const range = getRange(currentPage, totalPages);

  const btnBase =
    'inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg border px-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary';
  const btnEnabled = 'border-white/[0.08] text-text-secondary hover:border-white/20 hover:bg-white/[0.04] hover:text-text-primary';
  const btnDisabled = 'border-white/[0.06] pointer-events-none opacity-30';

  return (
    <nav
      aria-label="Paginación"
      className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between"
    >
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Página anterior"
          className={classNames(btnBase, currentPage <= 1 ? btnDisabled : btnEnabled)}
        >
          <ChevronLeft className="h-4 w-4 sm:hidden" />
          <span className="hidden sm:inline">Anterior</span>
        </button>
        <ul className="flex items-center gap-1">
          {range.map((p, i) =>
            p === '…' ? (
              <li key={`e-${i}`} aria-hidden="true" className="px-1 text-text-muted">
                …
              </li>
            ) : (
              <li key={p}>
                <button
                  type="button"
                  onClick={() => onPageChange(p)}
                  aria-current={p === currentPage ? 'page' : undefined}
                  aria-label={`Ir a la página ${p}`}
                  className={classNames(
                    btnBase,
                    p === currentPage
                      ? 'border-accent bg-accent/15 text-accent'
                      : btnEnabled
                  )}
                >
                  {p}
                </button>
              </li>
            )
          )}
        </ul>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Página siguiente"
          className={classNames(btnBase, currentPage >= totalPages ? btnDisabled : btnEnabled)}
        >
          <ChevronRight className="h-4 w-4 sm:hidden" />
          <span className="hidden sm:inline">Siguiente</span>
        </button>
      </div>
      {showInfo && total != null && (
        <p className="text-xs text-text-muted sm:text-sm">
          {total} {total === 1 ? 'resultado' : 'resultados'}
        </p>
      )}
    </nav>
  );
}