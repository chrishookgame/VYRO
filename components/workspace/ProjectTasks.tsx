"use client";

import {
  CheckCircle2,
  Circle,
  ListChecks,
  LoaderCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabase";

type ProjectTask = {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
};

type ProjectStatus =
  | "draft"
  | "active"
  | "completed"
  | "archived";

type ProjectTasksProps = {
  projectId: string;
  onProgressChanged?: (progress: number) => void;
};

function calculateProgress(tasks: ProjectTask[]) {
  if (tasks.length === 0) {
    return 0;
  }

  const completedTasks = tasks.filter(
    (task) => task.completed,
  ).length;

  return Math.round(
    (completedTasks / tasks.length) * 100,
  );
}

export default function ProjectTasks({
  projectId,
  onProgressChanged,
}: ProjectTasksProps) {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [busyTaskId, setBusyTaskId] =
    useState<string | null>(null);

  const [error, setError] = useState("");

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks],
  );

  const currentProgress = useMemo(
    () => calculateProgress(tasks),
    [tasks],
  );

  const synchronizeProjectProgress = useCallback(
    async (updatedTasks: ProjectTask[]) => {
      const progress = calculateProgress(updatedTasks);

      const { data: project, error: projectError } =
        await supabase
          .from("projects")
          .select("status")
          .eq("id", projectId)
          .maybeSingle();

      if (projectError) {
        console.error(
          "VYRO could not read project status:",
          projectError,
        );

        setError(
          "Las tareas cambiaron, pero no fue posible calcular el progreso.",
        );

        return;
      }

      const currentStatus =
        (project?.status as ProjectStatus | undefined) ??
        "active";

      let nextStatus: ProjectStatus = currentStatus;

      if (currentStatus !== "archived") {
        if (
          updatedTasks.length > 0 &&
          progress === 100
        ) {
          nextStatus = "completed";
        } else if (currentStatus === "completed") {
          nextStatus = "active";
        }
      }

      const { error: progressError } = await supabase
        .from("projects")
        .update({
          progress,
          status: nextStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId);

      if (progressError) {
        console.error(
          "VYRO could not update project progress:",
          progressError,
        );

        setError(
          "Las tareas cambiaron, pero no fue posible actualizar el progreso.",
        );

        return;
      }

      onProgressChanged?.(progress);
    },
    [onProgressChanged, projectId],
  );

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setTasks([]);
      setLoading(false);

      setError(
        "Debes iniciar sesión para ver las tareas.",
      );

      return;
    }

    const { data, error: tasksError } = await supabase
      .from("project_tasks")
      .select("id, title, completed, created_at")
      .eq("project_id", projectId)
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: true,
      });

    if (tasksError) {
      console.error(
        "VYRO could not load project tasks:",
        tasksError,
      );

      setTasks([]);
      setLoading(false);
      setError("No fue posible cargar las tareas.");

      return;
    }

    const loadedTasks = (data ?? []) as ProjectTask[];

    setTasks(loadedTasks);
    setLoading(false);

    await synchronizeProjectProgress(loadedTasks);
  }, [projectId, synchronizeProjectProgress]);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  async function addTask() {
    const title = newTask.trim();

    if (!title || saving) {
      return;
    }

    setSaving(true);
    setError("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setSaving(false);

      setError(
        "Debes iniciar sesión para crear tareas.",
      );

      return;
    }

    const { data, error: insertError } = await supabase
      .from("project_tasks")
      .insert({
        project_id: projectId,
        user_id: user.id,
        title,
        completed: false,
      })
      .select("id, title, completed, created_at")
      .single();

    setSaving(false);

    if (insertError) {
      console.error(
        "VYRO task creation failed:",
        insertError,
      );

      setError("No fue posible crear la tarea.");

      return;
    }

    const createdTask = data as ProjectTask;

    const updatedTasks = [
      ...tasks,
      createdTask,
    ];

    setTasks(updatedTasks);
    setNewTask("");

    await synchronizeProjectProgress(updatedTasks);
  }

  async function toggleTask(task: ProjectTask) {
    setBusyTaskId(task.id);
    setError("");

    const nextCompletedValue = !task.completed;

    const { error: updateError } = await supabase
      .from("project_tasks")
      .update({
        completed: nextCompletedValue,
      })
      .eq("id", task.id);

    if (updateError) {
      setBusyTaskId(null);

      console.error(
        "VYRO task update failed:",
        updateError,
      );

      setError(
        "No fue posible actualizar la tarea.",
      );

      return;
    }

    const updatedTasks = tasks.map(
      (currentTask) =>
        currentTask.id === task.id
          ? {
              ...currentTask,
              completed: nextCompletedValue,
            }
          : currentTask,
    );

    setTasks(updatedTasks);

    await synchronizeProjectProgress(updatedTasks);

    setBusyTaskId(null);
  }

  async function deleteTask(taskId: string) {
    setBusyTaskId(taskId);
    setError("");

    const { error: deleteError } = await supabase
      .from("project_tasks")
      .delete()
      .eq("id", taskId);

    if (deleteError) {
      setBusyTaskId(null);

      console.error(
        "VYRO task deletion failed:",
        deleteError,
      );

      setError(
        "No fue posible eliminar la tarea.",
      );

      return;
    }

    const updatedTasks = tasks.filter(
      (task) => task.id !== taskId,
    );

    setTasks(updatedTasks);

    await synchronizeProjectProgress(updatedTasks);

    setBusyTaskId(null);
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-[#0B1220] p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10">
            <ListChecks
              className="text-cyan-400"
              size={24}
            />
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
              Project Tasks
            </p>

            <h2 className="mt-1 text-2xl font-black text-white">
              Tareas del proyecto
            </h2>
          </div>
        </div>

        <div className="text-right">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-bold text-gray-300">
            {completedTasks}/{tasks.length}
          </span>

          <p className="mt-2 text-sm font-bold text-cyan-300">
            {currentProgress}%
          </p>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={newTask}
          onChange={(event) => {
            setNewTask(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              void addTask();
            }
          }}
          placeholder="Ejemplo: Preparar guion del primer video"
          className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400"
        />

        <button
          type="button"
          onClick={() => {
            void addTask();
          }}
          disabled={saving || !newTask.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 font-black text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <LoaderCircle
              className="animate-spin"
              size={19}
            />
          ) : (
            <Plus size={19} />
          )}

          {saving ? "Agregando..." : "Agregar tarea"}
        </button>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="flex min-h-48 items-center justify-center">
          <LoaderCircle
            className="animate-spin text-cyan-400"
            size={34}
          />
        </div>
      ) : tasks.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-cyan-500/20 bg-white/[0.02] p-8 text-center">
          <ListChecks
            className="mx-auto text-cyan-400"
            size={36}
          />

          <h3 className="mt-4 text-lg font-black text-white">
            No hay tareas todavía
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            Agrega la primera tarea para organizar este proyecto.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {tasks.map((task) => {
            const isBusy =
              busyTaskId === task.id;

            return (
              <article
                key={task.id}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <button
                  type="button"
                  onClick={() => {
                    void toggleTask(task);
                  }}
                  disabled={isBusy}
                  className="shrink-0 text-cyan-400 disabled:opacity-50"
                  aria-label={
                    task.completed
                      ? `Marcar ${task.title} como pendiente`
                      : `Marcar ${task.title} como completada`
                  }
                >
                  {isBusy ? (
                    <LoaderCircle
                      className="animate-spin"
                      size={22}
                    />
                  ) : task.completed ? (
                    <CheckCircle2 size={22} />
                  ) : (
                    <Circle size={22} />
                  )}
                </button>

                <p
                  className={`flex-1 text-sm font-semibold ${
                    task.completed
                      ? "text-gray-500 line-through"
                      : "text-white"
                  }`}
                >
                  {task.title}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    void deleteTask(task.id);
                  }}
                  disabled={isBusy}
                  className="shrink-0 text-gray-500 transition hover:text-red-400 disabled:opacity-50"
                  aria-label={`Eliminar tarea ${task.title}`}
                >
                  <Trash2 size={19} />
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}