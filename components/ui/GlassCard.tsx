"use client";

import { ReactNode } from "react";

interface GlassCardProps {
  title: string;
  value: string;
  color?: string;
  children?: ReactNode;
}

export default function GlassCard({
  title,
  value,
  color = "#00E5FF",
  children,
}: GlassCardProps) {
  return (
    <div
      className="
      relative
      overflow-hidden
      rounded-3xl
      border
      border-white/10
      bg-white/5
      backdrop-blur-xl
      p-7
      transition-all
      duration-300
      hover:scale-[1.03]
      hover:border-cyan-400
      hover:shadow-[0_0_40px_rgba(0,229,255,.25)]
      "
    >
      <div
        className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl opacity-20"
        style={{ background: color }}
      />

      <p className="text-gray-400 uppercase tracking-wider text-sm">
        {title}
      </p>

      <h2
        className="mt-4 text-5xl font-black"
        style={{ color }}
      >
        {value}
      </h2>

      <div className="mt-6">
        {children}
      </div>
    </div>
  );
}