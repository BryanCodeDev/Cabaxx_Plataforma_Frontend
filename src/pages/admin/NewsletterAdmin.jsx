import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Send } from 'lucide-react';
import { newsletterSubscribersApi, newsletterCampaignsApi } from '@/services/modules';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/admin/DataTable';
import FormModal from '@/components/admin/FormModal';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import SectionHeading from '@/components/common/SectionHeading';
import Badge from '@/components/common/Badge';

const STATUS_VARIANT = { subscribed: 'success', unsubscribed: 'default', bounced: 'error' };

export default function NewsletterAdmin() {
  const [subscribers, setSubscribers] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [loadingCamps, setLoadingCamps] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ subject: '', content_html: '' });

  const loadSubs = () => {
    setLoadingSubs(true);
    newsletterSubscribersApi
      .list({ params: { limit: 200 } })
      .then((rows) => setSubscribers(rows))
      .catch(() => toast.error('Error al cargar suscriptores'))
      .finally(() => setLoadingSubs(false));
  };

  const loadCamps = () => {
    setLoadingCamps(true);
    newsletterCampaignsApi
      .list()
      .then((rows) => setCampaigns(rows))
      .catch(() => toast.error('Error al cargar campañas'))
      .finally(() => setLoadingCamps(false));
  };

  useEffect(() => {
    loadSubs();
    loadCamps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async (id) => {
    if (!window.confirm('¿Enviar esta campaña a todos los suscriptores activos?')) return;
    try {
      await newsletterCampaignsApi.send(id);
      toast.success('Campaña enviada');
    } catch {
      toast.error('No se pudo enviar la campaña');
    }
  };

  const subscriberColumns = [
    { key: 'email', label: 'Email' },
    { key: 'name', label: 'Nombre', render: (r) => r.name || '—' },
    { key: 'status', label: 'Estado', render: (r) => <Badge variant={STATUS_VARIANT[r.status] || 'default'} size="sm">{r.status}</Badge> },
    { key: 'subscribed_at', label: 'Desde', render: (r) => (r.subscribed_at ? new Date(r.subscribed_at).toLocaleDateString('es-CO') : '—') },
  ];

  return (
    <DashboardLayout breadcrumb="Newsletter">
      <div className="space-y-6">
        <SectionHeading eyebrow="Panel" title="Newsletter" subtitle="Suscriptores y campañas" />

        <Card padding="lg">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-xl text-text-primary">Suscriptores ({subscribers.length})</h3>
          </div>
          <DataTable
            columns={subscriberColumns}
            data={subscribers}
            loading={loadingSubs}
            searchable
            emptyMessage="Sin suscriptores"
            fields={[]}
            onDelete={async (row) => { await newsletterSubscribersApi.remove(row.id); toast.success('Suscriptor eliminado'); }}
            onChanged={loadSubs}
          />
        </Card>

        <Card padding="lg">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-xl text-text-primary">Campañas</h3>
            <Button onClick={() => { setForm({ subject: '', content_html: '' }); setOpen(true); }}>Nueva campaña</Button>
          </div>
          {loadingCamps ? (
            <p className="text-sm text-text-muted">Cargando...</p>
          ) : !campaigns.length ? (
            <p className="text-sm text-text-muted">Sin campañas enviadas.</p>
          ) : (
            <div className="divide-y divide-border">
              {campaigns.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{c.subject}</p>
                    <p className="text-xs text-text-muted">
                      {c.total_sent ? `${c.total_sent} enviados` : 'Borrador'} · {c.created_at ? new Date(c.created_at).toLocaleDateString('es-CO') : ''}
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" icon={<Send className="h-4 w-4" />} onClick={() => handleSend(c.id)}>
                    Enviar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <FormModal isOpen={open} onClose={() => setOpen(false)} title="Nueva campaña" onSubmit={async (e) => {
        e.preventDefault();
        try {
          await newsletterCampaignsApi.create(form);
          toast.success('Campaña creada');
          setOpen(false);
          loadCamps();
        } catch {
          toast.error('No se pudo crear la campaña');
        }
      }}>
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="block text-sm font-medium text-text-secondary">Asunto</span>
            <input
              className="input-base"
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              placeholder="Gran lanzamiento"
            />
          </div>
          <div className="space-y-1">
            <span className="block text-sm font-medium text-text-secondary">Contenido (HTML)</span>
            <textarea
              className="input-base resize-y"
              rows={6}
              value={form.content_html}
              onChange={(e) => setForm((f) => ({ ...f, content_html: e.target.value }))}
              placeholder="<h1>Hola!</h1><p>...</p>"
            />
          </div>
        </div>
      </FormModal>
    </DashboardLayout>
  );
}
