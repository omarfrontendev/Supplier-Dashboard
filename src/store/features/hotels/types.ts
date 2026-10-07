export type BookingConfirmationType = "on_request";

export type HotelLinkStatus = "approved" | "pending" | "rejected";

export interface Hotel {
  id: number;
  nameEn: string;
  nameAr: string;
  countryCode: string;
  city: string;
  starRating: number;
}

export interface LinkedHotel {
  linkId: number;
  hotelId: number;
  hotel: Hotel;
  bookingConfirmationType: BookingConfirmationType;
  status: HotelLinkStatus;
  statusChangedAt: string;
}

export interface HotelsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface HotelsData {
  hotels: LinkedHotel[];
  meta: HotelsMeta;
  emptyState: string | null;
}

export interface HotelsResponse {
  status: string;
  message: string;
  data: HotelsData;
}

export interface GetHotelsPayload {
  page?: number;
  limit?: number;
  status?: HotelLinkStatus;
}

export interface HotelsState {
  hotels: LinkedHotel[];
  meta: HotelsMeta | null;
  emptyState?: string | null;
  loading: boolean;
  error: string | null;
}

export type LinkStatus = "active" | "suspended" | "pending" | "rejected";

export type HotelStatus = "active" | "inactive";

export type PropertyType = "hotel" | "serviced_apartment" | "apartment" | "resort" | string;

export interface HotelAmenity {
  amenityId: number;
  value: boolean;
}

export interface HotelPolicies {
  ar: string;
  en: string;
}

export interface HotelContact {
  email: string;
  phone: string | null;
  website: string | null;
}

export interface Hotel {
  id: number;
  nameEn: string;
  nameAr: string;
  aliases: string[];
  propertyType: PropertyType;
  brand: string | null;
  chain: string | null;
  countryCode: string;
  city: string;
  area: string;
  addressEn: string;
  addressAr: string;
  postalCode: string | null;
  latitude: number;
  longitude: number;
  timezone: string;
  starRating: number;
  descriptionEn: string;
  descriptionAr: string;
  checkInTime: string;
  checkOutTime: string;
  policies: HotelPolicies;
  contact: HotelContact;
  status: HotelStatus;
  amenities: HotelAmenity[];
  images: string[];
}

export interface LinkedHotel {
  linkId: number;
  bookingConfirmationType: BookingConfirmationType;
  linkStatus: LinkStatus;
  hotel: Hotel;
}

export interface LinkedHotelResponse {
  status: string;
  message: string;
  data: LinkedHotel;
}

export interface HotelOption {
  id: number;
  nameEn: string;
  nameAr: string;
  countryCode: string;
  city: string;
  starRating: number | null;
  hasPendingRequest: boolean;
}

export interface HotelOptionsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface HotelOptionsData {
  hotels: HotelOption[];
  meta: HotelOptionsMeta;
}

export interface HotelOptionsResponse {
  status: string;
  message: string;
  data: HotelOptionsData;
}

export interface GetHotelOptionsParams {
  page?: number;
  limit?: number;
  search?: string;
  countryCode?: string;
  city?: string;
}

export interface HotelOptionsState {
  hotels: HotelOption[];
  meta: HotelOptionsMeta | null;
  loading: boolean;
  error: string | null;
}
