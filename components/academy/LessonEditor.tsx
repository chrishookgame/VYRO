"use client";

import {
  LoaderCircle,
  Save,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import type { AcademyLessonCardData } from "@/components/academy/LessonCard";

type LessonEditorProps = {
  lesson: AcademyLessonCardData;
  saving: boolean;
  onCancel: () => void;
  onSave: (
    lessonId: string,
    changes: {
      title: string;
      description: string | null;
      content: string | null;
      video_url: string | null;
      duration_minutes: number;
      status: "draft" | "published" | "archived";
    },
  ) => void;
};

export default function LessonEditor({
  lesson,
  saving,
  onCancel,
  onSave,
}: LessonEditorProps) {
  const [title, setTitle] = useState(lesson.title);
  const [description, setDescription] = useState(
    lesson.description ?? "",
  );
  const [content, setContent] = useState(
    lesson.content ?? "",
  );
  const [videoUrl, setVideoUrl] = useState(
    lesson.video_url ?? "",
  );
  const [duration, setDuration] = useState(
    String(lesson.duration_minutes),
  );
  const [status, setStatus] =
    useState<AcademyLessonCardData["status"]>(
      lesson.status,
    );

  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(lesson.title);
    setDescription(lesson.description ?? "");
    setContent(lesson.content ?? "");
    setVideoUrl(lesson.video_url ?? "");
    setDuration(String(lesson.duration_minutes));
    setStatus(lesson.status);
    setError("");
  }, [lesson]);

  function handleSave() {
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
    const cleanContent = content.trim();
    const cleanVideoUrl = videoUrl.trim();
    const durationMinutes = Number(duration);

    if (!cleanTitle) {
      setError("El título de la lección es obligatorio.");
      return;
    }

    if (
      Number.isNaN(durationMinutes) ||
      durationMinutes < 0
    ) {
      setError(
        "La duración debe ser un número igual o mayor que cero.",
      );
      return;
    }

    setError("");

    onSave(lesson.id, {
      title: cleanTitle,
      description: cleanDescription || null,
      content: cleanContent || null,
      video_url: cleanVideoUrl || null,
      duration_minutes: durationMinutes,
      status,
    });
  }

  return (
    <section className="rounded-2xl border border-cyan-400/30 bg-cyan-500/[0.06] p-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
          Lesson Editor
        </p>

        <h3 className="mt-2 text-xl font-black text-white">
          Editar lección
        </h3>
      </div>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-300">
            Título
          </span>

          <input
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
            disabled={saving}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-cyan-400 disabled:opacity-60"
          />
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
            rows={3}
            disabled={saving}
            className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-cyan-400 disabled:opacity-60"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-300">
            Contenido
          </span>

          <textarea
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
            }}
            rows={7}
            disabled={saving}
            className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-cyan-400 disabled:opacity-60"
          />
        </label>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-300">
              URL del video
            </span>

            <input
              type="url"
              value={videoUrl}
              onChange={(event) => {
                setVideoUrl(event.target.value);
              }}
              placeholder="https://..."
              disabled={saving}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400 disabled:opacity-60"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-300">
              Duración en minutos
            </span>

            <input
              type="number"
              min="0"
              value={duration}
              onChange={(event) => {
                setDuration(event.target.value);
              }}
              disabled={saving}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-cyan-400 disabled:opacity-60"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-300">
            Estado
          </span>

          <select
            value={status}
            onChange={(event) => {
              setStatus(
                event.target
                  .value as AcademyLessonCardData["status"],
              );
            }}
            disabled={saving}
            className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none transition focus:border-cyan-400 disabled:opacity-60"
          >
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
            <option value="archived">Archivado</option>
          </select>
        </label>

        {error ? (
          <p
            role="alert"
            className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          >
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-black text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <LoaderCircle
                className="animate-spin"
                size={18}
              />
            ) : (
              <Save size={18} />
            )}

            {saving ? "Guardando..." : "Guardar cambios"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-bold text-gray-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X size={18} />
            Cancelar
          </button>
        </div>
      </div>
    </section>
  );
}