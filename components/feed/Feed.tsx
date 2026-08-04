"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import VideoCard from "./VideoCard";

import {
  getFeed,
  type FeedVideo,
} from "@/services/feed.service";

export default function Feed() {
  const [videos, setVideos] =
    useState<FeedVideo[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadFeed =
    useCallback(async () => {
      setLoading(true);
      setError("");

      try {
        const data =
          await getFeed();

        setVideos(data);
      } catch (feedError) {
        setError(
          feedError instanceof Error
            ? feedError.message
            : "No fue posible cargar el Feed.",
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadFeed();
  }, [loadFeed]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-cyan-300">
          Cargando VYRO Feed...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-6 text-center text-white">
        <p className="text-red-300">
          {error}
        </p>

        <button
          type="button"
          onClick={() =>
            void loadFeed()
          }
          className="rounded-xl bg-cyan-500 px-5 py-3 font-bold text-black"
        >
          Intentar nuevamente
        </button>
      </main>
    );
  }

  if (videos.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
        <h1 className="text-4xl font-black text-cyan-400">
          VYRO FEED
        </h1>

        <p className="mt-3 text-slate-400">
          Todavía no hay publicaciones.
        </p>
      </main>
    );
  }

  return (
    <section className="h-screen snap-y snap-mandatory overflow-y-scroll bg-black">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          postId={video.id}
          creatorId={
            video.creatorId
          }
          creator={
            video.creatorName
          }
          description={
            video.description
          }
          videoUrl={
            video.videoUrl
          }
          likes={video.likes}
        />
      ))}
    </section>
  );
}
