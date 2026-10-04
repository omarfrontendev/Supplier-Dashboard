import { createFileRoute, redirect } from "@tanstack/react-router";
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { ChangePasswordFormValues, changePasswordSchema } from "@/components/auth/activate-account-form/schema";
import { useActiveAccount } from "@/components/auth/activate-account-form/useActiveAccount";
import { activateAccountFields } from "@/components/auth/activate-account-form/fields";
import { getApiErrorMessage } from "@/lib/api-error";
import { AuthCard, AuthLayout, ErrorBanner } from "@/components/auth/auth-layout";

export const Route = createFileRoute("/activate-account-page")({
    validateSearch: (search) => ({
        token: typeof search["token"] === "string" ? search["token"] : "",
    }),

    beforeLoad: ({ search }) => {
        if (!search.token) {
            throw redirect({
                to: "/login",
            });
        }
    },

    head: () => ({
        meta: [
            {
                title: "Activate Account · Hoteliana Supplier Portal",
            },
            {
                name: "description",
                content:
                    "Activate your Hoteliana supplier portal account by setting a password.",
            },
            {
                property: "og:title",
                content: "Activate Account · Hoteliana Supplier Portal",
            },
            {
                property: "og:description",
                content:
                    "Set your password to activate your Hoteliana supplier portal account.",
            },
            {
                property: "og:type",
                content: "website",
            },
            {
                name: "twitter:card",
                content: "summary",
            },
        ],
    }),

    component: ActivateAccountPage,
});

function ActivateAccountPage() {
    const { c } = useLanguage();
    const { token } = Route.useSearch();

    const { mutate: activateAccount, isPending, error } = useActiveAccount();

    const form = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            newPassword: '',
            confirmNewPassword: '',
        },
        mode: 'all',
    });

    const onSubmit = (values: ChangePasswordFormValues) => {
        if (!token) return;

        activateAccount({
            token,
            password: values.newPassword,
            confirmPassword: values.confirmNewPassword,
        });
    };

    const errorMessage = error
        ? getApiErrorMessage(error)
        : undefined;

    return (
        <AuthLayout brand="recovery">

            <AuthCard
                overline={c.activateAccount.overline}
                title={c.activateAccount.title}
                subtitle={c.activateAccount.subtitle}
            // footer={backLink}
            >

                {errorMessage && (
                    <ErrorBanner
                        title={c.common.somethingWentWrong}
                        body={errorMessage}
                    />
                )}

                <form
                    className="grid gap-5"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    {activateAccountFields().map(({ name, label, placeholder, type }) => (
                        <Input
                            label={label}
                            placeholder={placeholder}
                            type={type}
                            autoComplete="new-password"
                            error={form.formState.errors?.[name as keyof ChangePasswordFormValues]?.message ?? ""}
                            {...form.register(name as keyof ChangePasswordFormValues)}
                        />
                    ))}

                    <div>
                        <Button
                            type="submit"
                            disabled={!token || isPending}
                            loading={isPending}
                        >
                            {c.activateAccount.submit}
                        </Button>
                    </div>
                </form>
            </AuthCard>
        </AuthLayout>
    );
}