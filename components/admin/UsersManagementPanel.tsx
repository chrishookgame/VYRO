"use client";

export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  level: string;
  verified: boolean;
  status:
    | "active"
    | "suspended"
    | "blocked";
};

type Props = {
  users: AdminUser[];
  onView: (id: string) => void;
  onSuspend: (id: string) => void;
  onBlock: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function UsersManagementPanel({
  users,
  onView,
  onSuspend,
  onBlock,
  onDelete,
}: Props) {

  return (

    <section className="rounded-3xl bg-slate-950 p-8 text-white shadow-2xl">

      <h1 className="text-3xl font-bold">
        Gestión de Usuarios
      </h1>

      <p className="mt-2 text-slate-400">
        Admin Maestro
      </p>

      <div className="mt-8 space-y-4">

        {users.map((user) => (

          <div
            key={user.id}
            className="rounded-2xl border border-slate-700 bg-slate-900 p-5"
          >

            <div className="flex items-center justify-between">

              <div>

                <h2 className="font-bold">
                  {user.fullName}
                </h2>

                <p className="text-slate-400">
                  {user.email}
                </p>

                <p className="mt-1 text-cyan-300">
                  {user.level}
                </p>

              </div>

              <div className="text-right">

                <p className="font-bold">
                  {user.verified
                    ? "✔ Verificado"
                    : "Pendiente"}
                </p>

                <p className="text-sm uppercase text-yellow-400">
                  {user.status}
                </p>

              </div>

            </div>

            <div className="mt-5 flex flex-wrap gap-3">

              <button
                onClick={() => onView(user.id)}
                className="rounded-lg bg-cyan-500 px-4 py-2 font-bold text-black"
              >
                Ver Perfil
              </button>

              <button
                onClick={() => onSuspend(user.id)}
                className="rounded-lg bg-yellow-500 px-4 py-2 font-bold text-black"
              >
                Suspender
              </button>

              <button
                onClick={() => onBlock(user.id)}
                className="rounded-lg bg-orange-500 px-4 py-2 font-bold text-black"
              >
                Bloquear
              </button>

              <button
                onClick={() => onDelete(user.id)}
                className="rounded-lg bg-red-600 px-4 py-2 font-bold"
              >
                Eliminar
              </button>

            </div>

          </div>

        ))}

      </div>

    </section>

  );

}
