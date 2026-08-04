export type UserRole =
  | "super_admin"
  | "admin"
  | "finance"
  | "academy_manager"
  | "live_manager"
  | "marketplace_manager"
  | "ai_manager"
  | "support"
  | "user";

export type Permission =
  | "*"
  | "users.read"
  | "users.update"
  | "wallet.read"
  | "withdraw.read"
  | "withdraw.approve"
  | "withdraw.pay"
  | "settings.update"
  | "reports.read"
  | "academy.read"
  | "academy.update"
  | "live.read"
  | "live.update"
  | "marketplace.read"
  | "marketplace.update"
  | "ai.read"
  | "ai.update"
  | "tickets.read";

export const rolePermissions: Record<
  UserRole,
  readonly Permission[]
> = {
  super_admin: [
    "*",
  ],

  admin: [
    "users.read",
    "users.update",
    "wallet.read",
    "withdraw.read",
    "withdraw.approve",
    "settings.update",
    "reports.read",
  ],

  finance: [
    "wallet.read",
    "withdraw.read",
    "withdraw.approve",
    "withdraw.pay",
  ],

  academy_manager: [
    "academy.read",
    "academy.update",
  ],

  live_manager: [
    "live.read",
    "live.update",
  ],

  marketplace_manager: [
    "marketplace.read",
    "marketplace.update",
  ],

  ai_manager: [
    "ai.read",
    "ai.update",
  ],

  support: [
    "users.read",
    "tickets.read",
  ],

  user: [],
};

export function hasPermission(
  role: UserRole,
  permission: Permission,
): boolean {
  const permissions =
    rolePermissions[role];

  return (
    permissions.includes("*") ||
    permissions.includes(permission)
  );
}
