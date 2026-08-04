import {
  BookOpen,
  CalendarDays,
  DollarSign,
  FileText,
} from "lucide-react";

type CourseOverviewProps = {
  description: string | null;
  status: "draft" | "published" | "archived";
  price: number;
  createdAt: string;
};

const statusLabels = {
  draft: "Borrador",
  published: "Publicado",
  archived: "Archivado",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default function CourseOverview({
  description,
  status,
  price,
  createdAt,
}: CourseOverviewProps) {
  const details = [
    {
      label: "Estado",
      value: statusLabels[status],
      icon: BookOpen,
    },
    {
      label: "Precio",
      value: `$${Number(price).toFixed(2)}`,
      icon: DollarSign,
    },
    {
      label: "Creado",
      value: formatDate(createdAt),
      icon: CalendarDays,
    },
  ];

  return (
    <section className="rounded-3xl border border-white/10 bg-[#0B1220] p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10">
          <FileText className="text-cyan-400" size={24} />
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
            Course Overview
          </p>

          <h2 className="mt-1 text-2xl font-black text-white">
            Información general
          </h2>
        </div>
      </div>

      <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="text-sm font-semibold text-gray-400">
          Descripción
        </p>

        <p className="mt-3 leading-7 text-white">
          {description || "Este curso todavía no tiene descripción."}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        {details.map((detail) => {
          const Icon = detail.icon;

          return (
            <article
              key={detail.label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10">
                <Icon className="text-cyan-400" size={21} />
              </div>

              <p className="mt-4 text-sm text-gray-400">
                {detail.label}
              </p>

              <p className="mt-2 font-bold text-white">
                {detail.value}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}