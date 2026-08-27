import MainTable from "@/components/common/MainTable";
import { Card } from "@/components/ui/card";
import { useUsersTableLogic } from "@/pages/dashboard/dashboard-users/components/users-table/hooks/useUsersTableLogic";
import Filter from "../../../../../components/ui/Filter";
import TableSearch from "@/components/ui/table-search";
import ToggleStatusDialog from "./components/ToggleStatusDialog";
import { useTranslation } from "react-i18next";
import { dashboardUserRoles } from "@/constants/userRoles";

export default function UsersTable() {

    const { t } = useTranslation();

    const {
        loading,
        totalCount,
        table,
        statusFilter,
        statusList,
        statusDialog,
        roleFilter,
        errorMsg,
        onRoleFilter,
        setStatusDialog,
        onSearch,
        onClearSearch,
        onStatusFilter,
    } = useUsersTableLogic();

    return (
        <div className="grid gap-2">
            <MainTable
                errorMsg={errorMsg}
                TableFilters={
                    <Card className="p-2">
                        <div className="flex items-center gap-2">
                            <div className="relative w-100">
                                <TableSearch
                                    placeholder={t("users.searchPlaceholder")}
                                    onSearch={onSearch}
                                    onClearSearch={onClearSearch} />
                            </div>
                            <div className="w-40">
                                <Filter
                                    placeholder={t("filters.status")}
                                    value={statusFilter}
                                    options={statusList}
                                    onChange={onStatusFilter}
                                />
                            </div>
                            <div className="w-40">
                                <Filter
                                    placeholder={t("fields.role.label")}
                                    value={roleFilter}
                                    options={dashboardUserRoles}
                                    onChange={onRoleFilter}
                                />
                            </div>
                        </div>
                    </Card>
                }
                table={table}
                loading={loading}
                totalCount={totalCount}
            />

            <ToggleStatusDialog
                data={statusDialog}
                setData={(data: boolean) => { if (!data) setStatusDialog(false); }}
            />
        </div>
    );
}
