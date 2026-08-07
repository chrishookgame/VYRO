"use client";

interface ConfettiLayerProps {
  intense?: boolean;
}

export default function ConfettiLayer({
  intense = false,
}: ConfettiLayerProps) {
  const particleCount =
    intense
      ? 44
      : 24;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {Array.from({
        length:
          particleCount,
      }).map(
        (_, index) => {
          const left =
            (index * 37) %
            100;

          const top =
            (index * 61) %
            100;

          const delay =
            (index % 12) *
            90;

          const duration =
            900 +
            (index % 7) *
              140;

          const size =
            5 +
            (index % 4) *
              2;

          return (
            <span
              key={index}
              className="absolute animate-pulse rounded-sm bg-yellow-200/80"
              style={{
                left:
                  `${left}%`,
                top:
                  `${top}%`,
                width:
                  `${size}px`,
                height:
                  `${Math.max(
                    3,
                    size - 2,
                  )}px`,
                animationDelay:
                  `${delay}ms`,
                animationDuration:
                  `${duration}ms`,
                transform:
                  `rotate(${(index * 29) % 180}deg)`,
              }}
            />
          );
        },
      )}
    </div>
  );
}
