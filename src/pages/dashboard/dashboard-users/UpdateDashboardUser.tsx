import { PageHeader } from '@/layout/components/PageHeader';
import { useParams } from 'react-router-dom';
import ShiftForm from './components/user-form';
import { useTranslation } from 'react-i18next';

export default function UpdateDashboardUser() {

    const { id } = useParams();
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader title={t('users.update')} subtitle={t("users.updateDescription")}>
                {/* <PageHeader title='Update User' subtitle='Update an existing user with first name, last name, role, email, password and assign to client'> */}
            </PageHeader>
            <ShiftForm id={id} />
        </div>
    );
}
