import { useLanguage } from "@/lib/i18n";

// export const memberFields = (permissionsProfiles: any[], isLoading: boolean) => {
export const memberFields = () => {
  const { c } = useLanguage();

  return [
    {
      name: "username",
      label: c.common.usernameLabel,
      placeholder: c.common.usernamePlaceholder,
      colSpan: "col-span-6",
      type: "text",
      required: true,
    },
    {
      name: "email",
      label: c.common.emailLabel,
      placeholder: c.common.emailPlaceholder,
      colSpan: "col-span-6",
      type: "email",
      required: true,
    },
    {
      name: "phoneNumber",
      label: c.common.phoneNumberLabel,
      placeholder: c.common.phoneNumberPlaceholder,
      colSpan: "col-span-6",
      type: "number",
    },
    // {
    //   name: "permissionProfileIds",
    //   label: "profilePermission.label",
    //   placeholder: "role.profilePermission",
    //   colSpan: "col-span-6",
    //   type: "select",
    //   required: true,
    //   list: permissionsProfiles,
    //   isLoading,
    // },
  ];
};
