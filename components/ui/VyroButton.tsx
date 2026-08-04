"use client";

import { ReactNode } from "react";

type VyroButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
};

export default function VyroButton({
  children,
  onClick,
  className = "",
}: VyroButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-8
        py-4
        rounded-full
        bg-cyan-500
        text-white
        font-bold
        text-lg
        transition-all
        duration-300
        hover:scale-105
        hover:bg-cyan-400
        active:scale-95
        shadow-[0_0_30px_rgba(6,182,212,0.5)]
        ${className}
      `}
    >
      {children}
    </button>
  );
}