export interface CountryMetadata {
  code: string;
  nameEn: string;
  nameAr: string;
}

export interface RatesAvailabilityHotel {
  id: number;
  nameEn: string;
  nameAr: string;
  countryCode: string;
  city: string;
  starRating: number;
  status: string;
}

export interface RatesAvailabilityContract {
  id: number;
  hotelId: number;
  hotelNameEn: string;
  hotelNameAr: string;
  name: string;
  startDate: string;
  endDate: string;
  currency: string;
  bookingType: string;
  pricingModel: string;
  status: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RatesAvailabilityHotelsData {
  hotels: RatesAvailabilityHotel[];
  meta: PaginationMeta;
  emptyState: string;
}

export interface RatesAvailabilityContractsData {
  contracts: RatesAvailabilityContract[];
  meta: PaginationMeta;
  emptyState: string;
}

export interface RatesAvailabilityMetadataData {
  countries: CountryMetadata[];
}

export interface FetchRatesAvailabilityParams {
  page: number;
  limit: number;
}

export interface FetchHotelContractsParams extends FetchRatesAvailabilityParams {
  hotelId: number | string;
}