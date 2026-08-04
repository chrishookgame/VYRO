import type {
  HTMLAttributes,
} from "react";

export interface AvatarProps
  extends HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-16 w-16 text-xl",
  xl: "h-24 w-24 text-3xl",
};

export default function Avatar({
  src,
  alt = "Avatar",
  name = "VYRO",
  size = "md",
  className = "",
  ...props
}: AvatarProps) {
  const initial =
    name.trim().charAt(0).toUpperCase() ||
    "V";

  return (
    <div
      {...props}
      role="img"
      aria-label={alt}
      className={`
        flex
        shrink-0
        items-center
        justify-center
        overflow-hidden
        rounded-full
        border
        border-cyan-400/40
        bg-slate-800
        font-bold
        text-cyan-300
        ${sizes[size]}
        ${className}
      `}
      style={
        src
          ? {
              backgroundImage:
                `url("${src}")`,
              backgroundPosition:
                "center",
              backgroundSize:
                "cover",
            }
          : props.style
      }
    >
      {!src && initial}
    </div>
  );
}
