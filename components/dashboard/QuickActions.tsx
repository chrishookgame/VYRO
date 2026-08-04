import Link from "next/link";

const actions = [
  {
    title: "🎬 Crear contenido",
    subtitle: "Video, imagen y música",
    href: "/ai",
  },
  {
    title: "🔴 Iniciar VYRO Live",
    subtitle: "Transmitir en vivo",
    href: "/live",
  },
  {
    title: "🤝 Nueva reunión",
    subtitle: "VYRO Connect",
    href: "/connect",
  },
  {
    title: "🎓 Crear curso",
    subtitle: "VYRO Academy",
    href: "/academy",
  },
  {
    title: "💼 Nuevo proyecto",
    subtitle: "VYRO Business",
    href: "/business",
  },
  {
    title: "🛒 Publicar producto",
    subtitle: "VYRO Marketplace",
    href: "/marketplace",
  },
];

export default function QuickActions() {
  return (
    <section className="mt-10">
      <h2 className="mb-6 text-2xl font-bold text-white">
        ¿Qué quieres construir hoy?
      </h2>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {actions.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="rounded-2xl border border-cyan-500/20 bg-[#111827] p-6 text-left transition duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:bg-[#162033]"
          >
            <h3 className="text-lg font-bold text-white">
              {item.title}
            </h3>

            <p className="mt-2 text-gray-400">
              {item.subtitle}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}