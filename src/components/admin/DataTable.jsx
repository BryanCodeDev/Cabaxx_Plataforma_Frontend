import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';
import FormModal from './FormModal';
import { classNames } from '@/utils/classNames';

function FileControl({ field, value, onChange }) {
  const preview = typeof value === 'string' && value ? value : null;
  const fileName = value instanceof File ? value.name : null;
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-2">
        {preview ? (
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-text-muted">
            <Upload className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label className="cursor-pointer rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm text-text-primary transition hover:border-accent/50">
          {preview || fileName ? 'Reemplazar' : 'Subir archivo'}
          <input
            type="file"
            accept={field.accept}
            className="hidden"
            onChange={(e) => onChange(field.name, e.target.files?.[0] || null)}
          />
        </label>
        {(preview || fileName) && (
          <button
            type="button"
            onClick={() => onChange(field.name, null)}
            className="inline-flex items-center gap-1 text-xs text-text-muted transition hover:text-error"
          >
            <X className="h-3.5 w-3.5" /> Quitar
          </button>
        )}
        {fileName && <span className="max-w-[10rem] truncate text-xs text-text-muted">{fileName}</span>}
      </div>
    </div>
  );
}

function FieldControl({ field, value, onChange }) {
  if (field.type === 'file') {
    return (
      <div className="space-y-1">
        <span className="block text-sm font-medium text-text-secondary">{field.label}</span>
        <FileControl field={field} value={value} onChange={onChange} />
      </div>
    );
  }
  if (field.type === 'checkbox' || field.type === 'switch') {
    return (
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={!!value}
          onClick={() => onChange(field.name, !value)}
          className={classNames(
            'relative h-6 w-11 shrink-0 rounded-full transition-colors',
            value ? 'bg-accent' : 'border border-border bg-surface-2'
          )}
        >
          <span className={classNames('absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all', value ? 'left-[1.375rem]' : 'left-0.5')} />
        </button>
        <span className="text-sm text-text-secondary">{field.label}</span>
      </div>
    );
  }
  if (field.type === 'select' || field.type === 'status') {
    return (
      <div className="space-y-1">
        <span className="block text-sm font-medium text-text-secondary">{field.label}</span>
        <select
          name={field.name}
          value={value ?? ''}
          onChange={(e) => onChange(field.name, e.target.value)}
          className="input-base"
        >
          {!field.hidePlaceholder && <option value="">{field.placeholder || 'Selecciona...'}</option>}
          {(field.options || []).map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    );
  }
  if (field.type === 'textarea') {
    return (
      <div className="space-y-1">
        <span className="block text-sm font-medium text-text-secondary">{field.label}</span>
        <textarea
          name={field.name}
          rows={field.rows || 4}
          placeholder={field.placeholder}
          value={value ?? ''}
          onChange={(e) => onChange(field.name, e.target.value)}
          className="input-base resize-y"
        />
      </div>
    );
  }
  return (
    <Input
      label={field.label}
      name={field.name}
      type={field.type || 'text'}
      placeholder={field.placeholder}
      value={value ?? ''}
      onChange={(e) => {
        const raw = e.target.value;
        onChange(field.name, field.type === 'number' && raw !== '' ? Number(raw) : raw);
      }}
    />
  );
}

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  searchable = false,
  emptyMessage = 'Sin datos',
  fields = [],
  onAdd,
  onEdit,
  onDelete,
  onChanged,
  toFormValues,
  toPayload,
  addLabel = 'Nuevo',
}) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [values, setValues] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const canEdit = !!(onAdd || onEdit);
  const canDelete = !!onDelete;

  const safeData = Array.isArray(data) ? data : [];
  const filtered = safeData.filter((row) =>
    columns.some((c) => String(row?.[c.key] ?? '').toLowerCase().includes(search.toLowerCase()))
  );

  const setField = (name, value) => setValues((prev) => ({ ...prev, [name]: value }));

  const openCreate = () => {
    setSelected(null);
    setValues({});
    setOpen(true);
  };

  const openEdit = (row) => {
    const base = {};
    fields.forEach((f) => {
      if (row[f.name] !== undefined) base[f.name] = row[f.name];
    });
    setValues(toFormValues ? toFormValues(row, base) : base);
    setSelected(row);
    setOpen(true);
  };

  const handleDelete = async (row) => {
    if (!window.confirm('¿Eliminar este elemento? Esta acción no se puede deshacer.')) return;
    try {
      await onDelete(row);
      onChanged?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error al eliminar');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = toPayload ? toPayload(values) : values;
      if (selected) await onEdit(selected, payload);
      else await onAdd(payload);
      setOpen(false);
      onChanged?.();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error al guardar');
    } finally {
      setSubmitting(false);
    }
  };

  const showActions = canEdit || canDelete;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {searchable ? (
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar..." className="max-w-xs" />
        ) : (
          <span />
        )}
        {onAdd && <Button onClick={openCreate}>{addLabel}</Button>}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-2 text-text-secondary">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="px-4 py-3 font-medium">{c.label}</th>
              ))}
              {showActions && <th className="px-4 py-3 text-right font-medium">Acciones</th>}
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
              <tr key={row.id || i} className="transition hover:bg-surface-2/60">
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-3 text-text-primary">
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
                {showActions && (
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {onEdit && (
                        <Button variant="ghost" size="sm" onClick={() => openEdit(row)}>Editar</Button>
                      )}
                      {onDelete && (
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(row)}>Eliminar</Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(onAdd || onEdit) && fields.length > 0 && (
        <FormModal
          isOpen={open}
          onClose={() => setOpen(false)}
          title={selected ? 'Editar' : 'Nuevo'}
          onSubmit={handleSubmit}
          loading={submitting}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.name} className={f.fullWidth ? 'sm:col-span-2' : ''}>
                <FieldControl field={f} value={values[f.name]} onChange={setField} />
              </div>
            ))}
          </div>
        </FormModal>
      )}
    </div>
  );
}
