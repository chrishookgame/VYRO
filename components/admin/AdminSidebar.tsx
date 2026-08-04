"use client";

import Link from "next/link";

const menu = [

  {
    title: "Dashboard",
    href: "/admin",
    icon: "📊",
  },

  {
    title: "Usuarios",
    href: "/admin/users",
    icon: "👥",
  },

  {
    title: "Wallet",
    href: "/admin/wallet",
    icon: "💰",
  },

  {
    title: "Retiros",
    href: "/admin/withdraws",
    icon: "💸",
  },

  {
    title: "Member ID",
    href: "/admin/member",
    icon: "🪪",
  },

  {
    title: "VYRO Card",
    href: "/admin/card",
    icon: "💳",
  },

  {
    title: "Marketplace",
    href: "/admin/marketplace",
    icon: "🛒",
  },

  {
    title: "Live",
    href: "/admin/live",
    icon: "📺",
  },

  {
    title: "Academy",
    href: "/admin/academy",
    icon: "🎓",
  },

  {
    title: "AI",
    href: "/admin/ai",
    icon: "🤖",
  },

  {
    title: "Configuración",
    href: "/admin/settings",
    icon: "⚙️",
  },

  {
    title: "Auditoría",
    href: "/admin/audit",
    icon: "🛡️",
  },

];

export default function AdminSidebar() {

  return (

    <aside className="min-h-screen w-72 bg-slate-950 p-6 text-white">

      <h1 className="mb-10 text-3xl font-bold">

        👑 VYRO Admin

      </h1>

      <nav className="space-y-2">

        {menu.map(item => (

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
