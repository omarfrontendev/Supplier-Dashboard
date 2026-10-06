export interface TeamMember {
  permissionProfileIds?: any;
  id: number;
  username: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  clientId: number;
  nationalId: string | null;
  phoneNumber: string | null;
  dealerId?: string | null;
  employeeCode?: string | null;
  boothId?: number | null;
  shifts?: any[] | null;
  areaId?: number | null;
  regionId?: number | null;
  subRegionId?: number | null;
}

export interface TeamMemberPayload {
  username: string;
  email: string;
  phoneNumber: string;
  role: string;
  permissionProfileIds: number[];
}

export interface TeamState {
  team: TeamMember[];
  loading: boolean;
  error: string | null;
  total: number;
}

export interface GetUsersPayload {
  page: number;
  limit: number;
  search: string;
  isActive: boolean;
  isFirstActivationPending?: boolean;
  role?: string | null;
}

// ========================= //

export type HotelRequestKey = "waiting_for_hoteliana" | "needs_you" | "approved" | "rejected";

export type UserStatusKey = "active" | "inactive" | "pending";

export interface MetadataItem<T extends string = string> {
  key: T;
  value: number;
}

export interface MetricsData {
  hotelRequests: MetadataItem<HotelRequestKey>[];
  superAdmins: MetadataItem<UserStatusKey>[];
  admins: MetadataItem<UserStatusKey>[];
}

export interface MetricsResponse {
  status: "success";
  message: string;
  data: MetricsData;
}
