import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getPermissionSchema } from "./permission.schema";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "@/components/ui/FormField";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PermissionFields } from "./permission.elemets";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useUpsertPermission } from "@/hooks/permissions/useUpsertPermission";
import { useSingleRole } from "@/hooks/permissions/useSingleRole";
import { useEffect } from "react";
import { useAvailablePermissions } from "@/hooks/permissions/usePermissions";
import { toast } from "sonner";

export default function PermissionForm({ id }: { id?: string }) {

    const navigate = useNavigate();
    const { t, i18n: { language } } = useTranslation();

    const { availablePermissions } = useAvailablePermissions();

    // create permission mutation
    const { mutate: savePermission, isPending } = useUpsertPermission({ id });

    const { role } = useSingleRole(id);

    const form = useForm({
        resolver: zodResolver(getPermissionSchema()),
        mode: "all"
    });

    useEffect(() => {
        if (role) {
            console.log(role)
            form.reset({
                nameEn: role.nameEn,
                nameAr: role.nameAr,
                // descriptionEn: role.descriptionEn,
                // descriptionAr: role.descriptionAr,
                permissionKeys: role.permissionKeys
            });
        }
    }, [role, form]);

    useEffect(() => {
        if(form?.formState?.errors?.permissionKeys?.message) {
            toast.error(form?.formState?.errors?.permissionKeys?.message)
        }
    }, [form?.formState?.errors?.permissionKeys?.message])

    const onSubmit = (data: any) => {
        savePermission(data, {
            onSuccess: () => {
                form.reset();
                navigate("/roles");
            },
        });
    };

    const permissionKeys = form.watch("permissionKeys") || [];

    return (
        <Form {...form}>
            <form
                id="user-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="block w-full space-y-6"
            >
                <div className="w-full grid grid-cols-12 gap-4">
                    {PermissionFields().map((field) => (
                        <FormField
                            key={field.name}
                            form={form}
                            {...field}
                        />
                    ))}
                    <div className="col-span-12 space-y-4">
                        {/* Title */}
                        <div>
                            <h2 className="text-lg font-semibold">{t("permissions.title")}</h2>
                            <p className="text-sm text-slate-500">
                                {t("permissions.description")}
                            </p>
                        </div>

                        {/* Permissions Container */}
                        <div className="flex items-center gap-2 mb-4">
                            <Checkbox
                                id="select-all-modules"
                                checked={availablePermissions.every((permission: any) => permission?.methods.every(({ key }) => permissionKeys.includes(key)))}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        const allPermissions = availablePermissions.flatMap(({ methods }) => methods.map(({ key }) => `${key}`));

                                        form.setValue("permissionKeys", allPermissions);
                                    } else {
                                        form.setValue("permissionKeys", []);
                                    }
                                }}
                            />

                            <Label htmlFor="select-all-modules" className="cursor-pointer font-medium">
                                {t("permissions.selectAllPermissions")}
                            </Label>
                        </div>
                        <div className="grid grid-cols-12 gap-4 border rounded-xl p-5 bg-slate-50">
                            {availablePermissions.map(({ module, methods }: any) => {
                                const modulePermissions = methods.map((item) => item?.key);

                                const isAllSelected = modulePermissions.every((p) =>
                                    permissionKeys.includes(p)
                                );
                                return (
                                    <div
                                        key={module}
                                        className="col-span-6 bg-white border rounded-lg p-4 shadow-sm"
                                    >
                                        <h3 className="font-semibold text-sm mb-3 capitalize border-b pb-2 flex items-center justify-between">
                                            {module}
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    id={`${module}-select-all`}
                                                    checked={isAllSelected}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            form.setValue("permissionKeys", [
                                                                ...new Set([...permissionKeys, ...modulePermissions]),
                                                            ]);
                                                        } else {
                                                            form.setValue(
                                                                "permissionKeys",
                                                                permissionKeys.filter(
                                                                    (p: string) => !modulePermissions.includes(p)
                                                                )
                                                            );
                                                        }
                                                    }}
                                                />
                                                <Label
                                                    htmlFor={`${module}-select-all`}
                                                    className="cursor-pointer text-xs text-slate-500"
                                                >
                                                    {t("permissions.all")}
                                                </Label>
                                            </div>
                                        </h3>

                                        <div className="grid grid-cols-12 items-center gap-4 flex-wrap">
                                            {methods?.map((item) => {
                                                const key = item.key;

                                                return (
                                                    <div key={key} className="col-span-6 flex items-center gap-2">
                                                        <Checkbox
                                                            id={key}
                                                            checked={permissionKeys.includes(key)}
                                                            onCheckedChange={(checked) => {
                                                                if (checked) {
                                                                    form.setValue("permissionKeys", [...permissionKeys, key]);
                                                                } else {
                                                                    form.setValue(
                                                                        "permissionKeys",
                                                                        permissionKeys.filter((p: string) => p !== key)
                                                                    );
                                                                }
                                                            }}
                                                        />

                                                        <Label
                                                            htmlFor={key}
                                                            className="cursor-pointer text-sm text-slate-600"
                                                        >
                                                            {`${item?.[`name${language === "en" ? "En" : "Ar"}`]}`}
                                                        </Label>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-12"
                >
                    {isPending ? t("buttons.saving") : t("buttons.save")}
                </Button>
            </form>
        </Form>
    );
}
