import Spinner from './Spinner';

/**
 * Tabla genérica basada en columnas.
 * @param {Array} columns - [{ key, label, render? }]
 * @param {Array} data - filas
 * @param {boolean} loading
 * @param {string} emptyMessage
 * @param {function} onRowClick - (row) => void
 */
export default function Table({ columns = [], data = [], loading = false, emptyMessage = 'Sin datos', onRowClick }) {
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  }
  if (!data.length) {
    return <div className="py-10 text-center text-text-muted">{emptyMessage}</div>;
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-2 text-text-secondary">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-3 font-medium">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((row, i) => (
            <tr
              key={row.id || i}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? 'cursor-pointer transition hover:bg-surface-2' : ''}
            >
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3 text-text-primary">
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
