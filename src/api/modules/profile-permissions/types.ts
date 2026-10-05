export interface profilePermissionPayload {
  nameEn: string;
  enameAr: string;
  permissionKeys: string[];
}

export type PermissionCatalogItem = {
  key: string;
  nameEn: string;
  nameAr: string;
  moduleNameEn: string;
  moduleNameAr: string;
  endpointRoute: string;
  httpMethod: string;
};

export type PermissionsCatalogResponse = {
  status: string;
  message: string;
  data: PermissionCatalogItem[];
};

export type PermissionProfile = {
  id: number;
  supplierId: number;
  nameEn: string;
  nameAr: string;
  permissionKeys: string[];
  createdAt: string;
  updatedAt: string;
  kind: string
};

export type PermissionProfilesMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PermissionProfilesData = {
  profiles: PermissionProfile[];
  meta: PermissionProfilesMeta;
  emptyState: string | null;
};

export type PermissionProfilesResponse = {
  status: "success";
  message: string;
  data: PermissionProfilesData;
};
