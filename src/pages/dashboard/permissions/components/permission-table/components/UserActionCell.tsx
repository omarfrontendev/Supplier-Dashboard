import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PermissionsDialog from "./PermissionsDialog";
import { DeleteDialog } from "@/components/common/DeleteDialog";
import { useDeletePermission } from "@/hooks/permissions/useDeletePermission";

export const UserActionsCell = ({ row, setRefreshData }: any) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [openPermissions, setOpenPermissions] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const { mutateAsync, isPending } = useDeletePermission();

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="size-7" variant="ghost">
                        <EllipsisVertical />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={e => {
                            e.stopPropagation();
                            setOpenPermissions(true);
                        }}
                    >
                        {t("buttons.permissions")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => navigate(`/roles/${row.original.id}/edit`)}
                    >
                        {t("buttons.edit")}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        variant="destructive"
                        onClick={(e) => {
                            e.stopPropagation();
                            setDeleteOpen(true);
                        }}
                    >
                        {t("buttons.delete")}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <PermissionsDialog
                open={openPermissions}
                setOpen={(open: boolean) => { if (!open) setOpenPermissions(false); }}
                permissions={row.original?.permissionKeys ?? []}
            />


            <DeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title={t("roles.deleteTitle")}
                description={`${t("dialog.deleteDescription")} "${row.original?.nameEn}"?`}
                loading={isPending}
                onConfirm={async () => {
                    await mutateAsync(row.original.id);
                    setDeleteOpen(false);
                    setRefreshData();
                }}
            />
        </>
    );
};
