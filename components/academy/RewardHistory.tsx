"use client";

import {
  getAcademyRewardHistory,
} from "@/lib/academy";

export function RewardHistory() {
  const rewards =
    getAcademyRewardHistory();

  return (
    <section className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
          Historial
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          Recompensas obtenidas
        </h2>
      </div>

      {rewards.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
          Aún no existen recompensas registradas.
        </div>
      ) : (
        <div className="space-y-4">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="flex items-center justify-between rounded-xl border p-4"
            >
              <div>
                <p className="font-semibold">
                  {reward.reason}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {new Date(
                    reward.earnedAt,
                  ).toLocaleString("es-CL")}
                </p>
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 font-bold text-green-700">
                +{reward.points}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
