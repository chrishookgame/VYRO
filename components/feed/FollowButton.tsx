"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Check,
  UserPlus,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type FollowButtonProps = {
  creatorId: string;
  onAuthRequired?: () => void;
  ownLabel?: string | null;
};

export default function FollowButton({
  creatorId,
  onAuthRequired,
  ownLabel = "Tu publicación",
}: FollowButtonProps) {
  const [currentUserId, setCurrentUserId] =
    useState<string | null>(null);

  const [following, setFollowing] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let mounted = true;

    async function loadFollowState() {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!mounted) {
        return;
      }

      if (userError || !user) {
        setCurrentUserId(null);
        setLoading(false);
        return;
      }

      setCurrentUserId(user.id);

      if (user.id === creatorId) {
        setLoading(false);
        return;
      }

      const {
        data,
        error: followError,
      } = await supabase
        .from("followers")
        .select("follower_id")
        .eq("follower_id", user.id)
        .eq("following_id", creatorId)
        .maybeSingle();

      if (!mounted) {
        return;
      }

      if (followError) {
        console.error(
          "VYRO follow state error:",
          followError,
        );

        setError(
          "No se pudo comprobar el seguimiento.",
        );
      }

      setFollowing(Boolean(data));
      setLoading(false);
    }

    void loadFollowState();

    return () => {
      mounted = false;
    };
  }, [creatorId]);

  async function toggleFollow() {
    if (!currentUserId) {
      if (onAuthRequired) {
        onAuthRequired();
      } else {
        window.alert(
          "Debes iniciar sesión para seguir creadores.",
        );
      }

      return;
    }

    if (
      currentUserId === creatorId ||
      loading
    ) {
      return;
    }

    const previousFollowing =
      following;

    setFollowing(
      !previousFollowing,
    );

    setLoading(true);
    setError("");

    if (previousFollowing) {
      const { error: deleteError } =
        await supabase
          .from("followers")
          .delete()
          .eq(
            "follower_id",
            currentUserId,
          )
          .eq(
            "following_id",
            creatorId,
          );

      if (deleteError) {
        console.error(
          "VYRO unfollow error:",
          deleteError,
        );

        setFollowing(
          previousFollowing,
        );

        setError(
          deleteError.message,
        );
      }
    } else {
      const { error: insertError } =
        await supabase
          .from("followers")
          .insert({
            follower_id:
              currentUserId,
            following_id:
              creatorId,
          });

      if (insertError) {
        console.error(
          "VYRO follow error:",
          insertError,
        );

        setFollowing(
          previousFollowing,
        );

        setError(
          insertError.message,
        );
      }
    }

    setLoading(false);
  }

  if (
    currentUserId === creatorId
  ) {
    if (!ownLabel) {
      return null;
    }

    return (
      <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-slate-300">
        {ownLabel}
      </span>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() =>
          void toggleFollow()
        }
        disabled={loading}
        className={
          following
            ? "inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/20 px-4 py-2 text-sm font-bold text-cyan-200 transition hover:bg-cyan-500/30 disabled:opacity-60"
            : "inline-flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-2 text-sm font-black text-black transition hover:bg-cyan-400 disabled:opacity-60"
        }
      >
        {following ? (
          <Check size={17} />
        ) : (
          <UserPlus size={17} />
        )}

        {loading
          ? "Cargando..."
          : following
            ? "Siguiendo"
            : "Seguir"}
      </button>

      {error ? (
        <p className="mt-2 text-xs text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
