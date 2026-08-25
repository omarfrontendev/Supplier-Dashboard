import type { Meta } from "./api";

export interface SubRegionBody {
    id?: number,
    nameEn: string;
    nameAr: string;
    code: string;
    regionId: number;
    coords: { lat: number; lng: number }[];
};

export interface CreateSubRegionResponse {
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

export interface SubregionsTableOptions {
    pageIndex: number;
    pageSize: number;
    search: string;
    regionId: number | null
    vendorId?: number | null
};
export interface GetSubregionsPayload {
    page: number;
    limit: number;
    search: string;
    regionId: number | null;
    vendorId?: number | null;
}

export interface FetchSubRegionsResponse {
    data: {
        SubRegion: SubRegionBody[];
        meta: Meta;
    };
    message: string;
    statusCode: number;
}

export interface FetchVendorSubRegionsResponse {
    data: {
        VendorSubRegion: SubRegionBody[];
        meta: Meta;
    };
    message: string;
    statusCode: number;
}