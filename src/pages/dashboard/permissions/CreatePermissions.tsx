import { PageHeader } from '@/layout/components/PageHeader';
import { useTranslation } from 'react-i18next';
import PermissionForm from './components/permission-form';

export default function CreatePermissions() {

    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader title={t('roles.create')} subtitle={t("roles.createDescription")} />
            <PermissionForm />
        </div>
    );
}
