import {
  hasPermission,
  type Permission,
  type UserRole,
} from "@/lib/roles";

export function canAccessAdmin(
  role: UserRole,
): boolean {
  return role !== "user";
}

export function canAccessPage(
  role: UserRole,
  permission: Permission,
): boolean {
  if (role === "super_admin") {
    return true;
  }

  return hasPermission(
    role,
    permission,
  );
}

export function requirePermission(
  role: UserRole,
  permission: Permission,
): void {
  if (
    !canAccessPage(
      role,
      permission,
    )
  ) {
    throw new Error(
      "Acceso denegado.",
    );
  }
}
