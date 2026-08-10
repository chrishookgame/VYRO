import type {
  ReactNode,
} from "react";

import { redirect } from "next/navigation";

import AdminSidebar from "@/components/admin/AdminSidebar";

import {
  canAccessAdmin,
} from "@/lib/admin/permissions";

import {
  rolePermissions,
  type UserRole,
} from "@/lib/roles";

import {
  createServerSupabaseClient,
} from "@/lib/supabase-server";

type Props = {
  children: ReactNode;
};

function isUserRole(
  value: unknown,
): value is UserRole {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(
      rolePermissions,
      value,
    )
  );
}

export default async function AdminLayout({
  children,
}: Props) {
  const supabase =
    await createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login?next=/admin");
  }

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (
    profileError ||
    !profile ||
    !isUserRole(profile.role) ||
    !canAccessAdmin(profile.role)
  ) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar />

      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
