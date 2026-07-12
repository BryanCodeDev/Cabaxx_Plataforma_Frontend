import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import SectionHeading from '@/components/common/SectionHeading';

export default function AdminSettings() {
  return (
    <DashboardLayout breadcrumb="Configuración">
      <div className="space-y-6">
        <SectionHeading eyebrow="Panel" title="Configuración" />
        <Card padding="lg">
          <h3 className="font-display text-xl text-text-primary">Configuración del artista</h3>
          <p className="mt-2 text-sm text-text-muted">Próximamente: nombre artístico, imagen, redes sociales y preferencias.</p>
          <div className="mt-4 flex gap-3">
            <Button variant="secondary">Guardar cambios</Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}