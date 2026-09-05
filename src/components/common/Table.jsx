import Spinner from './Spinner';
import { classNames } from '@/utils/classNames';

/**
 * Tabla genérica basada en columnas.
 * @param {Array} columns - [{ key, label, render?, align? }]
 * @param {Array} data - filas
 * @param {boolean} loading
 * @param {string} emptyMessage
 * @param {function} onRowClick - (row) => void
 */
export default function Table({ columns = [], data = [], loading = false, emptyMessage = 'Sin datos', onRowClick }) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }
  if (!data.length) {
    return <div className="py-12 text-center text-sm text-text-muted">{emptyMessage}</div>;
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
      <table className="w-full text-left text-sm">
        <thead className="bg-white/[0.02] text-[10px] uppercase tracking-[0.12em] text-text-muted">
          <tr className="border-b border-white/[0.06]">
            {columns.map((c) => (
              <th
                key={c.key}
                className={classNames('px-4 py-3 font-semibold', c.align === 'right' && 'text-right', c.align === 'center' && 'text-center')}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {data.map((row, i) => (
            <tr
              key={row.id || i}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? 'cursor-pointer transition hover:bg-white/[0.025]' : ''}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={classNames('px-4 py-3.5 text-text-primary', c.align === 'right' && 'text-right', c.align === 'center' && 'text-center')}
                >
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
