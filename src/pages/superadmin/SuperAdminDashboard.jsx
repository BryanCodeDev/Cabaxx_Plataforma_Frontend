import { SectionHeading, Badge, EmptyState } from '@/components/common'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { artistService } from '@/services/modules';
import { ROUTES, FOCUS } from '@/constants';
import { artistPhotos } from '@/assets';

import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';
import Table from '@/components/common/Table';
const KpiCard = ({ label, value }) => (
  <Card padding="md">
    <p className="text-sm text-text-secondary">{label}</p>
    <p className="mt-2 font-mono text-3xl text-gold">{value}</p>
  </Card>
);

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    artistService
      .getArtists({ params: { limit: 1 } })
      .then((res) => {
        if (!active) return;
        const payload = res?.data ?? res ?? {};
        const body = payload?.artists ?? {};
        setArtists(body?.items ?? body ?? []);
        setTotal(body?.total ?? null);
      })
      .catch(() => {
        if (!active) return;
        setArtists([]);
        setTotal(null);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const columns = [
    {
      key: 'artist',
      label: 'Artista',
      render: (row) => {
        const idx = artists.indexOf(row);
        const photo = artistPhotos[(idx < 0 ? 0 : idx) % artistPhotos.length];
        return (
          <div className="flex items-center gap-3">
            <img
              src={row.avatar_url || photo}
              alt={row.stage_name}
              className="h-9 w-9 rounded-full object-cover border border-border"
            />
            <div>
              <p className="font-medium text-text-primary">{row.stage_name || '—'}</p>
              <p className="font-mono text-xs text-text-muted">{row.slug || '—'}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'plan',
      label: 'Plan',
      render: (row) => <span className="text-text-secondary">{row.plan || '—'}</span>,
    },
    {
      key: 'fans',
      label: 'Fans',
      render: (row) => (
        <span className="font-mono text-text-primary">
          {row.fans_count != null ? row.fans_count.toLocaleString('es-CO') : '—'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (row) => {
        const active = row.status === 'active' || row.status === 'activo';
        return (
          <Badge variant={active ? 'success' : 'default'} size="sm">
            {active ? 'Activo' : row.status || 'Inactivo'}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <a
            href={`/${row.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm font-medium text-text-primary transition-all hover:border-accent/50 ${FOCUS}`}
          >
            Ver
          </a>
          <Button
            size="sm"
            variant={row.status === 'active' || row.status === 'activo' ? 'danger' : 'outline'}
            className={FOCUS}
            loading={togglingId === row.id}
            onClick={() => {
              setTogglingId(row.id);
              const active = row.status === 'active' || row.status === 'activo';
              toast(active ? `Artista ${row.stage_name} desactivado (demo)` : `Artista ${row.stage_name} activado (demo)`);
              setTogglingId(null);
            }}
          >
            {row.status === 'active' || row.status === 'activo' ? 'Desactivar' : 'Activar'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading
        eyebrow="Panel de Control"
        title="Panel de Artistas"
        action={
          <Button
            className={FOCUS}
            onClick={() => navigate(ROUTES.SUPERADMIN_ONBOARDING)}
          >
            Nuevo Artista
          </Button>
        }
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Total artistas" value={total != null ? total.toLocaleString('es-CO') : '—'} />
        <KpiCard label="Total fans" value="—" />
        <KpiCard label="Revenue" value="—" />
      </div>

      <Card padding="lg" className="mt-8">
        <h3 className="mb-4 font-display text-xl text-text-primary">Artistas</h3>
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : artists.length ? (
          <Table columns={columns} data={artists} />
        ) : (
          <EmptyState
            title="No hay artistas todavía"
            description="Crea el primer artista desde el onboarding para empezar a gestionar su contenido."
            action={
              <Button className={FOCUS} onClick={() => navigate(ROUTES.SUPERADMIN_ONBOARDING)}>
                Nuevo Artista
              </Button>
            }
          />
        )}
      </Card>
    </main>
  );
}
