import { redirect } from "next/navigation";

import GlobalSettingsCenter
from "@/components/admin/GlobalSettingsCenter";

import PlatformSettingsPanel
from "@/components/admin/PlatformSettingsPanel";

import {
  canAccessPage,
} from "@/lib/admin/permissions";

import {
  rolePermissions,
  type UserRole,
} from "@/lib/roles";

import {
  createServerSupabaseClient,
} from "@/lib/supabase-server";

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

export default async function AdminSettingsPage() {
  const supabase =
    await createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect(
      "/login?next=/admin/settings",
    );
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
    !canAccessPage(
      profile.role,
      "settings.update",
    )
  ) {
    redirect("/admin");
  }

  return (
    <section className="space-y-8">
      <GlobalSettingsCenter />

      <PlatformSettingsPanel />
    </section>
  );
}
