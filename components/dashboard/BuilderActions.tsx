const actions = [
  {
    icon: "🎬",
    title: "Crear contenido",
    description: "Videos, Shorts, IA, Imágenes"
  },
  {
    icon: "🚀",
    title: "Crear un negocio",
    description: "Marca, Web, Marketing"
  },
  {
    icon: "🎓",
    title: "Aprender",
    description: "Cursos y Mentor IA"
  },
  {
    icon: "🤝",
    title: "Reuniones",
    description: "Eventos y Connect"
  },
  {
    icon: "🛒",
    title: "Monetizar",
    description: "Marketplace y Ventas"
  },
  {
    icon: "🤖",
    title: "Trabajar con IA",
    description: "AI Director"
  }
];

export default function BuilderActions() {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-white mb-6">
        ¿Qué quieres construir hoy?
      </h2>

      <div className="grid grid-cols-3 gap-6">
        {actions.map((action) => (
          <div
            key={action.title}
            className="rounded-2xl border border-cyan-500/20 bg-[#0B1118] hover:bg-[#111B25] transition-all duration-300 cursor-pointer p-6"
          >
            <div className="text-4xl">{action.icon}</div>

            <h3 className="text-white font-semibold mt-4">
              {action.title}
            </h3>

            <p className="text-gray-400 mt-2 text-sm">
              {action.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}