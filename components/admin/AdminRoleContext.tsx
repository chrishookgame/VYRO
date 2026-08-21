"use client";

import {
  createContext,
  useContext,
} from "react";

import type {
  ReactNode,
} from "react";

import type {
  UserRole,
} from "@/lib/roles";

const AdminRoleContext =
  createContext<UserRole | null>(null);

type Props = {
  role: UserRole;
  children: ReactNode;
};

export function AdminRoleProvider({
  role,
  children,
}: Props) {
  return (
    <AdminRoleContext.Provider value={role}>
      {children}
    </AdminRoleContext.Provider>
  );
}

export function useAdminRole(): UserRole {
  const role =
    useContext(AdminRoleContext);

  if (!role) {
    throw new Error(
      "AdminRoleProvider no está disponible.",
    );
  }

  return role;
}
