"use client";

import {
  CheckCircle2,
  FolderKanban,
  LoaderCircle,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

type ProjectStatsState = {
  total: number;
  active: number;
  completed: number;
  averageProgress: number;
};

const initialStats: ProjectStatsState = {
  total: 0,
  active: 0,
  completed: 0,
  averageProgress: 0,
};

export default function ProjectStats() {
  const [stats, setStats] =
    useState<ProjectStatsState>(initialStats);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setStats(initialStats);
        setLoading(false);
        setError("Debes iniciar sesión para ver las estadísticas.");
        return;
      }

      const { data, error: projectsError } = await supabase
        .from("projects")
        .select("status, progress")
        .eq("user_id", user.id);

      if (projectsError) {
        console.error(
          "VYRO could not load project statistics:",
          projectsError,
        );

        setStats(initialStats);
        setLoading(false);
        setError("No fue posible cargar las estadísticas.");
        return;
      }

      const projects = data ?? [];
      const total = projects.length;

      const active = projects.filter(
        (project) =>
          project.status === "active" ||
          project.status === "draft",
      ).length;

      const completed = projects.filter(
        (project) => project.status === "completed",
      ).length;

      const progressTotal = projects.reduce(
        (sum, project) => sum + (project.progress ?? 0),
        0,
      );

      const averageProgress =
        total > 0 ? Math.round(progressTotal / total) : 0;

      setStats({
        total,
        active,
        completed,
        averageProgress,
      });

      setLoading(false);
    }

    void loadStats();
  }, []);

  const metrics = [
    {
      label: "Proyectos totales",
      value: stats.total,
      icon: FolderKanban,
    },
    {
      label: "Proyectos activos",
      value: stats.active,
      icon: TrendingUp,
    },
    {
      label: "Completados",
      value: stats.completed,
      icon: CheckCircle2,
    },
    {
      label: "Progreso promedio",
      value: `${stats.averageProgress}%`,
      icon: TrendingUp,
    },
  ];

  return (
    <section className="rounded-3xl border border-white/10 bg-[#0B1220] p-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
          VYRO Projects
        </p>

        <h2 className="mt-2 text-2xl font-black text-white">
          Resumen de proyectos
        </h2>
      </div>

      {loading ? (
        <div className="flex min-h-40 items-center justify-center">
          <LoaderCircle
            className="animate-spin text-cyan-400"
            size={34}
          />
        </div>
      ) : error ? (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-200"
        >
          {error}
        </div>
      ) : (
        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <article
                key={metric.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10">
                  <Icon
                    className="text-cyan-400"
                    size={21}
                  />
                </div>

                <p className="mt-5 text-sm text-gray-400">
                  {metric.label}
                </p>

                <p className="mt-2 text-3xl font-black text-white">
                  {metric.value}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}