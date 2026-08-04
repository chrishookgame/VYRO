"use client";

import Link from "next/link";
import {
  Archive,
  BookOpenCheck,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDot,
  LoaderCircle,
  PlayCircle,
  Radio,
  ShoppingBag,
  UsersRound,
  Video,
} from "lucide-react";
import { useState } from "react";

import { supabase } from "@/lib/supabase";

export type ProjectItem = {
  id: string;
  title: string;
  description: string | null;
  status: "draft" | "active" | "completed" | "archived";
  module:
    | "creator"
    | "live"
    | "feed"
    | "connect"
    | "academy"
    | "business"
    | "marketplace";
  progress: number;
  created_at: string;
};

type ProjectCardProps = {
  project: ProjectItem;
  onProjectUpdated?: () => void;
};

const moduleConfig = {
  creator: {
    label: "Creator Studio",
    href: "/ai",
    icon: Video,
  },
  live: {
    label: "VYRO Live",
    href: "/live/studio",
    icon: Radio,
  },
  feed: {
    label: "Social Feed",
    href: "/feed",
    icon: CircleDot,
  },
  connect: {
    label: "VYRO Connect",
    href: "/connect",
    icon: UsersRound,
  },
  academy: {
    label: "VYRO Academy",
    href: "/academy",
    icon: BookOpenCheck,
  },
  business: {
    label: "VYRO Business",
    href: "/business",
    icon: BriefcaseBusiness,
  },
  marketplace: {
    label: "Marketplace",
    href: "/marketplace",
    icon: ShoppingBag,
  },
};

const statusLabels = {
  draft: "Borrador",
  active: "Activo",
  completed: "Completado",
  archived: "Archivado",
};

export default function ProjectCard({
  project,
  onProjectUpdated,
}: ProjectCardProps) {
  const config = moduleConfig[project.module];
  const Icon = config.icon;

  const [progress, setProgress] = useState(project.progress);
  const [loadingAction, setLoadingAction] = useState<
    "progress" | "activate" | "complete" | "archive" | null
  >(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function updateProject(
    values: Partial<Pick<ProjectItem, "status" | "progress">>,
    action: "progress" | "activate" | "complete" | "archive",
  ) {
    setLoadingAction(action);
    setMessage("");
    setError("");

    const { error: updateError } = await supabase
      .from("projects")
      .update({
        ...values,
        updated_at: new Date().toISOString(),
      })
      .eq("id", project.id);

    setLoadingAction(null);

    if (updateError) {
      console.error("VYRO project update failed:", updateError);
      setError("No fue posible actualizar el proyecto.");
      return;
    }

    if (typeof values.progress === "number") {
      setProgress(values.progress);
    }

    setMessage("Proyecto actualizado correctamente.");
    onProjectUpdated?.();
  }

  function saveProgress() {
    void updateProject(
      {
        progress,
        status: progress === 100 ? "completed" : project.status,
      },
      "progress",
    );
  }

  function activateProject() {
    void updateProject(
      {
        status: "active",
      },
      "activate",
    );
  }

  function completeProject() {
    setProgress(100);

    void updateProject(
      {
        status: "completed",
        progress: 100,
      },
      "complete",
    );
  }

  function archiveProject() {
    void updateProject(
      {
        status: "archived",
      },
      "archive",
    );
  }

  return (
    <article className="rounded-3xl border border-white/10 bg-[#0B1220] p-6 transition duration-300 hover:border-cyan-400/40">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10">
          <Icon className="text-cyan-400" size={24} />
        </div>

        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-gray-300">
          {statusLabels[project.status]}
        </span>
      </div>

      <h3 className="mt-5 text-xl font-black text-white">
        {project.title}
      </h3>

      <p className="mt-2 min-h-12 text-sm leading-6 text-gray-400">
        {project.description || "Proyecto sin descripción."}
      </p>

      <div className="mt-5">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-gray-400">
            Progreso
          </span>

          <span className="font-bold text-cyan-300">
            {progress}%
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={progress}
          onChange={(event) => {
            setProgress(Number(event.target.value));
          }}
          disabled={
            project.status === "completed" ||
            project.status === "archived"
          }
          className="mt-4 w-full accent-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`Progreso del proyecto ${project.title}`}
        />

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-cyan-400 transition-all"
            style={{
              width: `${Math.min(
                Math.max(progress, 0),
                100,
              )}%`,
            }}
          />
        </div>

        <button
          type="button"
          onClick={saveProgress}
          disabled={
            loadingAction !== null ||
            project.status === "completed" ||
            project.status === "archived" ||
            progress === project.progress
          }
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm font-bold text-cyan-300 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingAction === "progress" ? (
            <LoaderCircle className="animate-spin" size={17} />
          ) : (
            <CheckCircle2 size={17} />
          )}

          Guardar progreso
        </button>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          {error}
        </p>
      ) : null}

      {message ? (
        <p
          aria-live="polite"
          className="mt-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-200"
        >
          {message}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        {project.status === "draft" ? (
          <button
            type="button"
            onClick={activateProject}
            disabled={loadingAction !== null}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-bold text-cyan-300 transition hover:bg-cyan-500/20 disabled:opacity-50"
          >
            {loadingAction === "activate" ? (
              <LoaderCircle className="animate-spin" size={17} />
            ) : (
              <PlayCircle size={17} />
            )}

            Activar
          </button>
        ) : null}

        {project.status !== "completed" &&
        project.status !== "archived" ? (
          <button
            type="button"
            onClick={completeProject}
            disabled={loadingAction !== null}
            className="inline-flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm font-bold text-green-300 transition hover:bg-green-500/20 disabled:opacity-50"
          >
            {loadingAction === "complete" ? (
              <LoaderCircle className="animate-spin" size={17} />
            ) : (
              <CheckCircle2 size={17} />
            )}

            Completar
          </button>
        ) : null}

        {project.status !== "archived" ? (
          <button
            type="button"
            onClick={archiveProject}
            disabled={loadingAction !== null}
            className="inline-flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm font-bold text-amber-300 transition hover:bg-amber-500/20 disabled:opacity-50"
          >
            {loadingAction === "archive" ? (
              <LoaderCircle className="animate-spin" size={17} />
            ) : (
              <Archive size={17} />
            )}

            Archivar
          </button>
        ) : null}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
        <span className="text-sm text-gray-500">
          {config.label}
        </span>

        <Link
          href={`/projects/${project.id}`}
          className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-bold text-cyan-300 transition hover:bg-cyan-500/20"
        >
          <CheckCircle2 size={17} />
          Abrir Workspace
        </Link>
      </div>
    </article>
  );
}