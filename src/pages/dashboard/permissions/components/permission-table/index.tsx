import { Card } from "@/components/ui/card";
import TableSearch from "@/components/ui/table-search";
import { useTranslation } from "react-i18next";
import { usePermissionsTableLogic } from "./hooks/usePermissionsTableLogic";
import MainTable from "@/components/common/MainTable";

export default function PermissionsTable() {

    const { t } = useTranslation();

    const {
        loading,
        totalCount,
        table,
        errorMsg,
        onSearch,
        onClearSearch,
    } = usePermissionsTableLogic();

    return (
        <div className="grid gap-2">

            <MainTable
                errorMsg={errorMsg}
                loading={loading}
                totalCount={totalCount}
                table={table}
                TableFilters={
                    <Card className="p-2">
                        <div className="flex items-center gap-2">
                            <div className="relative w-100">
                                <TableSearch
                                    placeholder={t("roles.searchPlaceholder")}
                                    onSearch={onSearch}
                                    onClearSearch={onClearSearch} />
                            </div>
                        </div>
                    </Card>
                } 
                />
        </div>
    );
}
