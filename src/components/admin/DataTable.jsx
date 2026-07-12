import { useState } from 'react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';
import FormModal from './FormModal';

export default function DataTable({ columns = [], data = [], loading = false, onAdd, searchable = false, emptyMessage = 'Sin datos' }) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const filtered = data.filter((row) =>
    columns.some((c) => String(row[c.key] ?? '').toLowerCase().includes(search.toLowerCase()))
  );

  const onEdit = (row) => { setSelected(row); setOpen(true); };
  const onDelete = async (row) => {
    if (!confirm('¿Eliminar elemento?')) return;
    setDeleteLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setDeleteLoading(false);
  };

  const handleSubmit = (e) => { e.preventDefault(); onAdd?.(); setOpen(false); };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {searchable && (
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar..." className="max-w-xs" />
        )}
        {onAdd && (
          <Button onClick={() => { setSelected(null); setOpen(true); }}>Nuevo</Button>
        )}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-2 text-text-secondary">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="px-4 py-3 font-medium">{c.label}</th>
              ))}
              {(onAdd) && <th className="px-4 py-3 font-medium">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading && (
              <tr><td colSpan={columns.length + 1} className="px-4 py-10"><Spinner /></td></tr>
            )}
            {!loading && !filtered.length && (
              <tr><td colSpan={columns.length + 1} className="px-4 py-10 text-center text-text-muted">{emptyMessage}</td></tr>
            )}
            {filtered.map((row, i) => (
              <tr key={row.id || i} className="transition hover:bg-surface-2">
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-3 text-text-primary">
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
                {onAdd && (
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onEdit(row)}>Editar</Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(row)} loading={deleteLoading}>Eliminar</Button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <FormModal isOpen={open} onClose={() => setOpen(false)} title={selected ? 'Editar' : 'Nuevo'} onSubmit={handleSubmit}>
        {columns.map((c) => (
          <Input key={c.key} name={c.key} label={c.label} defaultValue={selected?.[c.key] ?? ''} />
        ))}
      </FormModal>
    </div>
  );
}
