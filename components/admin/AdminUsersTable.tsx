"use client";

export type AdminUserRow = {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
  verified: boolean;
  role: string;
  account_status:
    | "active"
    | "suspended"
    | "blocked";
  created_at: string;
};

type Props = {
  users: AdminUserRow[];
  canUpdateUsers: boolean;
  currentUserId: string | null;
  currentAdminRole: string;
  updatingUserId: string | null;
  onToggleVerified: (
    id: string,
    verified: boolean,
  ) => void;
  onStatusChange: (
    id: string,
    status:
      | "active"
      | "suspended"
      | "blocked",
  ) => void;
};

export default function AdminUsersTable({
  users,
  canUpdateUsers,
  currentUserId,
  currentAdminRole,
  updatingUserId,
  onToggleVerified,
  onStatusChange,
}: Props) {
  return (
    <section className="rounded-3xl bg-slate-950 p-8 text-white shadow-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Usuarios
          </h1>

          <p className="mt-2 text-slate-400">
            Gestión administrativa segura
          </p>
        </div>

        <span className="rounded-full bg-cyan-500 px-4 py-2 font-bold text-black">
          {users.length} usuarios
        </span>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700 text-left">
              <th className="pb-4">
                Nombre
              </th>

              <th className="pb-4">
                Usuario
              </th>

              <th className="pb-4">
                Registro
              </th>

              <th className="pb-4">
                Verificación
              </th>

              <th className="pb-4">
                Estado de cuenta
              </th>

              <th className="pb-4">
                Acción
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => {
              const updating =
                updatingUserId === user.id;

              const isSelf =
                currentUserId === user.id;

              const protectedAdmin =
                currentAdminRole === "admin" &&
                (
                  user.role === "admin" ||
                  user.role === "super_admin"
                );

              const canChangeStatus =
                canUpdateUsers &&
                !isSelf &&
                !protectedAdmin;

              return (
                <tr
                  key={user.id}
                  className="border-b border-slate-800"
                >
                  <td className="py-4">
                    {user.full_name}
                  </td>

                  <td>
                    @{user.username}
                  </td>

                  <td>
                    {new Date(
                      user.created_at,
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    <span
                      className={
                        user.verified
                          ? "font-semibold text-emerald-400"
                          : "font-semibold text-yellow-400"
                      }
                    >
                      {user.verified
                        ? "Verificado"
                        : "Pendiente"}
                    </span>
                  </td>

                  <td>
                    <span
                      className={
                        user.account_status === "active"
                          ? "font-semibold text-emerald-300"
                          : user.account_status === "suspended"
                            ? "font-semibold text-yellow-300"
                            : "font-semibold text-red-300"
                      }
                    >
                      {user.account_status === "active"
                        ? "Activo"
                        : user.account_status === "suspended"
                          ? "Suspendido"
                          : "Bloqueado"}
                    </span>
                  </td>

                  <td>
                    {canUpdateUsers ? (
                      <button
                        type="button"
                        disabled={updating}
                        onClick={() =>
                          onToggleVerified(
                            user.id,
                            !user.verified,
                          )
                        }
                        className="rounded-lg bg-cyan-500 px-4 py-2 font-bold text-black transition disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {updating
                          ? "Guardando..."
                          : user.verified
                            ? "Quitar verificación"
                            : "Verificar"}
                      </button>
                    ) : (
                      <span className="text-sm text-slate-500">
                        Solo lectura
                      </span>
                    )}

                    {canChangeStatus ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {user.account_status !== "suspended" ? (
                          <button
                            type="button"
                            disabled={updating}
                            onClick={() =>
                              onStatusChange(
                                user.id,
                                "suspended",
                              )
                            }
                            className="rounded-lg border border-yellow-700 px-3 py-1 text-sm font-semibold text-yellow-300 transition disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Suspender
                          </button>
                        ) : null}

                        {user.account_status !== "blocked" ? (
                          <button
                            type="button"
                            disabled={updating}
                            onClick={() =>
                              onStatusChange(
                                user.id,
                                "blocked",
                              )
                            }
                            className="rounded-lg border border-red-700 px-3 py-1 text-sm font-semibold text-red-300 transition disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Bloquear
                          </button>
                        ) : null}

                        {user.account_status !== "active" ? (
                          <button
                            type="button"
                            disabled={updating}
                            onClick={() =>
                              onStatusChange(
                                user.id,
                                "active",
                              )
                            }
                            className="rounded-lg border border-emerald-700 px-3 py-1 text-sm font-semibold text-emerald-300 transition disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Restaurar
                          </button>
                        ) : null}
                      </div>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}