"use client";

import { Sparkles, Globe, BrainCircuit, ScanSearch } from "lucide-react";
import Link from "next/link";

export default function AIOverlay() {
  return (
    <div className="absolute top-5 left-5 z-30 rounded-2xl border border-cyan-400/30 bg-black/40 backdrop-blur-xl p-4 w-72">

      <Link
        href="/ai"
        className="mb-4 flex items-center gap-2 rounded-xl transition hover:bg-cyan-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
        aria-label="Abrir VYRO AI Director"
      >
        <Sparkles className="text-cyan-400" size={22} />

        <h2 className="font-bold text-cyan-300 tracking-widest">
          VYRO AI
        </h2>
      </Link>

      <div className="space-y-3 text-sm">

        <div className="flex items-center justify-between">
          <span>AI Status</span>
          <span className="text-green-400">ONLINE</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Language</span>
          <Globe size={18} className="text-cyan-300" />
        </div>

        <div className="flex items-center justify-between">
          <span>Recognition</span>
          <ScanSearch size={18} className="text-violet-300" />
        </div>

        <div className="flex items-center justify-between">
          <span>AI Assistant</span>
          <BrainCircuit size={18} className="text-cyan-300" />
        </div>

      </div>

    </div>
  );
}
