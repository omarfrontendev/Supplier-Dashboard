import type { Meta } from "./api";

export interface MallBody {
    id?: number,
    nameEn: string;
    nameAr: string;
    code: string;
    address: string;
    subRegionId: number;
    coords: { lat: number; lng: number }[];
};

export interface CreateMallResponse {
    success: boolean;
    data: {
        id: string;
        coords: { lat: number; lng: number }[];
        nameEn: string;
        nameAr: string;
        code: string;
        regionId: string;
    };
};

export interface MallsTableOptions {
    pageIndex: number;
    pageSize: number;
    search: string;
    subRegionId: number | null
    vendorId?: number | null
};

export interface FetchVendorMallsResponse {
    data: {
        VendorMall: MallBody[];
        meta: Meta;
    };
    message: string;
    statusCode: number;
}

export interface FetchMallsResponse {
    data: {
        Mall: MallBody[];
        meta: Meta;
    };
    message: string;
    statusCode: number;
}

export interface GetMallsPayload {
    page: number;
    limit: number;
    search: string;
    subRegionId: number | null
    vendorId?: number | null
}