export type PropertyType = "hotel";

export interface PropertyPolicies {
  en: string;
  ar: string;
}

export interface PropertyContact {
  phone: string;
  email: string;
  website: string;
}

export interface PropertyAmenity {
  amenityId: number;
  value: boolean;
}

export interface PropertyImage {
  uploadId: number;
  captionEn: string;
  captionAr: string;
  sortOrder: number;
  isCover: boolean;
}

export interface CreatePropertyPayload {
  nameEn: string;
  nameAr: string;
  aliases: string[];
  propertyType: PropertyType;
  brand: string;
  chain: string;
  countryCode: string;
  city: string;
  area: string;
  addressEn: string;
  addressAr: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  timezone: string;
  starRating: number;
  descriptionEn: string;
  descriptionAr: string;
  checkInTime: string;
  checkOutTime: string;
  policies: PropertyPolicies;
  contact: PropertyContact;
  amenities: PropertyAmenity[];
  images: PropertyImage[];
  note: string;
}