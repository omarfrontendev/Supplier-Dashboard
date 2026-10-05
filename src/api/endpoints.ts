
const team = {
    getAllUsers: "/users?page=1&limit=100",
    getMembers: "/users",
    createMember: "/users",
    getMemberById: (id: string) => `/users/${id}`,
    deactivateMember: (id: string) => `/users/${id}/deactivate`,
    activateMember: (id: string) => `/users/${id}/activate`,
    updateMember: (id: string) => `/users/${id}`,
    deleteMember: (id: string) => `/users/${id}`,
};

const auth = {
    login: "auth/login",
    resetPassword: "auth/reset-password",
    activate: "auth/activate",
    requestOTP: "auth/forgot-password",
    verifyOTP: "auth/verify-reset-code",
    logout: "auth/logout"
};

const profiles = {
    getProfiles: "/permissions/profiles",
    availableProfiles: "/permissions/catalog",
    createProfile: "/permissions/profiles",
    updateProfile: (id: string) => `/profiles/${id}`,
    deleteProfile: (id: string) => `/profiles/${id}`,
    getProfileById: (id: string) => `/permissions/profiles/${id}`,
}

export const endpoints = {
    auth,
    team,
    profiles,
};