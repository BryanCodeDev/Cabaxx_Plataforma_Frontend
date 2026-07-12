import { useState } from 'react';
import { songService } from '@/services/songService';
import { useFetch } from '@/hooks/useFetch';
import { ARTIST_SLUG } from '@/constants';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/admin/DataTable';

const columns = [
  { key: 'cover_url', label: 'Cover', render: (row) => <img src={row.cover_url} alt="" className="h-10 w-10 rounded object-cover" /> },
  { key: 'title', label: 'Título' },
  { key: 'album_title', label: 'Álbum' },
  { key: 'play_count', label: 'Reproducciones', render: (r) => r.play_count?.toLocaleString('es-CO') },
  { key: 'likes_count', label: 'Me gusta', render: (r) => r.likes_count?.toLocaleString('es-CO') },
  { key: 'status', label: 'Estado' },
];

export default function SongsAdmin() {
  const { data, loading } = useFetch(`/artists/${ARTIST_SLUG}/songs`, { params: { limit: 50 } });
  const items = data?.songs?.rows || [];

  return (
    <DashboardLayout breadcrumb="Canciones">
      <DataTable columns={columns} data={items} loading={loading} searchable emptyMessage="Sin canciones" />
    </DashboardLayout>
  );
}
