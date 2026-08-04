import type {
  ReactNode,
} from "react";

import AdminSidebar from "@/components/admin/AdminSidebar";

type Props = {
  children: ReactNode;
};

export default function AdminLayout({
  children,
}: Props) {

  return (

    <div className="flex min-h-screen bg-slate-950">

      <AdminSidebar />

      <main className="flex-1 overflow-auto p-8">

        {children}

      </main>

    </div>

  );

}
