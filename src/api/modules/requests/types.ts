export type RequestType = "all" | "access" | "hotel" | "room" | "company";

export type HotelRequestStatus =
  | "pending"
  | "approved"
  | "rejected";

export type HotelLinkingRequestStatus =
  | "submitted"
  | "approved"
  | "rejected";

export interface HotelRequestHotel {
  id: number;
  nameEn: string;
  nameAr: string;
  aliases: string[];
  propertyType: string;
  brand: string | null;
  chain: string | null;
  countryCode: string;
  city: string;
  area: string | null;
  addressEn: string;
  addressAr: string;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  timezone: string;
  starRating: number;
  descriptionEn: string;
  descriptionAr: string;
  checkInTime: string;
  checkOutTime: string;
  policies: {
    ar: string;
    en: string;
  };
  contact: {
    email: string;
    phone: string | null;
    website: string | null;
  };
  status: string;
  amenities: string[];
  images: string[];
}

export interface HotelRequest {
  id: number;
  supplierId: number;
  hotelId: number;
  submittedBySupplierUserId: number;
  note: string | null;
  infoRequestMessage: string | null;
  supplierResponse: string | null;
  reviewNote: string | null;
  status: HotelRequestStatus;
  reviewedAt: string | null;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
  hotel: HotelRequestHotel;
}

export interface HotelLinkingRequest {
  id: number;
  hotelId: number;
  submittedBySupplierUserId: number;
  bookingConfirmationType: "instant" | "on_request";
  finalBookingConfirmationType: "instant" | "on_request";
  note: string | null;
  reviewNote: string | null;
  status: HotelLinkingRequestStatus;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  hotel: {
    id: number;
    nameEn: string;
    nameAr: string;
    countryCode: string;
    city: string;
    starRating: number;
  };
}

export interface RequestsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RequestsResponse<T> {
  status: string;
  message: string;
  data: {
    requests: T[];
    meta: RequestsMeta;
  };
}

export interface UseRequestsParams {
  type: RequestType;
  page?: number;
  limit?: number;
  status?: string;
}