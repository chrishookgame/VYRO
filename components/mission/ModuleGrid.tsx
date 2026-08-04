import Link from "next/link";
import {
  BarChart3,
  BookOpenCheck,
  BriefcaseBusiness,
  MessageCircleMore,
  Radio,
  ShoppingBag,
  UsersRound,
  Video,
} from "lucide-react";

const modules = [
  {
    name: "Creator Studio",
    description: "Crea, analiza y prepara contenido con VYRO AI.",
    href: "/ai",
    icon: Video,
  },
  {
    name: "VYRO Live",
    description: "Transmite, enseña y conecta en tiempo real.",
    href: "/live",
    icon: Radio,
  },
  {
    name: "Social Feed",
    description: "Publica contenido y descubre nuevas comunidades.",
    href: "/feed",
    icon: MessageCircleMore,
  },
  {
    name: "VYRO Connect",
    description: "Reuniones, eventos y colaboración inteligente.",
    href: "/connect",
    icon: UsersRound,
  },
  {
    name: "VYRO Academy",
    description: "Cursos, aprendizaje y certificaciones.",
    href: "/academy",
    icon: BookOpenCheck,
  },
  {
    name: "VYRO Business",
    description: "Equipos, proyectos, clientes y operaciones.",
    href: "/business",
    icon: BriefcaseBusiness,
  },
  {
    name: "Marketplace",
    description: "Productos, servicios y activos digitales.",
    href: "/marketplace",
    icon: ShoppingBag,
  },
  {
    name: "Analytics",
    description: "Rendimiento, crecimiento e inteligencia de datos.",
    href: "/analytics",
    icon: BarChart3,
  },
];

export default function ModuleGrid() {
  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
          Ecosistema
        </p>

        <h2 className="mt-2 text-2xl font-black text-white">
          Todos los módulos de VYRO
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {modules.map((module) => {
          const Icon = module.icon;

          return (
            <Link
              key={module.name}
              href={module.href}
              className="rounded-3xl border border-white/10 bg-[#0B1220] p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:bg-[#111827]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10">
                <Icon className="text-cyan-400" size={24} />
              </div>

              <h3 className="mt-4 text-lg font-bold text-white">
                {module.name}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                {module.description}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}