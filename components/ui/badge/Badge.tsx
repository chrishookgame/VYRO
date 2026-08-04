import type {
  HTMLAttributes,
} from "react";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "premium";

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variants: Record<
  BadgeVariant,
  string
> = {
  default:
    "border-slate-700 bg-slate-800 text-slate-200",
  success:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  warning:
    "border-amber-500/30 bg-amber-500/10 text-amber-300",
  danger:
    "border-red-500/30 bg-red-500/10 text-red-300",
  info:
    "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  premium:
    "border-yellow-400/40 bg-yellow-400/10 text-yellow-300",
};

export default function Badge({
  variant = "default",
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={`
        inline-flex
        items-center
        rounded-full
        border
        px-3
        py-1
        text-xs
        font-semibold
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
