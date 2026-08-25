import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUserSchema } from "./user.schema";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "@/components/ui/FormField";
import { userFields } from "./user.elemets";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSingleUser } from "@/hooks/users/useSingleUser";
import { useUpsertUser } from "@/hooks/users/useUpsertUser";
import { dashboardUserRoles } from "@/constants/userRoles";
import { useTranslation } from "react-i18next";
// import { useSelector } from "react-redux";
import { useAllPermissions } from "@/hooks/permissions/usePermissions";

export default function UserForm({ id }: { id?: string }) {

    const navigate = useNavigate();
    const { t } = useTranslation();

    // get user data if id is provided
    const { user } = useSingleUser(id);

    // create area mutation
    const { mutate: saveUser, isPending } = useUpsertUser({ id });
    const { permissionsProfiles, isLoading } = useAllPermissions();
    const profilesOptions = permissionsProfiles.map((item: any) => ({ label: item.nameEn, value: item.id }));

    const form = useForm({
        resolver: zodResolver(getUserSchema()),
        mode: "all"
    });

    useEffect(() => {
        if (user) {
            form.reset({
                ...form.watch(),
                email: user.email,
                username: user.username,
                phoneNumber: user.phoneNumber,
                role: user.role,
                permissionProfileIds: user.permissionProfileIds[0],
            });
        }
    }, [user, form]);

    const onSubmit = (data: any) => {
        saveUser(data, {
            onSuccess: () => {
                form.reset();
                navigate("/dashboard-users");
            },
        });
    };
    
    return (
        <Form {...form}>
            <form
                id="user-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="block w-full space-y-6"
            >
                <div className="flex w-full gap-4">
                    <div className="w-full grid grid-cols-12 gap-4">
                        {userFields(dashboardUserRoles, profilesOptions, isLoading).map((field: any) => (
                            <FormField
                                key={field.name}
                                form={form}
                                {...field}
                            />
                        ))}
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
