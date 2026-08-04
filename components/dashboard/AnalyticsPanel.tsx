"use client";

import { BarChart3 } from "lucide-react";

export default function AnalyticsPanel() {
  const stats = [
    {
      label: "Views",
      value: 86,
      color: "bg-cyan-400",
    },
    {
      label: "Engagement",
      value: 74,
      color: "bg-green-400",
    },
    {
      label: "Followers",
      value: 63,
      color: "bg-purple-400",
    },
    {
      label: "AI Score",
      value: 98,
      color: "bg-yellow-400",
    },
  ];

  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-[#0B1220] p-6">

      <div className="flex items-center justify-between">

        <h2 className="text-xl font-bold text-white">
          Analytics
        </h2>

        <BarChart3 className="text-cyan-400" />

      </div>

      <div className="mt-8 space-y-6">

        {stats.map((item) => (
          <div key={item.label}>

            <div className="flex justify-between text-sm mb-2">

              <span className="text-gray-300">
                {item.label}
              </span>

              <span className="text-white font-semibold">
                {item.value}%
              </span>

            </div>

            <div className="h-3 rounded-full bg-white/10 overflow-hidden">

              <div
                className={`${item.color} h-full rounded-full transition-all duration-700`}
                style={{ width: `${item.value}%` }}
              />

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
