"use client";

import { FolderPlus, LoaderCircle } from "lucide-react";
import { useState } from "react";

import { supabase } from "@/lib/supabase";

type ProjectModule =
  | "creator"
  | "live"
  | "feed"
  | "connect"
  | "academy"
  | "business"
  | "marketplace";

type CreateProjectFormProps = {
  onProjectCreated?: () => void;
};

export default function CreateProjectForm({
  onProjectCreated,
}: CreateProjectFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [module, setModule] = useState<ProjectModule>("creator");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!title.trim()) {
      setError("Escribe un nombre para el proyecto.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);
      setError("Debes iniciar sesión para crear un proyecto.");
      return;
    }

    const { error: insertError } = await supabase
      .from("projects")
      .insert({
        user_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        module,
        status: "active",
        progress: 0,
      });

    setLoading(false);

    if (insertError) {
      console.error("VYRO project creation failed:", insertError);
      setError("No fue posible crear el proyecto.");
      return;
    }

    setTitle("");
    setDescription("");
    setModule("creator");
    setMessage("Proyecto creado correctamente en VYRO.");

    onProjectCreated?.();
  }

  return (
    <section className="rounded-3xl border border-cyan-500/20 bg-[#0B1220] p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10">
          <FolderPlus className="text-cyan-400" size={24} />
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
            VYRO Projects
          </p>

          <h2 className="mt-1 text-2xl font-black text-white">
            Crear nuevo proyecto
          </h2>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-7 space-y-5"
      >
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-300">
            Nombre del proyecto
          </span>

          <input
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
            placeholder="Ejemplo: Curso de inteligencia artificial"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-300">
            Módulo
          </span>

          <select
            value={module}
            onChange={(event) => {
              setModule(event.target.value as ProjectModule);
            }}
            className="w-full rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          >
            <option value="creator">Creator Studio</option>
            <option value="live">VYRO Live</option>
            <option value="feed">Social Feed</option>
            <option value="connect">VYRO Connect</option>
            <option value="academy">VYRO Academy</option>
            <option value="business">VYRO Business</option>
            <option value="marketplace">Marketplace</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-300">
            Descripción
          </span>

          <textarea
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
            rows={4}
            placeholder="Describe el objetivo principal del proyecto."
            className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
          />
        </label>

        {error ? (
          <p
            role="alert"
            className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          >
            {error}
          </p>
        ) : null}

        {message ? (
          <p
            aria-live="polite"
            className="rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-200"
          >
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-cyan-500 py-4 font-black text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <LoaderCircle className="animate-spin" size={20} />
              Creando proyecto...
            </>
          ) : (
            <>
              <FolderPlus size={20} />
              Crear proyecto
            </>
          )}
        </button>
      </form>
    </section>
  );
}