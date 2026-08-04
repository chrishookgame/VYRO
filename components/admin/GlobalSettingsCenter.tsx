"use client";

const sections = [
  {
    title: "💰 Finanzas",
    description:
      "Comisiones, retiros y Wallet",
  },
  {
    title: "👥 Usuarios",
    description:
      "Registro, niveles y permisos",
  },
  {
    title: "🤝 Referidos",
    description:
      "Bonificaciones y niveles",
  },
  {
    title: "🎓 Academy",
    description:
      "XP, certificados y cursos",
  },
  {
    title: "📺 Live",
    description:
      "Comisiones y configuración",
  },
  {
    title: "🛒 Marketplace",
    description:
      "Ventas y porcentajes",
  },
  {
    title: "🤖 IA",
    description:
      "Créditos y límites",
  },
  {
    title: "💳 VYRO Card",
    description:
      "Tarjetas virtuales y físicas",
  },
  {
    title: "🌍 General",
    description:
      "Configuración global",
  },
  {
    title: "🔐 Seguridad",
    description:
      "Roles, permisos y auditoría",
  },
];

export default function GlobalSettingsCenter() {

  return (

    <section className="rounded-3xl bg-slate-950 p-8 text-white shadow-2xl">

      <h1 className="text-4xl font-bold">
        Centro Global de Configuración
      </h1>

      <p className="mt-2 text-slate-400">
        Admin Maestro
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {sections.map(
          section => (

            <button
              key={section.title}
              className="rounded-2xl border border-slate-700 bg-slate-900 p-6 text-left transition hover:border-cyan-400 hover:bg-slate-800"
            >

              <h2 className="text-xl font-bold">
                {section.title}
              </h2>

              <p className="mt-3 text-slate-400">
                {section.description}
              </p>

            </button>

          ),
        )}

      </div>

    </section>

  );

}
