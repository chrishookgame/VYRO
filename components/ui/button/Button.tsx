"use client";

import type {
  ButtonHTMLAttributes,
} from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "ghost";

export type ButtonSize =
  | "sm"
  | "md"
  | "lg";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variants: Record<
  ButtonVariant,
  string
> = {
  primary:
    "bg-cyan-500 text-black hover:bg-cyan-400",
  secondary:
    "bg-slate-800 text-white hover:bg-slate-700",
  danger:
    "bg-red-600 text-white hover:bg-red-500",
  success:
    "bg-emerald-500 text-black hover:bg-emerald-400",
  ghost:
    "bg-transparent text-cyan-300 hover:bg-slate-900",
};

const sizes: Record<
  ButtonSize,
  string
> = {
  sm: "px-3 py-2 text-sm",
  md: "px-5 py-3",
  lg: "px-7 py-4 text-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={loading || disabled}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        font-semibold
        transition
        duration-200
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-cyan-400
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
          aria-hidden="true"
        />
      )}

      {loading
        ? "Cargando..."
        : children}
    </button>
  );
}
