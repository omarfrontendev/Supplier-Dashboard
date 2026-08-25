import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAvailablePermissions } from "@/hooks/permissions/usePermissions";
import { useTranslation } from "react-i18next";

type PermissionDialogProps = {
    open: boolean,
    setOpen: (data: boolean) => void,
    permissions: any[]
};

export default function PermissionsDialog({
    open, setOpen, permissions
}: PermissionDialogProps) {

    const { t, i18n: { language } } = useTranslation();
    const { availablePermissions } = useAvailablePermissions();

    return (
        <Dialog open={!!open} onOpenChange={(val) => setOpen(val)}>
            <DialogContent className="max-w-lg mx-auto p-6 rounded-lg">
                <DialogHeader>
                    <h2 className="text-lg font-semibold">
                        {t(`dialog.permissions`)}
                    </h2>
                </DialogHeader>

                <div className="py-4 text-sm text-gray-700 grid gap-4 h-[400px] overflow-y-auto">
                    {availablePermissions.map(({ module, methods }: any) => <div
                        key={module}
                        className="col-span-6 bg-white border rounded-lg p-4 shadow-sm"
                    >
                        <h3 className="font-semibold text-sm mb-3 capitalize border-b pb-2 flex items-center justify-between">
                            {module}
                        </h3>
                        <div className="grid grid-cols-12 items-center gap-4 flex-wrap">
                            {methods.map((item: any) => {
                                const key = item?.key;

                                return (
                                    <div key={key} className="col-span-6 flex items-center gap-2">
                                        <Checkbox
                                            id={key}
                                            aria-readonly
                                            checked={permissions.includes(key)}
                                        />

                                        <Label
                                            htmlFor={key}
                                            className="text-sm text-slate-600"
                                        >
                                            {`${item?.[`name${language === "en" ? "En" : "Ar"}`]}`}
                                        </Label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>)}
                </div>
            </DialogContent>
        </Dialog >
    );
}
