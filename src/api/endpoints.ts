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
  getHotelRooms: (id: string) => `/linked-hotels/${id}/rooms?page=1&limit=100`,
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
  deleteProfile: (id: string) => `/profiles/${id}`,
  getProfileById: (id: string) => `/permissions/profiles/${id}`,
};

const suppliers = {
  getProfile: "/profile",
};

const  amenities = {
  options: "/amenities/options",
}

const notifications = {
  getNotification: "/notifications",
  unreadCount: "/notifications/unread-count" 
}

export const endpoints = {
  auth,
  team,
  profiles,
  hotels,
  requests,
  uploads,
  suppliers,
  amenities,
  notifications
};
