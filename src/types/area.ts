import type { Meta } from "./api";

export interface AreaBody {
    id?: number,
    nameEn: string;
    nameAr: string;
    areaCode: string;
    coords: { lat: number; lng: number }[];
};

export interface GetAreasParams {
    page: number;
    limit: number;
}

export interface GetVendorAreasParams {
    vendorId?: number;
    page: number;
    limit: number;
}

export interface FetchAreasResponse {
    data: {
        Area: AreaBody[];
        meta: Meta;
    };
    message: string;
    statusCode: number;
}
export interface FetchVendorAreasResponse {
    data: {
        VendorArea: AreaBody[];
        meta: Meta;
    };
    message: string;
    statusCode: number;
}

export interface CreateAreaResponse {
    statusCode: number;
    message: string,
    data: {
        id: string;
        coords: { lat: number; lng: number }[];
        nameEn: string;
        nameAr: string;
        areaCode: string;
    };
};

export interface AreasTableOptions {
    pageIndex: number;
    pageSize: number;
    search: string;
    vendorId?: number
};

export interface GetAreasPayload {
    page: number;
    limit: number;
    search: string;
    vendorId?: number
}