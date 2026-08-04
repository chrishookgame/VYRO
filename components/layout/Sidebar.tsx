"use client";

import Link from "next/link";
import {
  BarChart3,
  Bot,
  DollarSign,
  GraduationCap,
  LayoutDashboard,
  Library,
  LogOut,
  Radio,
  Settings,
  Shield,
  Upload,
  UserRound,
  Video,
  WalletCards,
  MessageCircle,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";

const baseMenu = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Studio",
    href: "/upload",
    icon: Upload,
  },
  {
    name: "Feed",
    href: "/feed",
    icon: Video,
  },
  {
    name: "Library",
    href: "/library",
    icon: Library,
  },
  {
    name: "AI Studio",
    href: "/ai",
    icon: Bot,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Wallet",
    href: "/wallet",
    icon: WalletCards,
  },
  {
    name: "Monetize",
    href: "/monetize",
    icon: DollarSign,
  },
  {
    name: "Live Hub",
    href: "/live",
    icon: Radio,
  },
  {
    name: "Academy",
    href: "/academy",
    icon: GraduationCap,
  },
  {
    name: "Soporte",
    href: "/support",
    icon: MessageCircle,
  },
  {
    name: "Perfil",
    href: "/profile",
    icon: UserRound,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

const allowedAdminRoles = [
  "super_admin",
  "admin",
  "support",
  "finance",
];

export default function Sidebar() {
  const router = useRouter();

  const {
    user,
    signOut,
  } = useAuth();

  const [
    signingOut,
    setSigningOut,
  ] = useState(false);

  const role =
    String(
      user?.app_metadata?.role ??
      user?.user_metadata?.role ??
      "user",
    );

  const canAccessAdmin =
    allowedAdminRoles.includes(role);

  const menu =
    canAccessAdmin
      ? [
          ...baseMenu,
          {
            name: "Admin Maestro",
            href: "/admin",
            icon: Shield,
          },
        ]
      : baseMenu;

  async function handleSignOut() {
    setSigningOut(true);

    try {
      await signOut();
      router.replace("/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-cyan-500/20 bg-[#070B14] p-6">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-cyan-400">
          VYRO
        </h1>

        <p className="mt-1 text-sm text-gray-400">
          Create Beyond Limits
        </p>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
        {menu.map((item) => {
          const Icon =
            item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 rounded-2xl p-4 text-gray-300 transition-all hover:translate-x-1 hover:bg-cyan-500 hover:text-black"
            >
              <Icon size={22} />

              <span className="font-semibold">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-5 space-y-3">
        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
          <p className="font-bold text-cyan-400">
            AI CORE
          </p>

          <p className="mt-2 text-sm text-green-400">
            ● ONLINE
          </p>

          <p className="mt-1 text-xs uppercase text-slate-500">
            Rol: {role}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 font-semibold text-red-300 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LogOut size={20} />

          {signingOut
            ? "Cerrando sesión..."
            : "Cerrar sesión"}
        </button>
      </div>
    </aside>
  );
}
