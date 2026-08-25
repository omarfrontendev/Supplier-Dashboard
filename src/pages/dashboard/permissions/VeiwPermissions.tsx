import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/layout/components/PageHeader';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PermissionsTable from './components/permission-table';

export default function ViewPermissions() {
  const { total, loading } = useSelector((state: any) => state.roles);

  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={t("roles.title")}
        subtitle={t("roles.activeRoles", { count: total })}
        loading={loading}
      >
        <Button onClick={() => navigate('/roles/create')} className="gap-2 ">
          <Plus className="w-4 h-4" />
          {t("roles.create")}
        </Button>
      </PageHeader>

      {/* Table */}
      <PermissionsTable />
    </div>
  );
}
