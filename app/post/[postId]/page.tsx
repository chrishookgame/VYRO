"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useEffect,
  useState,
} from "react";

import VideoCard from "@/components/feed/VideoCard";
import {
  getPostById,
  type FeedVideo,
} from "@/services/feed.service";

export default function PostPage() {
  const params = useParams<{
    postId: string;
  }>();

  const postId = params.postId;

  const [post, setPost] =
    useState<FeedVideo | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let mounted = true;

    async function loadPost() {
      setLoading(true);
      setError("");

      try {
        const result =
          await getPostById(postId);

        if (!mounted) {
          return;
        }

        setPost(result);
      } catch (postError) {
        if (!mounted) {
          return;
        }

        setError(
          postError instanceof Error
            ? postError.message
            : "No fue posible cargar esta publicación.",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadPost();

    return () => {
      mounted = false;
    };
  }, [postId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-cyan-300">
          Cargando publicación VYRO...
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

        <Link
          href="/feed"
          className="rounded-xl bg-cyan-500 px-5 py-3 font-bold text-black"
        >
          Volver al Feed
        </Link>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-6 text-center text-white">
        <h1 className="text-3xl font-black text-white">
          Publicación no encontrada
        </h1>

        <Link
          href="/feed"
          className="rounded-xl bg-cyan-500 px-5 py-3 font-bold text-black"
        >
          Volver al Feed
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      <VideoCard
        postId={post.id}
        creatorId={post.creatorId}
        creator={post.creatorName}
        description={post.description}
        videoUrl={post.videoUrl}
        likes={post.likes}
        priorityBoost={post.priorityBoost}
      />
    </main>
  );
}