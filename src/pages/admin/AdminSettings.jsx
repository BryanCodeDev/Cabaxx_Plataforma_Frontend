import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import api from '@/services/api';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { SectionHeading } from '@/components/common';

export default function AdminSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/settings')
      .then((res) => setSettings(res.data?.data?.settings || {}))
      .catch(() => toast.error('Error al cargar configuración'))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    try {
      setSaving(true);
      await api.put('/settings', settings);
      toast.success('Configuración guardada');
    } catch {
      toast.error('No se pudo guardar');
    } finally {
      setSaving(false);
    }
  };

  const updateValue = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));
  const removeKey = (key) => setSettings((prev) => { const next = { ...prev }; delete next[key]; return next; });
  const addKey = () => setSettings((prev) => ({ ...prev, [`clave_${Object.keys(prev).length + 1}`]: '' }));

  const entries = Object.entries(settings);

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Panel" title="Configuración" subtitle="Ajustes generales del artista" />

      <Card padding="lg">
          {loading ? (
            <p className="text-sm text-text-muted">Cargando...</p>
          ) : (
            <div className="space-y-3">
              {entries.length === 0 && (
                <p className="text-sm text-text-muted">Sin configuraciones. Agrega una clave para empezar.</p>
              )}
              {entries.map(([key, value]) => (
                <div key={key} className="flex flex-col gap-2 rounded-xl border border-border bg-surface-2/40 p-3 sm:flex-row sm:items-center">
                  <input
                    className="input-base sm:w-56"
                    value={key}
                    onChange={(e) => {
                      const newKey = e.target.value;
                      setSettings((prev) => {
                        const next = { ...prev };
                        delete next[key];
                        next[newKey] = value;
                        return next;
                      });
                    }}
                  />
                  <input
                    className="input-base flex-1"
                    value={typeof value === 'object' ? JSON.stringify(value) : value ?? ''}
                    onChange={(e) => updateValue(key, e.target.value)}
                  />
                  <button
                    onClick={() => removeKey(key)}
                    className="inline-flex items-center justify-center rounded-lg border border-border px-3 py-2 text-text-muted transition hover:border-error/50 hover:text-error"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <Button variant="secondary" size="sm" icon={<Plus className="h-4 w-4" />} onClick={addKey}>
                Agregar clave
              </Button>
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <Button onClick={save} loading={saving}>Guardar cambios</Button>
          </div>
        </Card>
      </div>
  );
}
