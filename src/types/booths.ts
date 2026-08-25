export interface CameraConfig {
  rtspUrl: string;
  username: string;
  password: string;
}

export interface CreateBoothDto {
  name: string;
  code: string;
  mallId: number;
  clientId: number;
  cameraConfig: CameraConfig;
  shiftIds: number[];
  shifts?: []
}

export interface BoothBoody {
  name: string;
  code: string;
  mallId: number;
  clientId: number;
  cameraConfig: CameraConfig;
  shiftIds: number[];
  shifts?: []
}

export interface BoothsTableOptions {
  pageIndex: number;
  pageSize: number;
  search: string;
  mallId: number | null
  vendorId?: number | null
};
export interface GetBoothsPayload {
  page: number;
  limit: number;
  search: string;
  mallId: number | null
  vendorId?: number | null
}
