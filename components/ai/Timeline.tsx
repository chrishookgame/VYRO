"use client";

type TimelineItem = {
  id: number | string;
  title: string;
  duration: number;
};

type TimelineProps = {
  items: TimelineItem[];
};

function formatDuration(duration: number): string {
  const safeDuration = Math.max(0, Math.round(duration));

  const minutes = Math.floor(safeDuration / 60);
  const seconds = safeDuration % 60;

  if (minutes === 0) {
    return `${seconds}s`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function Timeline({ items }: TimelineProps) {
  const totalDuration = items.reduce(
    (total, item) => total + Math.max(0, item.duration),
    0,
  );

  return (
    <section
      aria-labelledby="timeline-title"
      className="rounded-2xl border border-cyan-700 bg-slate-900 p-6"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2
          id="timeline-title"
          className="text-2xl font-bold text-cyan-400"
        >
          Timeline
        </h2>

        <span className="rounded-lg bg-slate-800 px-3 py-1 text-sm text-gray-300">
          Total: {formatDuration(totalDuration)}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl bg-slate-800 p-6 text-center text-gray-400">
          No hay escenas disponibles.
        </div>
      ) : (
        <ol className="space-y-3">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-xl bg-slate-800 p-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-950 text-sm font-semibold text-cyan-300">
                  {index + 1}
                </span>

                <span className="truncate text-white">
                  {item.title || "Escena sin título"}
                </span>
              </div>

              <span className="shrink-0 rounded-lg bg-cyan-600 px-3 py-1 text-sm font-medium text-white">
                {formatDuration(item.duration)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}