import { useFetch } from '@/hooks/useFetch';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/common/Card';

const KPI_CARD = (label, value, sub) => (
  <Card padding="md">
    <p className="text-sm text-text-secondary">{label}</p>
    <p className="mt-2 font-display text-3xl text-accent">{value}</p>
    {sub && <p className="mt-1 text-xs text-text-muted">{sub}</p>}
  </Card>
);

export default function AdminDashboard() {
  const { data: analytics } = useFetch('/admin/analytics/dashboard');

  return (
    <DashboardLayout breadcrumb="Inicio">
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
          {KPI_CARD('Reproducciones (hoy)', analytics?.todayPlays ?? '—', analytics?.todayPlays != null ? '+12% vs ayer' : 'sin datos')}
          {KPI_CARD('Nuevos fans (sem)', analytics?.weeklyFans ?? '—', analytics?.weeklyFans != null ? '+5% vs semana anterior' : 'sin datos')}
          {KPI_CARD('Ventas (mes)', analytics?.monthlyRevenue != null ? `$${analytics.monthlyRevenue.toLocaleString('es-CO')}` : '—', analytics?.monthlyRevenue != null ? 'COP' : 'sin datos')}
          {KPI_CARD('Pendientes', analytics?.pendingOrders ?? '—', 'pedidos por procesar')}
          {KPI_CARD('Suscripciones', analytics?.activeSubscriptions ?? '—', 'activas')}
          {KPI_CARD('Próximo evento', '12 días', 'Medellín · 2026-07-18')}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card padding="md" className="lg:col-span-2">
            <h3 className="font-display text-xl text-text-primary">Reproducciones últimos 30 días</h3>
            <div className="mt-4 flex h-48 items-end gap-1">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="flex-1 rounded-t bg-accent/60" style={{ height: `${25 + ((i * 37) % 65)}%` }} />
              ))}
            </div>
          </Card>
          <Card padding="md">
            <h3 className="font-display text-xl text-text-primary">Productos</h3>
            <div className="mt-4 flex h-48 items-center justify-center">
              <div className="h-32 w-32 rounded-full border-8 border-accent" />
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
