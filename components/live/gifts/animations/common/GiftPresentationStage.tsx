"use client";

import type {
  PropsWithChildren,
} from "react";

interface GiftPresentationStageProps
  extends PropsWithChildren {
  className?: string;
}

export default function GiftPresentationStage({
  children,
  className = "",
}: GiftPresentationStageProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[90] overflow-hidden">
      <div
        className={[
          "absolute",
          "inset-x-[2%]",
          "bottom-[4%]",
          "h-[72%]",
          "overflow-hidden",
          "rounded-[2rem]",
          className,
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}