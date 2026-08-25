import type { UserRole } from "@/constants/userRoles";

export interface User {
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
};

export interface UsersTableOptions {
  pageIndex: number;
  pageSize: number;
  search: string;
  isActive: string | null;
  role?: string | null;
  // roles: string[] | null;
  isFirstActivationPending: boolean
  vendorId?: number | null;
}

export interface GetUsersPayload {
  page: number;
  limit: number;
  search: string;
  isActive: boolean;
  isFirstActivationPending: boolean;
  // roles: string[] | null;
  role?: string | null;
  vendorId?: number | null;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  clientId: number;
}

