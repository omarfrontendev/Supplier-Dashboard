const team = {
  getMetrics: "/hotel-requests/metadata",
  getAllUsers: "/users?page=1&limit=100",
  getMembers: "/users",
  createMember: "/users",
  createHotelLinkingRequest: `/hotel-linking-requests`,
  getMemberById: (id: string) => `/users/${id}`,
  deactivateMember: (id: string) => `/users/${id}/deactivate`,
  activateMember: (id: string) => `/users/${id}/activate`,
  updateMember: (id: string) => `/users/${id}`,
  deleteMember: (id: string) => `/users/${id}`,
  resendInvitationEmail: (id: string) => `/users/${id}/resend-invitation`,
};

const uploads = {
  create: "/uploads",
};

const auth = {
  login: "auth/login",
  resetPassword: "auth/reset-password",
  activate: "auth/activate",
  requestOTP: "auth/forgot-password",
  verifyOTP: "auth/verify-reset-code",
  logout: "auth/logout",
};

const hotels = {
  getHotels: "/linked-hotels",
  createHotelRequest: "/hotel-requests",
  getHotelById: (id: string) => `/linked-hotels/${id}`,
  getHotelOptionById: (id: string) => `/hotels/linking-options/${id}`,
  getHotelOptions: "/hotels/linking-options",
  // getHotelRooms: (id: string) => `/linked-hotels/${id}/rooms?page=1&limit=100`,
  getHotelRooms: (id: string) => `/hotels/linking-options/${id}/rooms`,
  getHotelRoomById: (hotelId: number, roomId: number) =>
    `/hotels/linking-options/${hotelId}/rooms/${roomId}`,
  getLinkedHotelRooms: (id: number) => `/linked-hotels/${id}/rooms`,
};

const requests = {
  hotelRequests: "/hotel-requests",
  hotelLinkingRequests: "/hotel-linking-requests",
  roomRequests: "/room-requests",
  getHotelById: (id: string) => `/linked-hotels/${id}`,
  getHotelOptions: "/hotels/linking-options",
  createHotelRequest: "/hotel-requests",
  createRoomRequest: "/room-requests",
};

const profiles = {
  getProfiles: "/permissions/profiles",
  availableProfiles: "/permissions/catalog",
  createProfile: "/permissions/profiles",
  updateProfile: (id: number | false) => `/permissions/profiles/${id}`,
  deleteProfile: (id: string) => `/permissions/profiles/${id}`,
  getProfileById: (id: string) => `/permissions/profiles/${id}`,
};

const suppliers = {
  getProfile: "/profile",
};

const amenities = {
  options: "/amenities/options",
};

const notifications = {
  getNotification: "/notifications",
  unreadCount: "/notifications/unread-count",
  readNotification: (id: number | string) => `/notifications/${id}/read`,
};

const supplierHotelContracts = {
  list: "/hotel-contracts",
  metadata: "/hotel-contracts/metadata",
  create: "/hotel-contracts",
  hotels: "/hotel-contracts/hotels",
  rooms: (hotelId: number) => `/hotel-contracts/hotels/${hotelId}/rooms`,
  byId: (id: number) => `/hotel-contracts/${id}`,
  finalizationReview: (id: number) => `/hotel-contracts/${id}/finalization-review`,
  finalize: (id: number) => `/hotel-contracts/${id}/finalize`,
  pause: (id: number) => `/hotel-contracts/${id}/pause`,
  resume: (id: number) => `/hotel-contracts/${id}/resume`,
  terminate: (id: number) => `/hotel-contracts/${id}/terminate`,
  copy: (id: number) => `/hotel-contracts/${id}/copy`,
  activity: (id: number) => `/hotel-contracts/${id}/activity`,
  stopSalePreview: (id: number) => `/hotel-contracts/${id}/stop-sale/preview`,
  stopSale: (id: number) => `/hotel-contracts/${id}/stop-sale`,
};

const ratesAndAvailability = {
  hotels: "/ratesandavailability/hotels",
  contracts: "/ratesandavailability/contracts",
  hotelContracts: (hotelId: number) => `/ratesandavailability/contracts/${hotelId}`,
  contractDetail: (contractId: number) => `/ratesandavailability/${contractId}`,
  metadata: "/ratesandavailability/metadata",
  rateTargets: (contractId: number) => `/ratesandavailability/contracts/${contractId}/rate-targets`,
  ratesContext: (contractId: number) =>
    `/ratesandavailability/contracts/${contractId}/rates/context`,
  supplementsContext: (contractId: number) =>
    `/ratesandavailability/contracts/${contractId}/supplements/context`,
  rateOverridesPreview: (contractId: number) =>
    `/ratesandavailability/contracts/${contractId}/rate-overrides/preview`,
  rateOverrides: (contractId: number) =>
    `/ratesandavailability/contracts/${contractId}/rate-overrides`,
  restrictionTargets: (contractId: number) =>
    `/ratesandavailability/contracts/${contractId}/restriction-targets`,
  restrictionsContext: (contractId: number) =>
    `/ratesandavailability/contracts/${contractId}/restrictions/context`,
  restrictionOverridesPreview: (contractId: number) =>
    `/ratesandavailability/contracts/${contractId}/restriction-overrides/preview`,
  restrictionOverrides: (contractId: number) =>
    `/ratesandavailability/contracts/${contractId}/restriction-overrides`,
  sellControlTargets: (contractId: number) =>
    `/ratesandavailability/contracts/${contractId}/sell-control-targets`,
  sellControlsContext: (contractId: number) =>
    `/ratesandavailability/contracts/${contractId}/sell-controls/context`,
  sellControlsPreview: (contractId: number) =>
    `/ratesandavailability/contracts/${contractId}/sell-controls/preview`,
  sellControls: (contractId: number) =>
    `/ratesandavailability/contracts/${contractId}/sell-controls`,
  releaseTargets: (contractId: number) =>
    `/ratesandavailability/contracts/${contractId}/release-targets`,
  releaseContext: (contractId: number) =>
    `/ratesandavailability/contracts/${contractId}/release/context`,
  releaseOverridesPreview: (contractId: number) =>
    `/ratesandavailability/contracts/${contractId}/release-overrides/preview`,
  releaseOverrides: (contractId: number) =>
    `/ratesandavailability/contracts/${contractId}/release-overrides`,
};

const ratesAvailability = {
  metadata: "/ratesandavailability/metadata",
  hotels: "/ratesandavailability/hotels",
  contracts: (hotelId: string) => `/ratesandavailability/contracts/${hotelId}`,
};

export const endpoints = {
  auth,
  team,
  profiles,
  hotels,
  requests,
  uploads,
  suppliers,
  amenities,
  notifications,
  supplierHotelContracts,
  ratesAndAvailability,
  ratesAvailability,
};
