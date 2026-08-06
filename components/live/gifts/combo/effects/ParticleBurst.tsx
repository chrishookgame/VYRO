"use client";

interface ParticleBurstProps {
  symbols: string[];
  count?: number;
}

export default function ParticleBurst({
  symbols,
  count = 24,
}: ParticleBurstProps) {
  if (
    symbols.length === 0 ||
    count <= 0
  ) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[97] overflow-hidden"
    >
      {Array.from(
        {
          length: count,
        },
        (_, index) => {
          const symbol =
            symbols[
              index % symbols.length
            ];

          const left =
            (index * 41) % 100;

          const top =
            (index * 29) % 100;

          const delay =
            (index % 9) * 90;

          return (
            <span
              key={`${symbol}-${index}`}
              className="absolute animate-pulse text-2xl opacity-80"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                animationDelay:
                  `${delay}ms`,
              }}
            >
              {symbol}
            </span>
          );
        },
      )}
    </div>
  );
}
