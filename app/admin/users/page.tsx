"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import AdminUsersTable, {
  type AdminUserRow,
} from "@/components/admin/AdminUsersTable";

import {
  getAdminUsers,
} from "@/lib/admin";

export default function AdminUsersPage() {
  const router = useRouter();

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

  return (
    <section className="space-y-8">
      {loading ? (
        <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-2xl">
          <p className="text-slate-400">
            Cargando usuarios...
          </p>
        </div>
      ) : error ? (
        <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-2xl">
          <p className="text-red-400">
            {error}
          </p>
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-2xl">
          <h1 className="text-3xl font-bold">
            Usuarios
          </h1>

          <p className="mt-4 text-slate-400">
            No hay usuarios registrados.
          </p>
        </div>
      ) : (
        <AdminUsersTable
          users={users}
          onOpen={(id) => {
            router.push(
              `/admin/users/${id}`,
            );
          }}
        />
      )}
    </section>
  );
}