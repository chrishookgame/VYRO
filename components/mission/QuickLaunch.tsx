import Link from "next/link";
import {
  BookOpen,
  BriefcaseBusiness,
  GraduationCap,
  Radio,
  ShoppingBag,
  Sparkles,
  Users,
  Video,
} from "lucide-react";

const actions = [
  {
    title: "Crear contenido",
    description: "Abre VYRO Creator Studio.",
    href: "/ai",
    icon: Video,
  },
  {
    title: "Iniciar VYRO Live",
    description: "Prepara una transmisión.",
    href: "/live/studio",
    icon: Radio,
  },
  {
    title: "VYRO Connect",
    description: "Reuniones, eventos y colaboración.",
    href: "/connect",
    icon: Users,
  },
  {
    title: "VYRO Academy",
    description: "Crear cursos y experiencias educativas.",
    href: "/academy",
    icon: GraduationCap,
  },
  {
    title: "VYRO Business",
    description: "Gestionar proyectos y empresas.",
    href: "/business",
    icon: BriefcaseBusiness,
  },
  {
    title: "VYRO Marketplace",
    description: "Publicar productos y servicios.",
    href: "/marketplace",
    icon: ShoppingBag,
  },
];

export default function QuickLaunch() {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
            Acceso rápido
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Construye dentro del ecosistema VYRO
          </h2>
        </div>

        <Sparkles className="text-cyan-400" />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group rounded-3xl border border-white/10 bg-[#0B1220] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:bg-[#111827]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10">
                <Icon className="text-cyan-400" size={28} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-white">
                {action.title}
              </h3>

              <p className="mt-2 leading-7 text-gray-400">
                {action.description}
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-cyan-400">
                <BookOpen size={16} />
                Abrir módulo
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}