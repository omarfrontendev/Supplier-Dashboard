// src/constants/userStatus.ts

export type UserStatus = "Active" | "Deactivated" | "Invited";

export interface Status {
  label: string;
  value: UserStatus;
}

export const userStatus: Status[] = [
  { label: "Active", value: "Active" },
  { label: "Deactivated", value: "Deactivated" },
  // { label: "Invaite", value: "Invited" },
];
