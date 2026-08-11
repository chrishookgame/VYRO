"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

type PublicCreatorProfileProps = {
  userId: string;
};

type PublicProfileData = {
  username: string;
  fullName: string;
  bio: string;
  avatarUrl: string;
  verified: boolean;
  posts: number;
  followers: number;
  following: number;
  likes: number;
};

const initialProfile: PublicProfileData = {
  username: "",
  fullName: "",
  bio: "",
  avatarUrl: "",
  verified: false,
  posts: 0,
  followers: 0,
  following: 0,
  likes: 0,
};

export default function PublicCreatorProfile({
  userId,
}: PublicCreatorProfileProps) {
  const [profile, setProfile] =
    useState<PublicProfileData>(initialProfile);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      setLoading(true);
      setError("");

      const [
        profileResult,
        postsResult,
        followersResult,
        followingResult,
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select(
            "username, full_name, bio, avatar_url, verified",
          )
          .eq("id", userId)
          .single(),

        supabase
          .from("posts")
          .select("id", {
            count: "exact",
            head: true,
          })
          .eq("user_id", userId),

        supabase
          .from("followers")
          .select("follower_id", {
            count: "exact",
            head: true,
          })
          .eq("following_id", userId),

        supabase
          .from("followers")
          .select("following_id", {
            count: "exact",
            head: true,
          })
          .eq("follower_id", userId),
      ]);

      if (!mounted) {
        return;
      }

      if (profileResult.error) {
        setError(
          profileResult.error.message,
        );
        setLoading(false);
        return;
      }

      const {
        count: likesCount,
        error: likesError,
      } = await supabase
        .from("post_likes")
        .select(
          "id, posts!inner(user_id)",
          {
            count: "exact",
            head: true,
          },
        )
        .eq(
          "posts.user_id",
          userId,
        );

      if (!mounted) {
        return;
      }

      if (likesError) {
        console.error(
          "VYRO public profile likes error:",
          likesError,
        );
      }

      const row =
        profileResult.data;

      setProfile({
        username:
          row.username ?? "usuario",
        fullName:
          row.full_name ?? "",
        bio:
          row.bio ?? "",
        avatarUrl:
          row.avatar_url ?? "",
        verified:
          row.verified ?? false,
        posts:
          postsResult.count ?? 0,
        followers:
          followersResult.count ?? 0,
        following:
          followingResult.count ?? 0,
        likes:
          likesCount ?? 0,
      });

      setLoading(false);
    }

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, [userId]);

  if (loading) {
    return (
      <section className="rounded-3xl border border-cyan-500/20 bg-white/5 p-8 text-white">
        Cargando perfil...
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-red-200">
        No fue posible cargar este perfil.
      </section>
    );
  }

  return (
    <section className="w-full max-w-4xl rounded-3xl border border-cyan-500/20 bg-white/5 p-8 text-white backdrop-blur-xl">
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
        <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-cyan-400 bg-cyan-500/20 text-4xl font-black text-cyan-300">
          {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt={profile.username}
              width={128}
              height={128}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            profile.username
              .charAt(0)
              .toUpperCase()
          )}
        </div>

        <div className="min-w-0 flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <h1 className="text-3xl font-black">
              @{profile.username}
            </h1>

            {profile.verified ? (
              <span className="rounded-full bg-cyan-500 px-3 py-1 text-xs font-black text-black">
                VERIFICADO
              </span>
            ) : null}
          </div>

          {profile.fullName ? (
            <p className="mt-2 text-lg text-slate-300">
              {profile.fullName}
            </p>
          ) : null}

          <p className="mt-5 max-w-2xl text-slate-300">
            {profile.bio ||
              "Este creador todavía no ha agregado una biografía."}
          </p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat
          label="Posts"
          value={profile.posts}
        />

        <Stat
          label="Seguidores"
          value={profile.followers}
        />

        <Stat
          label="Siguiendo"
          value={profile.following}
        />

        <Stat
          label="Likes"
          value={profile.likes}
        />
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-5 text-center">
      <p className="text-3xl font-black text-cyan-300">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-400">
        {label}
      </p>
    </div>
  );
}
