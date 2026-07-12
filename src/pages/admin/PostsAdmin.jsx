import { ARTIST_SLUG } from '@/constants';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/admin/DataTable';
import Card from '@/components/common/Card';
import SectionHeading from '@/components/common/SectionHeading';

const columns = [
  { key: 'title', label: 'Publicación' },
  { key: 'type', label: 'Tipo' },
  { key: 'category', label: 'Categoría' },
  { key: 'status', label: 'Estado' },
  { key: 'published_at', label: 'Publicado' },
];

export default function PostsAdmin() {
  return (
    <DashboardLayout breadcrumb="Noticias / Blog">
      <div className="space-y-6">
        <SectionHeading eyebrow="Panel" title="Noticias / Blog" />
        <Card padding="lg">
          <div className="overflow-x-auto">
            <DataTable columns={columns} data={[]} searchable emptyMessage="Sin publicaciones" onAdd={() => {}} />
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
