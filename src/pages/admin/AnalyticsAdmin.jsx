import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/common/Card';
import SectionHeading from '@/components/common/SectionHeading';

export default function AnalyticsAdmin() {
  return (
    <DashboardLayout breadcrumb="Analíticas">
      <div className="space-y-6">
        <SectionHeading eyebrow="Panel" title="Analíticas" />
        <Card padding="lg">
          <h3 className="font-display text-2xl text-text-primary">Reproducciones</h3>
          <div className="mt-4 flex h-48 items-end gap-1">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="flex-1 rounded-t bg-accent/60" style={{ height: `${20 + Math.random() * 80}%` }} />
            ))}
          </div>
        </Card>
        <Card padding="lg">
          <h3 className="font-display text-2xl text-text-primary">Ventas</h3>
          <div className="mt-4 flex h-48 items-end gap-1">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="flex-1 rounded-t bg-gold/60" style={{ height: `${20 + Math.random() * 80}%` }} />
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
