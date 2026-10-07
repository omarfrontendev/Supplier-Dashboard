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
  emptyState: string | null;
  loading: boolean;
  error: string | null;
}