"use client";

import { Play, Plus } from "lucide-react";
import VyroButton from "@/components/ui/VyroButton";

export default function RecentVideos() {
  const videos = [
    {
      title: "Summer Campaign.mp4",
      time: "5 min ago",
    },
    {
      title: "Product Demo.mp4",
      time: "2 hours ago",
    },
    {
      title: "Shorts #14.mp4",
      time: "Yesterday",
    },
  ];

  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-[#0B1220] p-6">

      <div className="flex items-center justify-between">

        <h2 className="text-xl font-bold text-white">
          Recent Videos
        </h2>

        <Play className="text-cyan-400" />

      </div>

      <div className="mt-6 space-y-4">

        {videos.map((video, index) => (
          <div
            key={index}
            className="rounded-2xl bg-white/5 p-4 transition hover:bg-white/10"
          >
            <p className="font-semibold text-white">
              {video.title}
            </p>

            <p className="mt-1 text-sm text-gray-400">
              {video.time}
            </p>
          </div>
        ))}

      </div>

      <div className="mt-6">
        <VyroButton className="w-full flex items-center justify-center gap-2">
          <Plus size={18} />
          New Video
        </VyroButton>
      </div>

    </div>
  );
}