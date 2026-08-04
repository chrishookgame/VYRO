"use client";

import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Lightbulb,
  LoaderCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

import { getUserContext } from "@/lib/ai/context";
import { runAIDirector } from "@/lib/ai/director";

import type { AIDirectorResponse } from "@/lib/ai/types";

const priorityStyles = {
  low: "border-slate-500/20 bg-slate-500/5 text-slate-300",
  medium: "border-cyan-500/20 bg-cyan-500/5 text-cyan-300",
  high: "border-amber-500/20 bg-amber-500/5 text-amber-300",
  critical: "border-red-500/20 bg-red-500/5 text-red-300",
};

export default function AIRecommendations() {
  const [director, setDirector] =
    useState<AIDirectorResponse | null>(null);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDirector() {
      try {
        const context = await getUserContext();
        const result = runAIDirector(context);

        setDirector(result);
      } catch (loadError) {
        console.error(
          "VYRO AI Director could not load:",
          loadError,
        );

        setError(
          "No fue posible cargar las recomendaciones de VYRO AI.",
        );
      }
    }

    void loadDirector();
  }, []);

  if (error) {
    return (
      <section className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
        <p className="font-bold text-red-200">
          VYRO AI Director
        </p>

        <p className="mt-3 text-red-100">
          {error}
        </p>
      </section>
    );
  }

  if (!director) {
    return (
      <section className="flex min-h-72 items-center justify-center rounded-3xl border border-cyan-500/20 bg-[#0B1220] p-6">
        <div className="text-center">
          <LoaderCircle
            className="mx-auto animate-spin text-cyan-400"
            size={34}
          />

          <p className="mt-4 font-bold text-white">
            VYRO AI está analizando tu contexto
          </p>

          <p className="mt-2 text-sm text-gray-400">
            Cargando proyectos y actividad real.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#0B1220] to-[#101827] p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10">
            <Brain
              className="text-cyan-400"
              size={28}
            />
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
              VYRO AI Director
            </p>

            <h2 className="mt-1 text-2xl font-black text-white">
              {director.greeting}
            </h2>
          </div>
        </div>

        <Lightbulb
          className="text-yellow-300"
          size={26}
        />
      </div>

      <p className="mt-6 leading-7 text-gray-400">
        {director.summary}
      </p>

      {director.primaryRecommendation ? (
        <div className="mt-7 rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
                Recomendación principal
              </p>

              <h3 className="mt-2 text-xl font-black text-white">
                {director.primaryRecommendation.title}
              </h3>
            </div>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${
                priorityStyles[
                  director.primaryRecommendation.priority
                ]
              }`}
            >
              {director.primaryRecommendation.priority}
            </span>
          </div>

          <p className="mt-3 leading-7 text-gray-300">
            {director.primaryRecommendation.description}
          </p>

          <p className="mt-3 text-sm text-gray-500">
            Motivo: {director.primaryRecommendation.reason}
          </p>

          <Link
            href={
              director.primaryRecommendation.action.href
            }
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-bold text-black transition hover:bg-cyan-400"
          >
            {director.primaryRecommendation.action.label}

            <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="font-bold text-white">
            Todo está bajo control
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            Crea un proyecto para que VYRO AI pueda comenzar a
            recomendarte acciones.
          </p>
        </div>
      )}

      <div className="mt-7 space-y-4">
        {director.recommendations
          .slice(1)
          .map((recommendation) => (
            <Link
              key={recommendation.id}
              href={recommendation.action.href}
              className="group flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-400/40 hover:bg-white/[0.06] sm:flex-row sm:items-center"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-bold text-white">
                    {recommendation.title}
                  </h3>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${
                      priorityStyles[
                        recommendation.priority
                      ]
                    }`}
                  >
                    {recommendation.priority}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  {recommendation.description}
                </p>
              </div>

              <ArrowRight
                className="text-cyan-400 transition group-hover:translate-x-1"
                size={20}
              />
            </Link>
          ))}
      </div>
    </section>
  );
}