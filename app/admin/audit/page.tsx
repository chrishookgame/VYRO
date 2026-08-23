import { redirect } from "next/navigation";

import {
  canAccessPage,
} from "@/lib/admin/permissions";
import { getAdminAuditLogs } from "@/lib/admin";
import {
  rolePermissions,
  type UserRole,
} from "@/lib/roles";
import {
  createServerSupabaseClient,
} from "@/lib/supabase-server";

type AdminAuditLog = {
  id: string;
  created_at: string;
  action: string;
  admin_id: string;
  details: string | null;
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

export default async function AdminAuditPage() {
  const supabase =
    await createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
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
      "reports.read",
    )
  ) {
    redirect("/admin");
  }

  const { data, error } =
    await getAdminAuditLogs();

  const logs =
    (data ?? []) as AdminAuditLog[];

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">
          Auditoría Global
        </h1>

        <p className="mt-2 text-slate-400">
          Historial completo de acciones administrativas.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
          No fue posible cargar la auditoría.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900">
                <th className="p-4 text-left">
                  Fecha
                </th>

                <th className="p-4 text-left">
                  Acción
                </th>

                <th className="p-4 text-left">
                  Administrador
                </th>

                <th className="p-4 text-left">
                  Detalles
                </th>
              </tr>
            </thead>

            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-slate-400"
                  >
                    No hay registros de auditoría todavía.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-slate-900"
                  >
                    <td className="p-4">
                      {new Date(
                        log.created_at,
                      ).toLocaleString()}
                    </td>

                    <td className="p-4">
                      {log.action}
                    </td>

                    <td className="p-4 font-mono text-sm">
                      {log.admin_id}
                    </td>

                    <td className="p-4">
                      {log.details ?? "Sin detalles"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
