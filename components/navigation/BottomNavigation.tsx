"use client";

import { House, Search, Plus, Bell, User } from "lucide-react";

export default function BottomNavigation() {
  return (
    <nav className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-6 rounded-full border border-cyan-400/20 bg-white/10 px-6 py-4 backdrop-blur-xl shadow-[0_0_30px_rgba(0,229,255,0.25)]">

        <button className="text-cyan-400 transition-all duration-300 hover:scale-110">
          <House size={24} />
        </button>

        <button className="text-white transition-all duration-300 hover:scale-110">
          <Search size={24} />
        </button>

        <button className="rounded-full bg-cyan-500 p-3 text-black transition-all duration-300 hover:scale-110">
          <Plus size={26} />
        </button>

        <button className="text-white transition-all duration-300 hover:scale-110">
          <Bell size={24} />
        </button>

        <button className="text-white transition-all duration-300 hover:scale-110">
          <User size={24} />
        </button>

      </div>
    </nav>
  );
}