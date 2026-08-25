export type UserRole = "super_admin" | "admin" | "ClientMobileSupervisor" | "ClientMobileSales" | "ClientSuperAdmin"; // Add other roles if needed

export interface Role {
  label: string;
  value: UserRole;
}

export const dashboardUserRoles: Role[] = [
  { label: "Super Admin", value: "super_admin" },
  { label: "Admin", value: "admin" },
]
export const mobileUserRoles: Role[] = [
  { label: "Client Mobile Supervisor", value: "ClientMobileSupervisor" },
  { label: "Mobile Sales", value: "ClientMobileSales" },
];
