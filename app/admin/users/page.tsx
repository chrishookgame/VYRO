"use client";

import { useRouter } from "next/navigation";

import AdminUsersTable from "@/components/admin/AdminUsersTable";

export default function AdminUsersPage() {
  const router = useRouter();

  return (
    <section className="space-y-8">
      <AdminUsersTable
        users={[]}
        onOpen={(id) => {
          router.push(
            `/admin/users/${id}`,
          );
        }}
      />
    </section>
  );
}
