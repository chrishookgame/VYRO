"use client";

import Link from "next/link";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import ProjectActions from "@/components/workspace/ProjectActions";
import ProjectAI from "@/components/workspace/ProjectAI";
import ProjectFiles from "@/components/workspace/ProjectFiles";
import ProjectHeader from "@/components/workspace/ProjectHeader";
import ProjectOverview from "@/components/workspace/ProjectOverview";
import ProjectTasks from "@/components/workspace/ProjectTasks";
import ProjectTimeline from "@/components/workspace/ProjectTimeline";
import { supabase } from "@/lib/supabase";

type ProjectWorkspaceItem = {
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

const moduleLabels: Record<ProjectWorkspaceItem["module"], string> = {
  creator: "Creator Studio",
  live: "VYRO Live",
  feed: "Social Feed",
  connect: "VYRO Connect",
  academy: "VYRO Academy",
  business: "VYRO Business",
  marketplace: "Marketplace",
};

const statusLabels: Record<ProjectWorkspaceItem["status"], string> = {
  draft: "Borrador",
  active: "Activo",
  completed: "Completado",
  archived: "Archivado",
};

export default function ProjectWorkspacePage() {
  const params = useParams<{ id: string }>();
  const projectId = params.id;

  const [project, setProject] =
    useState<ProjectWorkspaceItem | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProject() {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setLoading(false);
        setError("Debes iniciar sesión para abrir este proyecto.");
        return;
      }

      const { data, error: projectError } = await supabase
        .from("projects")
        .select(
          "id, title, description, status, module, progress, created_at",
        )
        .eq("id", projectId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (projectError) {
        console.error(
          "VYRO could not load the project workspace:",
          projectError,
        );

        setLoading(false);
        setError("No fue posible cargar el proyecto.");
        return;
      }

      if (!data) {
        setLoading(false);
        setError("El proyecto no existe o no tienes acceso.");
        return;
      }

      setProject(data as ProjectWorkspaceItem);
      setLoading(false);
    }

    void loadProject();
  }, [projectId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05070A] px-6 text-white">
        <div className="text-center">
          <LoaderCircle
            className="mx-auto animate-spin text-cyan-400"
            size={42}
          />

          <p className="mt-4 font-bold">
            Cargando Project Workspace
          </p>
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05070A] px-6 text-white">
        <section className="w-full max-w-xl rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">
          <h1 className="text-2xl font-black text-red-100">
            No fue posible abrir el proyecto
          </h1>

          <p className="mt-4 text-red-200">
            {error}
          </p>

          <Link
            href="/mission"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-black"
          >
            <ArrowLeft size={18} />
            Volver a Mission Control
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-y-auto bg-[#05070A] px-6 py-8 text-white md:px-8 xl:px-10">
      <div className="mx-auto max-w-[1500px] space-y-8">
        <Link
          href="/mission"
          className="inline-flex items-center gap-2 text-sm font-bold text-cyan-400 transition hover:text-cyan-300"
        >
          <ArrowLeft size={18} />
          Volver a Mission Control
        </Link>

        <ProjectHeader
          title={project.title}
          module={moduleLabels[project.module]}
          status={statusLabels[project.status]}
          progress={project.progress}
        />

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <ProjectOverview
            description={project.description}
            module={moduleLabels[project.module]}
            status={statusLabels[project.status]}
            createdAt={project.created_at}
          />

          <ProjectAI
            title={project.title}
            module={moduleLabels[project.module]}
            status={project.status}
            progress={project.progress}
          />
        </div>

        <div
          id="project-tasks"
          className="grid grid-cols-1 gap-8 xl:grid-cols-2"
        >
          <ProjectTasks projectId={project.id} />

          <ProjectTimeline progress={project.progress} />
        </div>

        <ProjectFiles projectId={project.id} />

        <ProjectActions module={project.module} />
      </div>
    </main>
  );
}