"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useAdminRole,
} from "@/components/admin/AdminRoleContext";

import AdminUsersTable, {
  type AdminUserRow,
} from "@/components/admin/AdminUsersTable";

import {
  canAccessPage,
} from "@/lib/admin/permissions";

import {
  getAdminUsers,
  setAdminUserVerified,
} from "@/lib/admin";

export default function AdminUsersPage() {
  const role = useAdminRole();

  const canUpdateUsers =
    canAccessPage(
      role,
      "users.update",
    );

  const [
    users,
    setUsers,
  ] = useState<AdminUserRow[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const [
    updatingUserId,
    setUpdatingUserId,
  ] = useState<string | null>(null);

  const [
    success,
    setSuccess,
  ] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      setLoading(true);
      setError(null);

      const {
        data,
        error: loadError,
      } = await getAdminUsers();

      if (!active) {
        return;
      }

      if (loadError) {
        console.error(
          "Failed to load admin users:",
          loadError,
        );

        setUsers([]);
        setError(
          "No se pudieron cargar los usuarios.",
        );
        setLoading(false);

        return;
      }

      setUsers(
        (data ?? []) as AdminUserRow[],
      );

      setLoading(false);
    }

    void loadUsers();

    return () => {
      active = false;
    };
  }, []);

  async function handleToggleVerified(
    id: string,
    verified: boolean,
  ) {
    if (!canUpdateUsers) {
      setError(
        "No tienes permiso para modificar usuarios.",
      );
      return;
    }

    setUpdatingUserId(id);
    setError(null);
    setSuccess(null);

    const {
      error: updateError,
    } = await setAdminUserVerified(
      id,
      verified,
    );

    if (updateError) {
      console.error(
        "Failed to update user verification:",
        updateError,
      );

      setError(
        "No se pudo actualizar la verificación.",
      );
      setUpdatingUserId(null);

      return;
    }

    setUsers((current) =>
      current.map((user) =>
        user.id === id
          ? {
              ...user,
              verified,
            }
          : user,
      ),
    );

    setSuccess(
      verified
        ? "Usuario verificado correctamente."
        : "Verificación retirada correctamente.",
    );

    setUpdatingUserId(null);
  }

  return (
    <section className="space-y-8">
      {success ? (
        <div className="rounded-2xl border border-emerald-800 bg-emerald-950/40 p-4 text-emerald-300">
          {success}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-800 bg-red-950/40 p-4 text-red-300">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-2xl">
          <p className="text-slate-400">
            Cargando usuarios...
          </p>
        </div>
      ) : users.length === 0 && !error ? (
        <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-2xl">
          <h1 className="text-3xl font-bold">
            Usuarios
          </h1>

          <p className="mt-4 text-slate-400">
            No hay usuarios registrados.
          </p>
        </div>
      ) : users.length > 0 ? (
        <AdminUsersTable
          users={users}
          canUpdateUsers={canUpdateUsers}
          updatingUserId={updatingUserId}
          onToggleVerified={
            handleToggleVerified
          }
        />
      ) : null}
    </section>
  );
}