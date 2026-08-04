"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type StorageVideo = {
  name: string;
  id?: string | null;
};

export default function UploadVideo() {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [caption, setCaption] =
    useState("");

  const [videos, setVideos] =
    useState<StorageVideo[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [loadingVideos, setLoadingVideos] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const loadVideos =
    useCallback(async () => {
      setLoadingVideos(true);

      const {
        data: { user },
        error: userError,
      } =
        await supabase.auth.getUser();

      if (userError || !user) {
        setVideos([]);
        setLoadingVideos(false);
        return;
      }

      const { data, error } =
        await supabase.storage
          .from("videos")
          .list(user.id, {
            limit: 100,
            sortBy: {
              column: "created_at",
              order: "desc",
            },
          });

      if (error) {
        console.error(
          "VYRO could not load videos:",
          error,
        );

        setMessage(
          "No fue posible cargar tus videos.",
        );

        setVideos([]);
        setLoadingVideos(false);
        return;
      }

      setVideos(data ?? []);
      setLoadingVideos(false);
    }, []);

  useEffect(() => {
    void loadVideos();
  }, [loadVideos]);

  async function handleUpload() {
    const file =
      fileInputRef.current
        ?.files?.[0];

    if (!file) {
      setMessage(
        "Selecciona un video.",
      );

      return;
    }

    if (
      !file.type.startsWith(
        "video/",
      )
    ) {
      setMessage(
        "El archivo seleccionado no es un video válido.",
      );

      return;
    }

    const {
      data: { user },
      error: userError,
    } =
      await supabase.auth.getUser();

    if (userError || !user) {
      setMessage(
        "Debes iniciar sesión para subir videos.",
      );

      return;
    }

    setLoading(true);
    setMessage("");

    const safeFileName =
      file.name.replace(
        /[^a-zA-Z0-9._-]/g,
        "-",
      );

    const filePath =
      `${user.id}/${Date.now()}-${safeFileName}`;

    const {
      error: uploadError,
    } =
      await supabase.storage
        .from("videos")
        .upload(
          filePath,
          file,
          {
            cacheControl:
              "3600",
            upsert: false,
          },
        );

    if (uploadError) {
      console.error(
        "VYRO upload failed:",
        uploadError,
      );

      setMessage(
        uploadError.message,
      );

      setLoading(false);
      return;
    }

    const {
      data: publicUrlData,
    } =
      supabase.storage
        .from("videos")
        .getPublicUrl(
          filePath,
        );

    const videoUrl =
      publicUrlData.publicUrl;

    const {
      error: postError,
    } =
      await supabase
        .from("posts")
        .insert({
          user_id:
            user.id,
          caption:
            caption.trim(),
          video_url:
            videoUrl,
          likes: 0,
        });

    if (postError) {
      console.error(
        "VYRO post creation failed:",
        postError,
      );

      await supabase.storage
        .from("videos")
        .remove([
          filePath,
        ]);

      setMessage(
        `El video se subió, pero no pudo publicarse: ${postError.message}`,
      );

      setLoading(false);
      return;
    }

    setMessage(
      "Video publicado correctamente en VYRO.",
    );

    setCaption("");

    if (
      fileInputRef.current
    ) {
      fileInputRef.current.value =
        "";
    }

    await loadVideos();

    setLoading(false);
  }

  return (
    <section className="mx-auto max-w-5xl p-8">
      <header className="mb-8">
        <p className="font-bold uppercase tracking-[0.3em] text-cyan-400">
          VYRO Creator Studio
        </p>

        <h1 className="mt-3 text-4xl font-black text-white">
          Publicar video
        </h1>

        <p className="mt-3 text-gray-400">
          Sube tu contenido y publícalo directamente en el Feed.
        </p>
      </header>

      <div className="mb-10 rounded-3xl border border-cyan-500/20 bg-[#0B1220] p-6">
        <label
          htmlFor="vyro-caption"
          className="mb-3 block font-semibold text-white"
        >
          Descripción
        </label>

        <textarea
          id="vyro-caption"
          value={caption}
          onChange={(event) =>
            setCaption(
              event.target.value,
            )
          }
          disabled={loading}
          maxLength={500}
          placeholder="Escribe una descripción para tu publicación..."
          className="mb-5 min-h-28 w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none placeholder:text-gray-500 focus:border-cyan-500/50 disabled:opacity-60"
        />

        <label
          htmlFor="vyro-video-upload"
          className="mb-3 block font-semibold text-white"
        >
          Seleccionar video
        </label>

        <input
          id="vyro-video-upload"
          ref={fileInputRef}
          type="file"
          accept="video/*"
          disabled={loading}
          className="block w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:font-bold file:text-black disabled:opacity-60"
        />

        <button
          type="button"
          onClick={() =>
            void handleUpload()
          }
          disabled={loading}
          className="mt-5 rounded-xl bg-cyan-500 px-6 py-3 font-bold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Publicando..."
            : "Publicar video"}
        </button>

        {message ? (
          <p
            aria-live="polite"
            className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300"
          >
            {message}
          </p>
        ) : null}
      </div>

      <div>
        <h2 className="mb-5 text-2xl font-bold text-white">
          Videos subidos
        </h2>

        {loadingVideos ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-gray-400">
            Cargando videos...
          </div>
        ) : videos.length ===
          0 ? (
          <div className="rounded-2xl border border-dashed border-cyan-500/20 bg-[#0B1220] p-8 text-center text-gray-400">
            Todavía no has subido videos.
          </div>
        ) : (
          <div className="space-y-3">
            {videos.map(
              (video) => (
                <div
                  key={
                    video.id ??
                    video.name
                  }
                  className="rounded-2xl border border-white/10 bg-[#0B1220] p-4"
                >
                  <span className="block truncate text-white">
                    {video.name}
                  </span>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}
