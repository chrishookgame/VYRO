import {
  ArrowLeft,
  BookOpen,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

type CourseHeaderProps = {
  title: string;
  status: "draft" | "published" | "archived";
  progress: number;
  price: number;
};

const statusLabels = {
  draft: "Borrador",
  published: "Publicado",
  archived: "Archivado",
};

export default function CourseHeader({
  title,
  status,
  progress,
  price,
}: CourseHeaderProps) {
  const safeProgress = Math.min(
    Math.max(progress, 0),
    100,
  );

  return (
    <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#0B1220] to-[#101827] p-8">
      <Link
        href="/academy"
        className="inline-flex items-center gap-2 text-sm font-bold text-cyan-400 transition hover:text-cyan-300"
      >
        <ArrowLeft size={18} />
        Volver a VYRO Academy
      </Link>

      <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-cyan-500/10">
            <BookOpen
              className="text-cyan-400"
              size={34}
            />
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
              Course Workspace
            </p>

            <h1 className="mt-2 text-4xl font-black text-white">
              {title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase text-gray-300">
                {statusLabels[status]}
              </span>

              <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300">
                ${Number(price).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-6 py-4 text-center">
          <Sparkles
            className="mx-auto text-cyan-400"
            size={25}
          />

          <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
            Progreso
          </p>

          <p className="mt-1 text-3xl font-black text-white">
            {safeProgress}%
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-gray-400">
            Construcción del curso
          </span>

          <span className="font-bold text-cyan-300">
            {safeProgress}%
          </span>
        </div>

        <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-cyan-400 transition-all duration-500"
            style={{
              width: `${safeProgress}%`,
            }}
          />
        </div>
      </div>
    </section>
  );
}