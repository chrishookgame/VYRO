import type {
  ReactNode,
} from "react";

export type TooltipProps = {
  content: string;
  children: ReactNode;
};

export default function Tooltip({
  content,
  children,
}: TooltipProps) {
  return (
    <span className="group relative inline-flex">
      {children}

      <span
        role="tooltip"
        className="
          pointer-events-none
          absolute
          bottom-full
          left-1/2
          z-40
          mb-2
          hidden
          -translate-x-1/2
          whitespace-nowrap
          rounded-lg
          bg-black
          px-3
          py-2
          text-xs
          text-white
          shadow-xl
          group-hover:block
          group-focus-within:block
        "
      >
        {content}
      </span>
    </span>
  );
}
