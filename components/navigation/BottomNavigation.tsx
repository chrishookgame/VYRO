"use client";

import {
  Bell,
  Bot,
  House,
  Plus,
  User,
} from "lucide-react";
import Link from "next/link";

export default function BottomNavigation() {
  return (
    <nav className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-5 rounded-full border border-cyan-400/20 bg-black/70 px-5 py-3 shadow-[0_0_30px_rgba(0,229,255,0.25)] backdrop-blur-xl">
        <Link
          href="/feed"
          aria-label="Feed"
          className="text-cyan-400 transition hover:scale-110"
        >
          <House size={24} />
        </Link>

        <Link
          href="/ai"
          aria-label="VYRO AI"
          className="text-white transition hover:scale-110"
        >
          <Bot size={24} />
        </Link>

        <Link
          href="/creator"
          aria-label="VYRO Creator"
          className="rounded-full bg-cyan-500 p-3 text-black transition hover:scale-110"
        >
          <Plus size={26} />
        </Link>

        <Link
          href="/notifications"
          aria-label="Notificaciones"
          className="text-white transition hover:scale-110"
        >
          <Bell size={24} />
        </Link>

        <Link
          href="/profile"
          aria-label="Perfil"
          className="text-white transition hover:scale-110"
        >
          <User size={24} />
        </Link>
      </div>
    </nav>
  );
}