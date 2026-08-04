"use client";

import {
  BookOpenCheck,
  Clock3,
  LoaderCircle,
  Pencil,
  Trash2,
  Video,
} from "lucide-react";

import LessonEditor from "@/components/academy/LessonEditor";

export type AcademyLessonCardData = {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  content: string | null;
  video_url: string | null;
  duration_minutes: number;
  position: number;
  status: "draft" | "published" | "archived";
  created_at: string;
};

export type LessonChanges = {
  title: string;
  description: string | null;
  content: string | null;
  video_url: string | null;
  duration_minutes: number;
  status: "draft" | "published" | "archived";
};

type LessonCardProps = {
  lesson: AcademyLessonCardData;
  moduleTitle: string;
  busy: boolean;
  editing: boolean;
  onStartEditing: (lessonId: string) => void;
  onCancelEditing: () => void;
  onSave: (
    lessonId: string,
    changes: LessonChanges,
  ) => void;
  onDelete: (lessonId: string) => void;
};

export default function LessonCard({
  lesson,
  moduleTitle,
  busy,
  editing,
  onStartEditing,
  onCancelEditing,
  onSave,
  onDelete,
}: LessonCardProps) {
  if (editing) {
    return (
      <LessonEditor
        lesson={lesson}
        saving={busy}
        onCancel={onCancelEditing}
        onSave={onSave}
      />
    );
  }

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10">
          {lesson.video_url ? (
            <Video
              className="text-cyan-400"
              size={21}
            />
          ) : (
            <BookOpenCheck
              className="text-cyan-400"
              size={21}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                {moduleTitle}
              </p>

              <h3 className="mt-2 text-lg font-black text-white">
                {lesson.title}
              </h3>
            </div>

            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase text-gray-300">
              {lesson.status}
            </span>
          </div>

          <p className="mt-3 text-sm leading-6 text-gray-400">
            {lesson.description ||
              "Lección sin descripción."}
          </p>

          {lesson.content ? (
            <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-gray-500">
              {lesson.content}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="inline-flex items-center gap-2">
              <Clock3 size={16} />
              {lesson.duration_minutes} min
            </span>

            <span>
              Lección {lesson.position}
            </span>

            {lesson.video_url ? (
              <span className="inline-flex items-center gap-2 text-cyan-400">
                <Video size={16} />
                Video conectado
              </span>
            ) : null}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                onStartEditing(lesson.id);
              }}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500/10 px-3 py-2 text-xs font-bold text-cyan-300 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Pencil size={15} />
              Editar
            </button>

            <button
              type="button"
              onClick={() => {
                onDelete(lesson.id);
              }}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs font-bold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? (
                <LoaderCircle
                  className="animate-spin"
                  size={15}
                />
              ) : (
                <Trash2 size={15} />
              )}

              Eliminar
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}