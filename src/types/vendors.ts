import type { Meta } from "./api";

export type VendorStatus = "active" | "inactive" | "invited";
export interface VendorBody {
    id: number;
    nameEn: string;
    nameAr: string;
    status: VendorStatus;
    areaCount: number,
    regionCount: number,
    subRegionCount: number,
    boothsCount: number,
    dashboardUsersCount: number,
    mobileUsersCount: number,
};

export interface GetVendorPayload {
    page: number;
    limit: number;
    search: string | null;
    status: VendorStatus | null;
}

export interface VendorsTableOptions {
    pageIndex: number;
    pageSize: number;
    search: string;
    status: VendorStatus | null;
}

export interface FetchVendorsResponse {
    data: {
        VendorDetails: VendorBody[];
        meta: Meta;
    };
    message: string;
    statusCode: number;
}

export interface VendorsState {
    vendors: VendorBody[];
    loading: boolean;
    error: string | null;
    total: number;
}

export interface VendorStatusDialog {
    id?: number;
    nameEn: string;
    nameAr: string;
    status: VendorStatus | null;
}
