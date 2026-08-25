import { PageHeader } from '@/layout/components/PageHeader';
import UserForm from './components/user-form';
import { useTranslation } from 'react-i18next';

export default function CreateDashboardUser() {

    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader title={t('users.create')} subtitle={t("users.createDescription")}>
            </PageHeader>
            <UserForm />
        </div>
    );
}
