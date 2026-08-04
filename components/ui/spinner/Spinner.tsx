import type {
  HTMLAttributes,
} from "react";

export interface SpinnerProps
  extends HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg";
  label?: string;
}

const sizes = {
  sm: "h-4 w-4",
  md: "h-7 w-7",
  lg: "h-12 w-12",
};

export default function Spinner({
  size = "md",
  label = "Cargando",
  className = "",
  ...props
}: SpinnerProps) {
  return (
    <span
      {...props}
      role="status"
      aria-label={label}
      className={`
        inline-block
        animate-spin
        rounded-full
        border-2
        border-cyan-400
        border-r-transparent
        ${sizes[size]}
        ${className}
      `}
    />
  );
}
