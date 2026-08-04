"use client";

import type {
  InputHTMLAttributes,
} from "react";

export interface SearchProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type"
  > {
  onClear?: () => void;
}

export default function Search({
  value,
  onClear,
  className = "",
  placeholder =
    "Buscar...",
  ...props
}: SearchProps) {
  const hasValue =
    typeof value === "string" &&
    value.length > 0;

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
        🔍
      </span>

      <input
        {...props}
        type="search"
        value={value}
        placeholder={placeholder}
        className={`
          w-full
          rounded-xl
          border
          border-slate-700
          bg-slate-950
          py-3
          pl-11
          pr-12
          text-white
          outline-none
          placeholder:text-slate-500
          focus:border-cyan-400
          focus:ring-2
          focus:ring-cyan-400/20
          ${className}
        `}
      />

      {hasValue && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-800 hover:text-white"
          aria-label="Limpiar búsqueda"
        >
          ✕
        </button>
      )}
    </div>
  );
}
