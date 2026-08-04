"use client";

import {
  BookOpenCheck,
  LoaderCircle,
  Plus,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import LessonCard, {
  type AcademyLessonCardData,
  type LessonChanges,
} from "@/components/academy/LessonCard";
import { supabase } from "@/lib/supabase";

type AcademyModule = {
  id: string;
  title: string;
  position: number;
};

type AcademyLesson = AcademyLessonCardData;

type CourseLessonsProps = {
  courseId: string;
};

export default function CourseLessons({
  courseId,
}: CourseLessonsProps) {
  const [modules, setModules] = useState<AcademyModule[]>([]);
  const [lessons, setLessons] = useState<AcademyLesson[]>([]);

  const [moduleId, setModuleId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState("0");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [busyLessonId, setBusyLessonId] =
    useState<string | null>(null);

  const [editingLessonId, setEditingLessonId] =
    useState<string | null>(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadCourseContent = useCallback(async () => {
    setLoading(true);
    setError("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setModules([]);
      setLessons([]);
      setLoading(false);
      setError(
        "Debes iniciar sesión para ver las lecciones.",
      );
      return;
    }

    const [
      { data: moduleData, error: modulesError },
      { data: lessonData, error: lessonsError },
    ] = await Promise.all([
      supabase
        .from("academy_modules")
        .select("id, title, position")
        .eq("course_id", courseId)
        .eq("user_id", user.id)
        .order("position", {
          ascending: true,
        }),

      supabase
        .from("academy_lessons")
        .select(
          "id, module_id, title, description, content, video_url, duration_minutes, position, status, created_at",
        )
        .eq("course_id", courseId)
        .eq("user_id", user.id)
        .order("position", {
          ascending: true,
        }),
    ]);

    if (modulesError) {
      console.error(
        "VYRO could not load academy modules:",
        modulesError,
      );

      setModules([]);
      setLessons([]);
      setLoading(false);
      setError("No fue posible cargar los módulos.");
      return;
    }

    if (lessonsError) {
      console.error(
        "VYRO could not load academy lessons:",
        lessonsError,
      );

      setModules([]);
      setLessons([]);
      setLoading(false);
      setError("No fue posible cargar las lecciones.");
      return;
    }

    const loadedModules =
      (moduleData ?? []) as AcademyModule[];

    setModules(loadedModules);
    setLessons((lessonData ?? []) as AcademyLesson[]);

    if (loadedModules.length > 0) {
      setModuleId((currentModuleId) =>
        currentModuleId || loadedModules[0].id,
      );
    }

    setLoading(false);
  }, [courseId]);

  useEffect(() => {
    void loadCourseContent();
  }, [loadCourseContent]);

  async function createLesson(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
    const cleanContent = content.trim();
    const cleanVideoUrl = videoUrl.trim();
    const durationMinutes = Number(duration);

    if (!moduleId) {
      setError(
        "Primero debes crear o seleccionar un módulo.",
      );
      return;
    }

    if (!cleanTitle) {
      setError("Escribe un nombre para la lección.");
      return;
    }

    if (
      Number.isNaN(durationMinutes) ||
      durationMinutes < 0
    ) {
      setError("Escribe una duración válida.");
      return;
    }

    setCreating(true);
    setError("");
    setMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setCreating(false);
      setError(
        "Debes iniciar sesión para crear lecciones.",
      );
      return;
    }

    const lessonsInModule = lessons.filter(
      (lesson) => lesson.module_id === moduleId,
    );

    const nextPosition =
      lessonsInModule.length > 0
        ? Math.max(
            ...lessonsInModule.map(
              (lesson) => lesson.position,
            ),
          ) + 1
        : 1;

    const { data, error: insertError } = await supabase
      .from("academy_lessons")
      .insert({
        module_id: moduleId,
        course_id: courseId,
        user_id: user.id,
        title: cleanTitle,
        description: cleanDescription || null,
        content: cleanContent || null,
        video_url: cleanVideoUrl || null,
        duration_minutes: durationMinutes,
        position: nextPosition,
        status: "draft",
      })
      .select(
        "id, module_id, title, description, content, video_url, duration_minutes, position, status, created_at",
      )
      .single();

    setCreating(false);

    if (insertError || !data) {
      console.error(
        "VYRO academy lesson creation failed:",
        insertError,
      );

      setError("No fue posible crear la lección.");
      return;
    }

    setLessons((currentLessons) => [
      ...currentLessons,
      data as AcademyLesson,
    ]);

    setTitle("");
    setDescription("");
    setContent("");
    setVideoUrl("");
    setDuration("0");
    setMessage("Lección creada correctamente.");
  }

  function startEditingLesson(lessonId: string) {
    setEditingLessonId(lessonId);
    setError("");
    setMessage("");
  }

  function cancelEditingLesson() {
    setEditingLessonId(null);
    setError("");
  }

  async function updateLesson(
    lessonId: string,
    changes: LessonChanges,
  ) {
    setBusyLessonId(lessonId);
    setError("");
    setMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setBusyLessonId(null);
      setError(
        "Debes iniciar sesión para editar lecciones.",
      );
      return;
    }

    const { data, error: updateError } = await supabase
      .from("academy_lessons")
      .update({
        title: changes.title,
        description: changes.description,
        content: changes.content,
        video_url: changes.video_url,
        duration_minutes: changes.duration_minutes,
        status: changes.status,
      })
      .eq("id", lessonId)
      .eq("course_id", courseId)
      .eq("user_id", user.id)
      .select(
        "id, module_id, title, description, content, video_url, duration_minutes, position, status, created_at",
      )
      .single();

    setBusyLessonId(null);

    if (updateError || !data) {
      console.error(
        "VYRO academy lesson update failed:",
        updateError,
      );

      setError("No fue posible actualizar la lección.");
      return;
    }

    setLessons((currentLessons) =>
      currentLessons.map((lesson) =>
        lesson.id === lessonId
          ? (data as AcademyLesson)
          : lesson,
      ),
    );

    setEditingLessonId(null);
    setMessage("Lección actualizada correctamente.");
  }

  async function deleteLesson(lessonId: string) {
    setBusyLessonId(lessonId);
    setError("");
    setMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setBusyLessonId(null);
      setError(
        "Debes iniciar sesión para eliminar lecciones.",
      );
      return;
    }

    const { error: deleteError } = await supabase
      .from("academy_lessons")
      .delete()
      .eq("id", lessonId)
      .eq("course_id", courseId)
      .eq("user_id", user.id);

    setBusyLessonId(null);

    if (deleteError) {
      console.error(
        "VYRO academy lesson deletion failed:",
        deleteError,
      );

      setError("No fue posible eliminar la lección.");
      return;
    }

    setLessons((currentLessons) =>
      currentLessons.filter(
        (lesson) => lesson.id !== lessonId,
      ),
    );

    if (editingLessonId === lessonId) {
      setEditingLessonId(null);
    }

    setMessage("Lección eliminada correctamente.");
  }

  function getModuleTitle(selectedModuleId: string) {
    return (
      modules.find(
        (academyModule) =>
          academyModule.id === selectedModuleId,
      )?.title ?? "Módulo desconocido"
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-[#0B1220] p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10">
          <BookOpenCheck
            className="text-cyan-400"
            size={24}
          />
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
            Course Lessons
          </p>

          <h2 className="mt-1 text-2xl font-black text-white">
            Lecciones del curso
          </h2>
        </div>
      </div>

      <form
        onSubmit={createLesson}
        className="mt-7 space-y-4"
      >
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-300">
            Módulo
          </span>

          <select
            value={moduleId}
            onChange={(event) => {
              setModuleId(event.target.value);
            }}
            disabled={modules.length === 0}
            className="w-full rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none transition focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {modules.length === 0 ? (
              <option value="">
                Primero crea un módulo
              </option>
            ) : (
              modules.map((academyModule) => (
                <option
                  key={academyModule.id}
                  value={academyModule.id}
                >
                  Módulo {academyModule.position}:{" "}
                  {academyModule.title}
                </option>
              ))
            )}
          </select>
        </label>

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
            placeholder="Ejemplo: Saludos básicos en inglés"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
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
            placeholder="Describe qué aprenderá el estudiante."
            className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
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
            rows={5}
            placeholder="Escribe el contenido principal de la lección."
            className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
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
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
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
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            />
          </label>
        </div>

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
          disabled={creating || modules.length === 0}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 font-black text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {creating ? (
            <LoaderCircle
              className="animate-spin"
              size={19}
            />
          ) : (
            <Plus size={19} />
          )}

          {creating
            ? "Creando lección..."
            : "Agregar lección"}
        </button>
      </form>

      {loading ? (
        <div className="flex min-h-48 items-center justify-center">
          <LoaderCircle
            className="animate-spin text-cyan-400"
            size={34}
          />
        </div>
      ) : lessons.length === 0 ? (
        <div className="mt-7 rounded-2xl border border-dashed border-cyan-500/20 bg-white/[0.02] p-8 text-center">
          <BookOpenCheck
            className="mx-auto text-cyan-400"
            size={38}
          />

          <h3 className="mt-4 text-lg font-black text-white">
            No hay lecciones todavía
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            Crea la primera lección dentro de uno de tus módulos.
          </p>
        </div>
      ) : (
        <div className="mt-7 space-y-4">
          {lessons.map((lesson) => {
            const isBusy =
              busyLessonId === lesson.id;

            const isEditing =
              editingLessonId === lesson.id;

            return (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                moduleTitle={getModuleTitle(
                  lesson.module_id,
                )}
                busy={isBusy}
                editing={isEditing}
                onStartEditing={startEditingLesson}
                onCancelEditing={cancelEditingLesson}
                onSave={(lessonId, changes) => {
                  void updateLesson(
                    lessonId,
                    changes,
                  );
                }}
                onDelete={(lessonId) => {
                  void deleteLesson(lessonId);
                }}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}