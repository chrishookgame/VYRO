"use client";

import { FolderOpen, LoaderCircle, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import ProjectCard, {
  type ProjectItem,
} from "@/components/projects/ProjectCard";
import { supabase } from "@/lib/supabase";

type ProjectListProps = {
  refreshKey?: number;
  onProjectsChanged?: () => void;
};

export default function ProjectList({
  refreshKey = 0,
  onProjectsChanged,
}: ProjectListProps) {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadProjects = useCallback(
    async (showFullLoader = true) => {
      if (showFullLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setProjects([]);
        setLoading(false);
        setRefreshing(false);
        setError("Debes iniciar sesión para ver tus proyectos.");
        return;
      }

      const { data, error: projectsError } = await supabase
        .from("projects")
        .select(
          "id, title, description, status, module, progress, created_at",
        )
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (projectsError) {
        console.error(
          "VYRO could not load projects:",
          projectsError,
        );

        setProjects([]);
        setLoading(false);
        setRefreshing(false);
        setError("No fue posible cargar tus proyectos.");
        return;
      }

      setProjects((data ?? []) as ProjectItem[]);
      setLoading(false);
      setRefreshing(false);
    },
    [],
  );

  useEffect(() => {
    void loadProjects();
  }, [loadProjects, refreshKey]);

  async function handleProjectUpdated() {
    await loadProjects(false);
    onProjectsChanged?.();
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-[#080C12] p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
            VYRO Projects
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Tus proyectos
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              void loadProjects(false);
            }}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-gray-300 transition hover:border-cyan-400/40 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
            Actualizar
          </button>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10">
            <FolderOpen className="text-cyan-400" size={24} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <div className="text-center">
            <LoaderCircle
              className="mx-auto animate-spin text-cyan-400"
              size={34}
            />

            <p className="mt-4 font-semibold text-white">
              Cargando proyectos
            </p>
          </div>
        </div>
      ) : error ? (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-200"
        >
          {error}
        </div>
      ) : projects.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-cyan-500/20 bg-[#0B1220] p-10 text-center">
          <FolderOpen
            className="mx-auto text-cyan-400"
            size={42}
          />

          <h3 className="mt-5 text-xl font-black text-white">
            Todavía no tienes proyectos
          </h3>

          <p className="mx-auto mt-3 max-w-xl leading-7 text-gray-400">
            Crea tu primer proyecto para que VYRO AI pueda analizarlo y
            recomendarte el siguiente paso.
          </p>
        </div>
      ) : (
        <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onProjectUpdated={() => {
                void handleProjectUpdated();
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}