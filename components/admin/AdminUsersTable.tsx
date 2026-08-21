"use client";

export type AdminUserRow = {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
  verified: boolean;
  created_at: string;
};

type Props = {
  users: AdminUserRow[];
  canUpdateUsers: boolean;
  updatingUserId: string | null;
  onToggleVerified: (
    id: string,
    verified: boolean,
  ) => void;
};

export default function AdminUsersTable({
  users,
  canUpdateUsers,
  updatingUserId,
  onToggleVerified,
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
                Acción
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => {
              const updating =
                updatingUserId === user.id;

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