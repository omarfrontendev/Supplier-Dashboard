
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
    checkEmailState: "auth/check-email-state",
    changePassword: "auth/reset-password",
    requestOTp: "auth/forgot-password",
    verfiyOTp: "auth/verify-reset-code",
    logout: "auth/logout"
};

const createCrudEndpoints = (base: string) => ({
    list: base,
    create: base,
    getById: (id: string) => `${base}/${id}`,
    update: (id: string) => `${base}/${id}`,
    delete: (id: string) => `${base}/${id}`,
});

const areas = createCrudEndpoints("/clients/areas");

const regions = {
    getRegions: "/clients/regions",
    createRegion: "/clients/regions",
    getRegionById: (id: string) => `/clients/regions/${id}`,
    updateRegion: (id: string) => `/clients/regions/${id}`,
    deleteRegion: (id: string) => `/clients/regions/${id}`,
}

const subRegions = {
    getSubRegions: "/clients/sub-regions",
    createSubRegion: "/clients/sub-regions",
    getSubRegionById: (id: string) => `/clients/sub-regions/${id}`,
    updateSubRegion: (id: string) => `/clients/sub-regions/${id}`,
    deleteSubRegion: (id: string) => `/clients/sub-regions/${id}`,
}

const malls = {
    getMalls: "/clients/malls",
    createMall: "/clients/malls",
    getMallById: (id: string) => `/clients/malls/${id}`,
    updateMall: (id: string) => `/clients/malls/${id}`,
    deleteMall: (id: string) => `/clients/malls/${id}`,
}

const shifts = {
    getShifts: "/clients/shifts",
    createShift: "/clients/shifts/bulk",
    getShiftById: (id: string) => `/clients/shifts/${id}`,
    updateShift: (id: string) => `/clients/shifts/${id}`,
    deleteShift: (id: string) => `/clients/shifts/${id}`,
}

const booths = {
    getBooths: "/clients/booths",
    createBooth: "/clients/booths",
    getBoothById: (id: string) => `/clients/booths/${id}`,
    updateBooth: (id: string) => `/clients/booths/${id}`,
    deleteBooth: (id: string) => `/clients/booths/${id}`,
}

const clients = {
    getClients: "/clients",
    createClient: "/clients",
    getClientById: (id: string) => `/clients/${id}`,
    updateClient: (id: string) => `/clients/${id}`,
    deleteClient: (id: string) => `/clients/${id}`,
}

const vendors = {
    getVendors: "/clients/vendors",
    createVendor: "/vendors/create",
    getVendorById: (id: string) => `/clients/vendors/${id}`,
    updateVendor: (id: string) => `/vendors/${id}`,
    toggleStatus: (id: string) => `/vendors/update-status/${id}`
}

const permissions = {
    getPermissions: "/permissions/profiles",
    availablePermissions: "/permissions/catalog",
    createPermission: "/permissions/profiles",
    updatePermission: (id: string) => `/permissions/profiles/${id}`,
    deletePermission: (id: string) => `/permissions/profiles/${id}`,
    getPermissionById: (id: string) => `/permissions/profiles/${id}`,
}

const childVendors = {
    getVendors: "/clients/vendors",
    getAreas: "/clients/vendors/areas",
    getRegions: "/clients/vendors/regions",
    getSubRegions: "/clients/vendors/sub-regions",
    getMalls: "/clients/vendors/malls",
    getBooths: "/clients/vendors/booths",
    getShifts: "/clients/vendors/shifts",
    getUsers: "/clients/vendors/users",
}

export const endpoints = {
    auth,
    users,
    areas,
    regions,
    subRegions,
    malls,
    shifts,
    booths,
    clients,
    vendors,
    permissions,
    childVendors
};