"use client";

interface ParticleSystemProps {
  symbols: string[];
  count?: number;
}

export default function ParticleSystem({
  symbols,
  count = 18,
}: ParticleSystemProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
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
            (index * 37) % 100;

          const top =
            (index * 53) % 100;

          const delay =
            (index % 7) * 120;

          return (
            <span
              key={`${symbol}-${index}`}
              className="absolute animate-pulse text-xl opacity-70"
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
