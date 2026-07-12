import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import EmptyState from '@/components/common/EmptyState';
import SectionHeading from '@/components/common/SectionHeading';

export default function NewsletterAdmin() {
  const subscribers = [{ email: 'juan@example.com', since: '2026-05-10' }, { email: 'maria@example.com', since: '2026-06-01' }];
  const campaigns = [{ subject: 'Lanzamiento Single', sent_at: '2026-06-20' }];

  const exportCsv = () => {
    const rows = [['email', 'since'], ...subscribers.map((s) => [s.email, s.since])];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'subscribers.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout breadcrumb="Newsletter">
      <div className="space-y-6">
        <SectionHeading eyebrow="Panel" title="Newsletter" />
        <Card padding="lg" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-xl text-text-primary">Suscriptores</h3>
            <p className="text-sm text-text-muted">{subscribers.length} registrados</p>
          </div>
          <Button variant="secondary" onClick={exportCsv}>Export CSV</Button>
        </Card>
        <Card padding="lg">
          <h3 className="font-display text-xl text-text-primary">Enviar campaña</h3>
          <div className="mt-4 grid gap-4">
            <Input label="Asunto" placeholder="Gran noticia" />
            <textarea placeholder="Contenido HTML o Markdown" className="input-base h-32 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface" />
            <Button>Enviar</Button>
          </div>
        </Card>
        <Card padding="lg">
          <h3 className="font-display text-xl text-text-primary">Campañas</h3>
          {campaigns.length ? (
            <div className="mt-4 divide-y divide-border text-sm text-text-secondary">
              {campaigns.map((c, i) => (
                <div key={i} className="flex justify-between py-2">
                  <span>{c.subject}</span>
                  <span className="text-text-muted">{c.sent_at}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="Sin campañas" description="Aún no has enviado campañas." className="mt-4" />
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
