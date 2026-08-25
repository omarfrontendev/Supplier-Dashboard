import { PageHeader } from '@/layout/components/PageHeader';
import { useTranslation } from 'react-i18next';
import PermissionForm from './components/permission-form';
import { useParams } from 'react-router-dom';

export default function UpdatePermissions() {

    const { t } = useTranslation();
    const { id } = useParams();

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader title={t('roles.update')} subtitle={t("roles.updateDescription")} />
            <PermissionForm id={id} />
        </div>
    );
}
