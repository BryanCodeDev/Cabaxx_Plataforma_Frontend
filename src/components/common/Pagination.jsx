import { classNames } from '@/utils/classNames';

/**
 * Paginación.
 * @param {number} currentPage
 * @param {number} totalPages
 * @param {function} onPageChange - (page) => void
 * @param {boolean} showInfo
 * @param {number} total
 * @param {number} limit
 */
export default function Pagination({ currentPage, totalPages, onPageChange, showInfo = true, total, limit }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary transition hover:bg-surface-2 disabled:opacity-40"
        >
          Anterior
        </button>
        <span className="text-sm text-text-muted">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary transition hover:bg-surface-2 disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>
      {showInfo && total != null && <p className="text-sm text-text-muted">{total} resultados</p>}
    </div>
  );
}
