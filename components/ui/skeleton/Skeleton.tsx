import type {
  HTMLAttributes,
} from "react";

export default function Skeleton({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={`
        animate-pulse
        rounded-xl
        bg-slate-800
        ${className}
      `}
    />
  );
}
