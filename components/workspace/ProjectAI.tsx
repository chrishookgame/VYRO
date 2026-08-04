import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Lightbulb,
  Sparkles,
} from "lucide-react";

type ProjectAIProps = {
  title: string;
  module: string;
  status: string;
  progress: number;
};

function buildRecommendation(
  title: string,
  module: string,
  status: string,
  progress: number,
) {
  if (status === "completed") {
    return {
      title: "Proyecto completado",
      description:
        "Convierte este resultado en contenido, una transmisión o un recurso para otro módulo de VYRO.",
      actionLabel: "Abrir Mission Control",
      href: "/mission",
    };
  }

  if (status === "archived") {
    return {
      title: "Proyecto archivado",
      description:
        "Puedes revisar el proyecto o crear uno nuevo basado en lo que aprendiste.",
      actionLabel: "Crear otro proyecto",
      href: "/mission",
    };
  }

  if (progress === 0) {
    return {
      title: "Define el primer paso",
      description: `Empieza ${title} creando una tarea clara y medible dentro del módulo ${module}.`,
      actionLabel: "Ver tareas",
      href: "#project-tasks",
    };
  }

  if (progress < 50) {
    return {
      title: "Mantén el ritmo",
      description:
        "Completa una tarea importante hoy para acercarte al punto medio del proyecto.",
      actionLabel: "Continuar proyecto",
      href: "#project-tasks",
    };
  }

  if (progress < 100) {
    return {
      title: "Prepara el lanzamiento",
      description:
        "El proyecto está avanzado. Revisa archivos, tareas y próximos pasos antes de finalizarlo.",
      actionLabel: "Ver acciones",
      href: "#project-actions",
    };
  }

  return {
    title: "Siguiente oportunidad",
    description:
      "VYRO AI recomienda reutilizar este proyecto dentro de otro módulo del ecosistema.",
    actionLabel: "Explorar VYRO",
    href: "/mission",
  };
}

export default function ProjectAI({
  title,
  module,
  status,
  progress,
}: ProjectAIProps) {
  const recommendation = buildRecommendation(
    title,
    module,
    status,
    progress,
  );

  return (
    <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#0B1220] to-[#111827] p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10">
            <Brain className="text-cyan-400" size={24} />
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
              VYRO AI Director
            </p>

            <h2 className="mt-1 text-2xl font-black text-white">
              Recomendación del proyecto
            </h2>
          </div>
        </div>

        <Lightbulb className="text-yellow-300" size={25} />
      </div>

      <div className="mt-7 rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-5">
        <div className="flex items-center gap-2 text-cyan-300">
          <Sparkles size={18} />

          <span className="text-sm font-bold uppercase tracking-[0.2em]">
            Próximo paso
          </span>
        </div>

        <h3 className="mt-4 text-xl font-black text-white">
          {recommendation.title}
        </h3>

        <p className="mt-3 leading-7 text-gray-300">
          {recommendation.description}
        </p>

        <Link
          href={recommendation.href}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-bold text-black transition hover:bg-cyan-400"
        >
          {recommendation.actionLabel}
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}