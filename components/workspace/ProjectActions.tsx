import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Radio,
  Share2,
  Video,
} from "lucide-react";

type ProjectActionsProps = {
  module: string;
};

function getPrimaryAction(module: string) {
  switch (module) {
    case "live":
      return {
        label: "Abrir VYRO Live",
        href: "/live/studio",
        icon: Radio,
      };

    case "creator":
      return {
        label: "Abrir Creator Studio",
        href: "/ai",
        icon: Video,
      };

    default:
      return {
        label: "Abrir Mission Control",
        href: "/mission",
        icon: Brain,
      };
  }
}

export default function ProjectActions({
  module,
}: ProjectActionsProps) {
  const primaryAction = getPrimaryAction(module);
  const PrimaryIcon = primaryAction.icon;

  return (
    <section
      id="project-actions"
      className="rounded-3xl border border-white/10 bg-[#0B1220] p-6"
    >
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
          Project Actions
        </p>

        <h2 className="mt-2 text-2xl font-black text-white">
          Acciones rápidas
        </h2>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link
          href={primaryAction.href}
          className="group rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-5 transition hover:bg-cyan-500/20"
        >
          <PrimaryIcon className="text-cyan-400" size={26} />

          <h3 className="mt-4 font-black text-white">
            {primaryAction.label}
          </h3>

          <div className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-cyan-300">
            Continuar
            <ArrowRight
              size={17}
              className="transition group-hover:translate-x-1"
            />
          </div>
        </Link>

        <Link
          href="/live/studio"
          className="group rounded-2xl border border-red-500/20 bg-red-500/10 p-5 transition hover:bg-red-500/20"
        >
          <Radio className="text-red-400" size={26} />

          <h3 className="mt-4 font-black text-white">
            Iniciar VYRO Live
          </h3>

          <div className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-red-300">
            Transmitir
            <ArrowRight
              size={17}
              className="transition group-hover:translate-x-1"
            />
          </div>
        </Link>

        <button
          type="button"
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-cyan-400/40 hover:bg-white/[0.06]"
        >
          <Share2 className="text-cyan-400" size={26} />

          <h3 className="mt-4 font-black text-white">
            Compartir proyecto
          </h3>

          <p className="mt-3 text-sm text-gray-400">
            Preparado para colaboración en una próxima fase.
          </p>
        </button>
      </div>
    </section>
  );
}