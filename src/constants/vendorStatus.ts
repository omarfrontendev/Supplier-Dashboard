// src/constants/userStatus.ts

import type { VendorStatus } from "@/types/vendors";


export interface Status {
  label: string;
  value: VendorStatus;
}

export const vendorStatusList: Status[] = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Invaite", value: "invited" },
];
