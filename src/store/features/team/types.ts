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
};

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