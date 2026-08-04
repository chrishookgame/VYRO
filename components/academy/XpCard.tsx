"use client";

import {
  calculateStudentXp,
} from "@/lib/academy";

export function XpCard() {
  const xp =
    calculateStudentXp(1350);

  return (
    <section className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
            VYRO XP
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Nivel {xp.level}
          </h2>

          <p className="mt-2 text-gray-600">
            {xp.totalXp} XP acumulados
          </p>
        </div>

        <div className="rounded-full bg-violet-100 px-5 py-3 text-3xl">
          ⭐
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-2 flex justify-between text-sm">
          <span>
            Progreso del nivel
          </span>

          <span>
            {xp.progress}%
          </span>
        </div>

        <div className="h-4 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-violet-600 transition-all"
            style={{
              width: `${xp.progress}%`,
            }}
          />
        </div>

        <p className="mt-4 text-sm text-gray-600">
          {xp.currentLevelXp} / {xp.nextLevelXp} XP para el siguiente nivel
        </p>
      </div>
    </section>
  );
}
