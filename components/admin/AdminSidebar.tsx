"use client";

import Link from "next/link";

import {
  canAccessPage,
} from "@/lib/admin/permissions";

import type {
  Permission,
  UserRole,
} from "@/lib/roles";

type MenuItem = {
  title: string;
  href: string;
  icon: string;
  permission?: Permission;
};

const menu: readonly MenuItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: "📊",
  },
  {
    title: "Usuarios",
    href: "/admin/users",
    icon: "👥",
    permission: "users.read",
  },
  {
    title: "Wallet",
    href: "/admin/wallet",
    icon: "💰",
    permission: "wallet.read",
  },
  {
    title: "Retiros",
    href: "/admin/withdraws",
    icon: "💸",
    permission: "withdraw.read",
  },
  {
    title: "Member ID",
    href: "/admin/member",
    icon: "🪪",
    permission: "users.read",
  },
  {
    title: "Soporte",
    href: "/admin/support",
    icon: "💬",
    permission: "tickets.read",
  },





  {
    title: "Configuración",
    href: "/admin/settings",
    icon: "⚙️",
    permission: "settings.update",
  },
  {
    title: "Auditoría",
    href: "/admin/audit",
    icon: "🛡️",
    permission: "reports.read",
  },
];

type Props = {
  role: UserRole;
};

export default function AdminSidebar({
  role,
}: Props) {
  const visibleMenu = menu.filter(
    (item) =>
      !item.permission ||
      canAccessPage(
        role,
        item.permission,
      ),
  );

  return (
    <aside className="min-h-screen w-72 bg-slate-950 p-6 text-white">
      <h1 className="mb-10 text-3xl font-bold">
        👑 VYRO Admin
      </h1>

      <nav className="space-y-2">
        {visibleMenu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-slate-800"
          >
            <span>
              {item.icon}
            </span>

            <span>
              {item.title}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
