"use client";

import {
  BookOpen,
  GripVertical,
  LoaderCircle,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

type AcademyModule = {
  id: string;
  title: string;
  description: string | null;
  position: number;
  progress: number;
  created_at: string;
};

type CourseModulesProps = {
  courseId: string;
};

export default function CourseModules({
  courseId,
}: CourseModulesProps) {
  const [modules, setModules] = useState<AcademyModule[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [busyModuleId, setBusyModuleId] =
    useState<string | null>(null);

  const [editingModuleId, setEditingModuleId] =
    useState<string | null>(null);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadModules = useCallback(async () => {
    setLoading(true);
    setError("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setModules([]);
      setLoading(false);
      setError("Debes iniciar sesión para ver los módulos.");
      return;
    }

    const { data, error: modulesError } = await supabase
      .from("academy_modules")
      .select(
        "id, title, description, position, progress, created_at",
      )
      .eq("course_id", courseId)
      .eq("user_id", user.id)
      .order("position", {
        ascending: true,
      });

    if (modulesError) {
      console.error(
        "VYRO could not load academy modules:",
        modulesError,
      );

      setModules([]);
      setLoading(false);
      setError("No fue posible cargar los módulos.");
      return;
    }

    setModules((data ?? []) as AcademyModule[]);
    setLoading(false);
  }, [courseId]);

  useEffect(() => {
    void loadModules();
  }, [loadModules]);

  async function createModule(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (!cleanTitle) {
      setError("Escribe un nombre para el módulo.");
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
      setError("Debes iniciar sesión para crear módulos.");
      return;
    }

    const nextPosition =
      modules.length > 0
        ? Math.max(
            ...modules.map(
              (academyModule) => academyModule.position,
            ),
          ) + 1
        : 1;

    const { data, error: insertError } = await supabase
      .from("academy_modules")
      .insert({
        course_id: courseId,
        user_id: user.id,
        title: cleanTitle,
        description: cleanDescription || null,
        position: nextPosition,
        progress: 0,
      })
      .select(
        "id, title, description, position, progress, created_at",
      )
      .single();

    setCreating(false);

    if (insertError) {
      console.error(
        "VYRO academy module creation failed:",
        insertError,
      );

      setError("No fue posible crear el módulo.");
      return;
    }

    setModules((currentModules) => [
      ...currentModules,
      data as AcademyModule,
    ]);

    setTitle("");
    setDescription("");
    setMessage("Módulo creado correctamente.");
  }

  function startEditing(academyModule: AcademyModule) {
    setEditingModuleId(academyModule.id);
    setEditTitle(academyModule.title);
    setEditDescription(academyModule.description ?? "");
    setError("");
    setMessage("");
  }

  function cancelEditing() {
    setEditingModuleId(null);
    setEditTitle("");
    setEditDescription("");
  }

  async function updateModule(moduleId: string) {
    const cleanTitle = editTitle.trim();
    const cleanDescription = editDescription.trim();

    if (!cleanTitle) {
      setError("El título del módulo no puede estar vacío.");
      return;
    }

    setBusyModuleId(moduleId);
    setError("");
    setMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setBusyModuleId(null);
      setError("Debes iniciar sesión para editar módulos.");
      return;
    }

    const { data, error: updateError } = await supabase
      .from("academy_modules")
      .update({
        title: cleanTitle,
        description: cleanDescription || null,
      })
      .eq("id", moduleId)
      .eq("course_id", courseId)
      .eq("user_id", user.id)
      .select(
        "id, title, description, position, progress, created_at",
      )
      .single();

    setBusyModuleId(null);

    if (updateError) {
      console.error(
        "VYRO academy module update failed:",
        updateError,
      );

      setError("No fue posible actualizar el módulo.");
      return;
    }

    setModules((currentModules) =>
      currentModules.map((academyModule) =>
        academyModule.id === moduleId
          ? (data as AcademyModule)
          : academyModule,
      ),
    );

    cancelEditing();
    setMessage("Módulo actualizado correctamente.");
  }

  async function deleteModule(moduleId: string) {
    setBusyModuleId(moduleId);
    setError("");
    setMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setBusyModuleId(null);
      setError("Debes iniciar sesión para eliminar módulos.");
      return;
    }

    const { error: deleteError } = await supabase
      .from("academy_modules")
      .delete()
      .eq("id", moduleId)
      .eq("course_id", courseId)
      .eq("user_id", user.id);

    setBusyModuleId(null);

    if (deleteError) {
      console.error(
        "VYRO academy module deletion failed:",
        deleteError,
      );

      setError("No fue posible eliminar el módulo.");
      return;
    }

    setModules((currentModules) =>
      currentModules.filter(
        (academyModule) => academyModule.id !== moduleId,
      ),
    );

    if (editingModuleId === moduleId) {
      cancelEditing();
    }

    setMessage("Módulo eliminado correctamente.");
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-[#0B1220] p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10">
          <BookOpen className="text-cyan-400" size={24} />
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
            Course Modules
          </p>

          <h2 className="mt-1 text-2xl font-black text-white">
            Módulos del curso
          </h2>
        </div>
      </div>

      <form
        onSubmit={createModule}
        className="mt-7 space-y-4"
      >
        <input
          type="text"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          placeholder="Ejemplo: Módulo 1 - Introducción"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
        />

        <textarea
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
          }}
          rows={3}
          placeholder="Describe el objetivo principal del módulo."
          className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
        />

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
          disabled={creating}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 font-black text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {creating ? (
            <LoaderCircle className="animate-spin" size={19} />
          ) : (
            <Plus size={19} />
          )}

          {creating ? "Creando módulo..." : "Agregar módulo"}
        </button>
      </form>

      {loading ? (
        <div className="flex min-h-48 items-center justify-center">
          <LoaderCircle
            className="animate-spin text-cyan-400"
            size={34}
          />
        </div>
      ) : modules.length === 0 ? (
        <div className="mt-7 rounded-2xl border border-dashed border-cyan-500/20 bg-white/[0.02] p-8 text-center">
          <BookOpen
            className="mx-auto text-cyan-400"
            size={38}
          />

          <h3 className="mt-4 text-lg font-black text-white">
            No hay módulos todavía
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            Agrega el primer módulo para comenzar a estructurar el curso.
          </p>
        </div>
      ) : (
        <div className="mt-7 space-y-4">
          {modules.map((academyModule) => {
            const isBusy =
              busyModuleId === academyModule.id;

            const isEditing =
              editingModuleId === academyModule.id;

            return (
              <article
                key={academyModule.id}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="pt-1 text-gray-500">
                  <GripVertical size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(event) => {
                          setEditTitle(event.target.value);
                        }}
                        className="w-full rounded-xl border border-cyan-400/40 bg-black/20 px-4 py-3 font-bold text-white outline-none focus:border-cyan-400"
                      />

                      <textarea
                        value={editDescription}
                        onChange={(event) => {
                          setEditDescription(
                            event.target.value,
                          );
                        }}
                        rows={3}
                        className="w-full resize-none rounded-xl border border-cyan-400/40 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                      />

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            void updateModule(
                              academyModule.id,
                            );
                          }}
                          disabled={isBusy}
                          className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-3 py-2 text-xs font-black text-black transition hover:bg-cyan-400 disabled:opacity-50"
                        >
                          {isBusy ? (
                            <LoaderCircle
                              className="animate-spin"
                              size={16}
                            />
                          ) : (
                            <Save size={16} />
                          )}

                          Guardar cambios
                        </button>

                        <button
                          type="button"
                          onClick={cancelEditing}
                          disabled={isBusy}
                          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-gray-300 transition hover:bg-white/10 disabled:opacity-50"
                        >
                          <X size={16} />
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                            Módulo {academyModule.position}
                          </p>

                          <h3 className="mt-2 text-lg font-black text-white">
                            {academyModule.title}
                          </h3>
                        </div>

                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-gray-300">
                          {academyModule.progress}%
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-gray-400">
                        {academyModule.description ||
                          "Módulo sin descripción."}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            startEditing(academyModule);
                          }}
                          className="inline-flex items-center gap-2 rounded-lg bg-cyan-500/10 px-3 py-2 text-xs font-bold text-cyan-300 transition hover:bg-cyan-500/20"
                        >
                          <Pencil size={15} />
                          Editar
                        </button>

                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2 text-xs font-bold text-green-300 transition hover:bg-green-500/20"
                        >
                          <Plus size={15} />
                          Nueva lección
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    void deleteModule(academyModule.id);
                  }}
                  disabled={isBusy}
                  className="shrink-0 text-gray-500 transition hover:text-red-400 disabled:opacity-50"
                  aria-label={`Eliminar módulo ${academyModule.title}`}
                >
                  {isBusy && !isEditing ? (
                    <LoaderCircle
                      className="animate-spin"
                      size={19}
                    />
                  ) : (
                    <Trash2 size={19} />
                  )}
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}