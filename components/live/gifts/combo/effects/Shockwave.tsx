"use client";

interface ShockwaveProps {
  count?: number;
}

export default function Shockwave({
  count = 1,
}: ShockwaveProps) {
  const safeCount = Math.max(
    Math.floor(count),
    0,
  );

  if (safeCount === 0) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[96] flex items-center justify-center overflow-hidden"
    >
      {Array.from(
        {
          length: safeCount,
        },
        (_, index) => (
          <div
            key={index}
            className="absolute h-40 w-40 animate-ping rounded-full border border-white/25"
            style={{
              animationDelay:
                `${index * 180}ms`,
            }}
          />
        ),
      )}
    </div>
  );
}
