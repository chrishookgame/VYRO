"use client";

import { FolderKanban, Sparkles } from "lucide-react";

type ProjectHeaderProps = {
  title: string;
  module: string;
  status: string;
  progress: number;
};

export default function ProjectHeader({
  title,
  module,
  status,
  progress,
}: ProjectHeaderProps) {
  return (
    <section className="rounded-3xl border border-cyan-500/20 bg-[#0B1220] p-8">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500/10">
            <FolderKanban
              size={34}
              className="text-cyan-400"
            />
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-400 font-bold">
              Workspace
            </p>

            <h1 className="mt-2 text-4xl font-black text-white">
              {title}
            </h1>

            <p className="mt-3 text-gray-400">
              {module}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-cyan-500/10 px-6 py-4 text-center">
          <Sparkles
            className="mx-auto text-cyan-400"
            size={26}
          />

          <p className="mt-2 text-xs uppercase text-cyan-300">
            Estado
          </p>

          <p className="font-black text-white">
            {status}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">
            Progreso
          </span>

          <span className="font-bold text-cyan-300">
            {progress}%
          </span>
        </div>

        <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-cyan-400 transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
    </section>
);
}