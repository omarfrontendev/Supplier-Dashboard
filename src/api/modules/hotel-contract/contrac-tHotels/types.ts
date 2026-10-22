export interface ContractHotel {
  id: number;
  nameEn: string;
  nameAr: string;
  countryCode: string;
  city: string;
  starRating: number;
  propertyType: string;
  status: string;
}

export interface ContractHotelsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type ContractHotelsEmptyState = "no_hotels";

export interface ContractHotelsData {
  hotels: ContractHotel[];
  meta: ContractHotelsMeta;
  emptyState: ContractHotelsEmptyState | null;
}

export interface ContractHotelsResponse {
  status: "success";
  message: string;
  data: ContractHotelsData;
}