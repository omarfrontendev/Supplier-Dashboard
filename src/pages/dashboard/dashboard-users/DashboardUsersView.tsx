import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/layout/components/PageHeader';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UsersTable from './components/users-table';
import { useTranslation } from 'react-i18next';

export default function DashboardUsersView() {
  const { total, loading } = useSelector((state: any) => state.users);
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={t("users.title")}
        subtitle={t("users.activeUsers", { count: total })}
        loading={loading}
      >
        <Button onClick={() => navigate('/dashboard-users/create')} className="gap-2 ">
          <Plus className="w-4 h-4" />
          {t("users.create")}
        </Button>
      </PageHeader>

      {/* Table */}
      <UsersTable />
    </div>
  );
}
