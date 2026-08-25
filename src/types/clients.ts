export interface CreateClientDto {
  name: string;
  logo: string;
  emailDomain: string;
  contactPhone: string;
  country: string;
  city: string;
  clientSuperAdminUserId: number;
}
