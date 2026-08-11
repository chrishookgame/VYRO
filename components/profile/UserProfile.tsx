"use client";

import {
  ChangeEvent,
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import { supabase } from "@/lib/supabase";

type ProfileData = {
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

type EditableProfile = {
  username: string;
  fullName: string;
  bio: string;
};

const initialProfile: ProfileData = {
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

const initialEditableProfile: EditableProfile = {
  username: "",
  fullName: "",
  bio: "",
};

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

const ALLOWED_AVATAR_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function UserProfile() {
  const [profile, setProfile] =
    useState<ProfileData>(
      initialProfile,
    );

  const [form, setForm] =
    useState<EditableProfile>(
      initialEditableProfile,
    );

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploadingAvatar, setUploadingAvatar] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (
        userError ||
        !user
      ) {
        if (mounted) {
          setError(
            "No fue posible cargar el usuario.",
          );
          setLoading(false);
        }

        return;
      }

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
          .eq("id", user.id)
          .single(),

        supabase
          .from("posts")
          .select("id", {
            count: "exact",
            head: true,
          })
          .eq("user_id", user.id),

        supabase
          .from("followers")
          .select("follower_id", {
            count: "exact",
            head: true,
          })
          .eq(
            "following_id",
            user.id,
          ),

        supabase
          .from("followers")
          .select("following_id", {
            count: "exact",
            head: true,
          })
          .eq(
            "follower_id",
            user.id,
          ),
      ]);

      if (profileResult.error) {
        if (mounted) {
          setError(
            profileResult.error.message,
          );
          setLoading(false);
        }

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
          user.id,
        );

      if (likesError) {
        console.error(
          "VYRO profile likes error:",
          likesError,
        );
      }

      if (!mounted) {
        return;
      }

      const row =
        profileResult.data;

      const username =
        row.username ??
        "usuario";

      const fullName =
        row.full_name ??
        "";

      const bio =
        row.bio ??
        "";

      setEmail(
        user.email ?? "",
      );

      setProfile({
        username,
        fullName,
        bio,
        avatarUrl:
          row.avatar_url ??
          "",
        verified:
          row.verified ??
          false,
        posts:
          postsResult.count ??
          0,
        followers:
          followersResult.count ??
          0,
        following:
          followingResult.count ??
          0,
        likes:
          likesCount ??
          0,
      });

      setForm({
        username,
        fullName,
        bio,
      });

      setLoading(false);
    }

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  async function saveProfile() {
    setError("");
    setSuccess("");

    const username =
      form.username
        .trim()
        .replace(/^@+/, "");

    const fullName =
      form.fullName.trim();

    const bio =
      form.bio.trim();

    if (!username) {
      setError(
        "El nombre de usuario es obligatorio.",
      );
      return;
    }

    if (username.length > 40) {
      setError(
        "El nombre de usuario es demasiado largo.",
      );
      return;
    }

    setSaving(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (
      userError ||
      !user
    ) {
      setError(
        "No fue posible verificar tu sesión.",
      );
      setSaving(false);
      return;
    }

    const { error: updateError } =
      await supabase
        .from("profiles")
        .update({
          username,
          full_name:
            fullName || null,
          bio:
            bio || null,
        })
        .eq("id", user.id);

    if (updateError) {
      setError(
        updateError.message,
      );
      setSaving(false);
      return;
    }

    setProfile((current) => ({
      ...current,
      username,
      fullName,
      bio,
    }));

    setForm({
      username,
      fullName,
      bio,
    });

    setEditing(false);
    setSaving(false);

    setSuccess(
      "Perfil actualizado correctamente.",
    );
  }

  async function handleAvatarChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    setError("");
    setSuccess("");

    if (
      !ALLOWED_AVATAR_TYPES.includes(
        file.type,
      )
    ) {
      setError(
        "La foto debe ser JPG, PNG o WebP.",
      );
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setError(
        "La foto no puede superar los 5 MB.",
      );
      return;
    }

    setUploadingAvatar(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (
      userError ||
      !user
    ) {
      setError(
        "No fue posible verificar tu sesión.",
      );
      setUploadingAvatar(false);
      return;
    }

    const avatarPath =
      `${user.id}/avatar`;

    const {
      error: uploadError,
    } = await supabase.storage
      .from("avatars")
      .upload(
        avatarPath,
        file,
        {
          cacheControl: "3600",
          contentType: file.type,
          upsert: true,
        },
      );

    if (uploadError) {
      setError(
        `No fue posible subir la foto: ${uploadError.message}`,
      );
      setUploadingAvatar(false);
      return;
    }

    const {
      data: publicUrlData,
    } = supabase.storage
      .from("avatars")
      .getPublicUrl(
        avatarPath,
      );

    const avatarUrl =
      `${publicUrlData.publicUrl}?v=${Date.now()}`;

    const {
      error: profileUpdateError,
    } = await supabase
      .from("profiles")
      .update({
        avatar_url: avatarUrl,
      })
      .eq("id", user.id);

    if (profileUpdateError) {
      setError(
        `La foto fue subida, pero no se pudo actualizar el perfil: ${profileUpdateError.message}`,
      );
      setUploadingAvatar(false);
      return;
    }

    setProfile((current) => ({
      ...current,
      avatarUrl,
    }));

    setUploadingAvatar(false);

    setSuccess(
      "Foto de perfil actualizada correctamente.",
    );
  }

  function cancelEditing() {
    setForm({
      username: profile.username,
      fullName: profile.fullName,
      bio: profile.bio,
    });

    setError("");
    setSuccess("");
    setEditing(false);
  }

  if (loading) {
    return (
      <section className="rounded-3xl border border-cyan-500/20 bg-white/5 p-8 text-white">
        Cargando perfil...
      </section>
    );
  }

  if (error && !profile.username) {
    return (
      <section className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-red-200">
        {error}
      </section>
    );
  }

  return (
    <section className="w-full max-w-4xl rounded-3xl border border-cyan-500/20 bg-white/5 p-8 text-white backdrop-blur-xl">
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
        <div className="flex flex-col items-center gap-3">
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

          <label
            className={`cursor-pointer rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-black text-cyan-300 transition hover:bg-cyan-500/20 ${
              uploadingAvatar
                ? "pointer-events-none opacity-50"
                : ""
            }`}
          >
            {uploadingAvatar
              ? "Subiendo..."
              : profile.avatarUrl
                ? "Cambiar foto"
                : "Añadir foto"}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => {
                void handleAvatarChange(event);
              }}
              disabled={uploadingAvatar}
              className="hidden"
            />
          </label>

          <p className="text-center text-xs text-slate-500">
            JPG, PNG o WebP · máximo 5 MB
          </p>
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

          <p className="mt-1 text-sm text-slate-500">
            {email}
          </p>

          <p className="mt-5 max-w-2xl text-slate-300">
            {profile.bio ||
              "Este usuario todavía no ha agregado una biografía."}
          </p>

          {!editing ? (
            <button
              type="button"
              onClick={() => {
                setError("");
                setSuccess("");
                setEditing(true);
              }}
              className="mt-6 rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-black text-black transition hover:bg-cyan-400"
            >
              Editar perfil
            </button>
          ) : null}
        </div>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-200">
          {success}
        </div>
      ) : null}

      {editing ? (
        <div className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-6">
          <h2 className="text-xl font-black">
            Editar perfil
          </h2>

          <div className="mt-6 grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-300">
                Nombre
              </span>

              <input
                type="text"
                value={form.fullName}
                onChange={(event) => {
                  setForm((current) => ({
                    ...current,
                    fullName:
                      event.target.value,
                  }));
                }}
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                placeholder="Tu nombre"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-300">
                Usuario
              </span>

              <div className="flex rounded-2xl border border-white/10 bg-black/30 focus-within:border-cyan-400">
                <span className="flex items-center pl-4 text-slate-500">
                  @
                </span>

                <input
                  type="text"
                  value={form.username}
                  onChange={(event) => {
                    setForm((current) => ({
                      ...current,
                      username:
                        event.target.value,
                    }));
                  }}
                  className="min-w-0 flex-1 bg-transparent px-2 py-3 text-white outline-none"
                  placeholder="usuario"
                />
              </div>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-300">
                Biografía
              </span>

              <textarea
                value={form.bio}
                onChange={(event) => {
                  setForm((current) => ({
                    ...current,
                    bio:
                      event.target.value,
                  }));
                }}
                rows={4}
                className="resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                placeholder="Cuéntale a VYRO quién eres..."
              />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                void saveProfile();
              }}
              className="rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-black text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Guardando..."
                : "Guardar cambios"}
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={cancelEditing}
              className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : null}

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
