export const userFields = (permissionsProfiles: any[], isLoading: boolean) => {

    return [
        {
            name: "username",
            label: "Username.label",
            placeholder: "Username.placeholder",
            colSpan: "col-span-6",
            type: "text",
            required: true,
        },
        {
            name: "email",
            label: "email.label",
            placeholder: "email.placeholder",
            colSpan: "col-span-6",
            type: "email",
            required: true,
        },
        {
            name: "phoneNumber",
            label: "phone.label",
            placeholder: "phone.placeholder",
            colSpan: "col-span-6",
            type: "number",
        },
        // {
        //     name: "role",
        //     label: "role.label",
        //     placeholder: "role.placeholder",
        //     colSpan: "col-span-6",
        //     type: "select",
        //     required: false,
        //     list: roles
        // },
        {
            name: "permissionProfileIds",
            label: "profilePermission.label",
            placeholder: "role.profilePermission",
            colSpan: "col-span-6",
            type: "select",
            required: true,
            list: permissionsProfiles,
            isLoading
        },
    ];
}
