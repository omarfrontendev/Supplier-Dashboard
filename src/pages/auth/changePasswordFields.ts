export const changePasswordFields = () => {
  return [
    {
      name: 'newPassword',
      label: 'newPassword',
      placeholder: 'newPassword',
      colSpan: 'col-span-12',
      type: 'password',
      required: true,
    },
    {
      name: 'confirmNewPassword',
      label: 'confirmNewPassword',
      placeholder: 'confirmNewPassword',
      colSpan: 'col-span-12',
      type: 'password',
      required: true,
    },
  ];
};