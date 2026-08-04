"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type VideoItem = {
  name: string;
  id?: string;
};

export default function MyVideos() {
  const [videos, setVideos] = useState<VideoItem[]>([]);

  useEffect(() => {
    async function loadVideos() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase.storage
        .from("videos")
        .list(user.id);

      if (error) {
        console.error(error);
        return;
      }

      setVideos((data ?? []) as VideoItem[]);
    }

    void loadVideos();
  }, []);

  return (
    <div className="mt-10">
      <h2 className="mb-4 text-2xl text-white">
        Mis Videos
      </h2>

      {videos.length === 0 ? (
        <p className="text-gray-400">
          No tienes videos todavía.
        </p>
      ) : (
        videos.map((video) => (
          <div
            key={video.name}
            className="border-b border-gray-700 p-2 text-white"
          >
            {video.name}
          </div>
        ))
      )}
    </div>
  );
}