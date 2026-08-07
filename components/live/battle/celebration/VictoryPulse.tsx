"use client";

interface VictoryPulseProps {
  intense?: boolean;
}

export default function VictoryPulse({
  intense = false,
}: VictoryPulseProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
    >
      <div
        className={[
          "absolute rounded-full border border-yellow-300/30 bg-yellow-300/[0.06]",
          "animate-ping",
          intense
            ? "h-[36rem] w-[36rem]"
            : "h-[24rem] w-[24rem]",
        ].join(" ")}
      />

      <div
        className={[
          "absolute rounded-full border border-fuchsia-300/20 bg-fuchsia-400/[0.05]",
          "animate-pulse",
          intense
            ? "h-[48rem] w-[48rem]"
            : "h-[32rem] w-[32rem]",
        ].join(" ")}
      />
    </div>
  );
}
