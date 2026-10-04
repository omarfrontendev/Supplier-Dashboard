import { useLanguage } from "@/lib/i18n";

export const activateAccountFields = () => {

    const { c } = useLanguage();

    return [
        {
            name: 'newPassword',
            label: c.login.password,
            placeholder: c.login.passwordPh,
            colSpan: 'col-span-12',
            type: 'password',
            required: true,
        },
        {
          name: 'confirmNewPassword',
          label: c.activateAccount.confirmPassword,
          placeholder: c.activateAccount.confirmPasswordPh,
          colSpan: 'col-span-12',
          type: 'password',
          required: true,
        },
    ];
};