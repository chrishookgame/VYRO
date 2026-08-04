"use client";

import {
  getAcademyRewards,
} from "@/lib/academy";

export function RewardPanel() {
  const rewards =
    getAcademyRewards();

  return (
    <section className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
          Recompensas
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          Cómo ganar puntos
        </h2>
      </div>

      <div className="space-y-4">
        {rewards.map((reward) => (
          <div
            key={reward.reason}
            className="flex items-center justify-between rounded-xl border p-4"
          >
            <span className="font-medium">
              {reward.reason}
            </span>

            <span className="rounded-full bg-violet-100 px-3 py-1 font-bold text-violet-700">
              +{reward.points}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
