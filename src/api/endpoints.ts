
const users = {
    getAllUsers: "/users?page=1&limit=100",
    getUsers: "/users",
    createUsers: "/users",
    getgetUserById: (id: string) => `/users/${id}`,
    deactivateUser: (id: string) => `/users/${id}/deactivate`,
    activateUser: (id: string) => `/users/${id}/activate`,
    updateUser: (id: string) => `/users/${id}`,
    deleteUser: (id: string) => `/users/${id}`,
};

const auth = {
    login: "auth/login",
    resetPassword: "auth/reset-password",
    activate: "auth/activate",
    requestOTP: "auth/forgot-password",
    verifyOTP: "auth/verify-reset-code",
    logout: "auth/logout"
};

const permissions = {
    getPermissions: "/permissions/profiles",
    availablePermissions: "/permissions/catalog",
    createPermission: "/permissions/profiles",
    updatePermission: (id: string) => `/permissions/profiles/${id}`,
    deletePermission: (id: string) => `/permissions/profiles/${id}`,
    getPermissionById: (id: string) => `/permissions/profiles/${id}`,
}

export const endpoints = {
    auth,
    users,
    permissions,
};