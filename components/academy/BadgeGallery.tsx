"use client";

import {
  academyBadges,
} from "@/lib/academy";

const unlockedBadges = [
  "first-course",
  "ai-student",
];

export function BadgeGallery() {
  return (
    <section className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
          VYRO Academy
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          Mis insignias
        </h2>

        <p className="mt-2 text-gray-600">
          Desbloquea logros completando cursos,
          obteniendo excelentes resultados y
          participando en el ecosistema VYRO.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {academyBadges.map((badge) => {
          const unlocked =
            unlockedBadges.includes(
              badge.id,
            );

          return (
            <article
              key={badge.id}
              className={[
                "rounded-2xl border p-6 transition",
                unlocked
                  ? "border-violet-200 bg-violet-50"
                  : "border-gray-200 bg-gray-50 opacity-70",
              ].join(" ")}
            >
              <div className="text-5xl">
                {badge.icon}
              </div>

              <h3 className="mt-4 text-lg font-bold">
                {badge.title}
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                {badge.description}
              </p>

              <div className="mt-5">
                {unlocked ? (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    ✅ Desbloqueada
                  </span>
                ) : (
                  <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-600">
                    🔒 Bloqueada
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
