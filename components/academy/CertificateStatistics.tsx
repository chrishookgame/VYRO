"use client";

import {
  getCertificateStatistics,
} from "@/lib/academy";

export function CertificateStatistics() {
  const stats =
    getCertificateStatistics();

  const cards = [
    {
      title: "Certificados",
      value: stats.totalCertificates,
      color: "text-violet-700",
    },
    {
      title: "Estudiantes",
      value: stats.totalStudents,
      color: "text-blue-700",
    },
    {
      title: "Promedio",
      value: `${stats.averageScore}%`,
      color: "text-emerald-700",
    },
    {
      title: "Mejor resultado",
      value: `${stats.bestScore}%`,
      color: "text-amber-600",
    },
    {
      title: "Último certificado",
      value: stats.latestCertificateDate
        ? new Date(
            stats.latestCertificateDate,
          ).toLocaleDateString(
            "es-CL",
          )
        : "-",
      color: "text-gray-700",
    },
  ];

  return (
    <section className="mt-10">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
          Dashboard
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          Estadísticas de certificados
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <article
            key={card.title}
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-gray-500">
              {card.title}
            </p>

            <p
              className={`mt-3 text-3xl font-bold ${card.color}`}
            >
              {card.value}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
