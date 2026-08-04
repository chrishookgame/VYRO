"use client";

import {
  Brain,
  CheckCircle2,
  LoaderCircle,
  Sparkles,
  WandSparkles,
  X,
} from "lucide-react";
import { useState } from "react";

type GeneratedAcademyCourse = {
  title: string;
  description: string;
  modules: Array<{
    title: string;
    description: string;
    lessons: Array<{
      title: string;
      description: string;
      content: string;
      durationMinutes: number;
    }>;
  }>;
};

type AcademyAIGeneratorProps = {
  generating: boolean;
  saving: boolean;
  generatedCourse: GeneratedAcademyCourse | null;
  error: string;
  message: string;
  onGenerate: (prompt: string) => void;
  onSave: (course: GeneratedAcademyCourse) => void;
  onReset: () => void;
};

export default function AcademyAIGenerator({
  generating,
  saving,
  generatedCourse,
  error,
  message,
  onGenerate,
  onSave,
  onReset,
}: AcademyAIGeneratorProps) {
  const [prompt, setPrompt] = useState("");

  function handleGenerate() {
    const cleanPrompt = prompt.trim();

    if (!cleanPrompt || generating) {
      return;
    }

    onGenerate(cleanPrompt);
  }

  function handleReset() {
    setPrompt("");
    onReset();
  }

  return (
    <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#08111D] via-[#0B1220] to-[#101827] p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-500/10">
            <Brain
              className="text-cyan-400"
              size={29}
            />
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-cyan-400">
              VYRO Academy AI
            </p>

            <h2 className="mt-1 text-2xl font-black text-white">
              Generador inteligente de cursos
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">
              Describe el curso que deseas construir y VYRO preparará
              una estructura completa con módulos, lecciones, contenido
              y duración estimada.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-bold text-cyan-300">
            <Sparkles size={17} />
            Academy Generator
          </div>

          <p className="mt-1 text-xs text-gray-400">
            Conectado al VYRO AI Engine
          </p>
        </div>
      </div>

      <div className="mt-7">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-gray-300">
            ¿Qué curso quieres generar?
          </span>

          <textarea
            value={prompt}
            onChange={(event) => {
              setPrompt(event.target.value);
            }}
            rows={6}
            disabled={generating || saving}
            placeholder="Ejemplo: Crea un curso profesional de diplomacia para principiantes con 6 módulos, actividades prácticas, casos de estudio y una evaluación final."
            className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={
              generating ||
              saving ||
              prompt.trim().length === 0
            }
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-4 font-black text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {generating ? (
              <LoaderCircle
                className="animate-spin"
                size={20}
              />
            ) : (
              <WandSparkles size={20} />
            )}

            {generating
              ? "Generando curso..."
              : "Generar curso completo"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={generating || saving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-gray-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X size={19} />
            Limpiar
          </button>
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          {error}
        </p>
      ) : null}

      {message ? (
        <p
          aria-live="polite"
          className="mt-5 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-200"
        >
          {message}
        </p>
      ) : null}

      {generatedCourse ? (
        <article className="mt-7 rounded-3xl border border-cyan-400/30 bg-cyan-500/[0.06] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
                Vista previa del curso
              </p>

              <h3 className="mt-2 text-2xl font-black text-white">
                {generatedCourse.title}
              </h3>

              <p className="mt-3 max-w-4xl leading-7 text-gray-300">
                {generatedCourse.description}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center">
              <p className="text-2xl font-black text-cyan-300">
                {generatedCourse.modules.length}
              </p>

              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Módulos
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {generatedCourse.modules.map(
              (academyModule, moduleIndex) => (
                <section
                  key={`${academyModule.title}-${moduleIndex}`}
                  className="rounded-2xl border border-white/10 bg-black/10 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-sm font-black text-cyan-300">
                      {moduleIndex + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="font-black text-white">
                        {academyModule.title}
                      </h4>

                      <p className="mt-2 text-sm leading-6 text-gray-400">
                        {academyModule.description}
                      </p>

                      <div className="mt-4 space-y-2">
                        {academyModule.lessons.map(
                          (lesson, lessonIndex) => (
                            <div
                              key={`${lesson.title}-${lessonIndex}`}
                              className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3"
                            >
                              <CheckCircle2
                                className="mt-0.5 shrink-0 text-cyan-400"
                                size={17}
                              />

                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-white">
                                  {lesson.title}
                                </p>

                                <p className="mt-1 text-xs leading-5 text-gray-500">
                                  {lesson.description}
                                </p>

                                <p className="mt-2 text-xs font-semibold text-cyan-300">
                                  {lesson.durationMinutes} minutos
                                </p>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              ),
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              onSave(generatedCourse);
            }}
            disabled={saving || generating}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 font-black text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <LoaderCircle
                className="animate-spin"
                size={20}
              />
            ) : (
              <CheckCircle2 size={20} />
            )}

            {saving
              ? "Guardando curso..."
              : "Aprobar y guardar curso"}
          </button>
        </article>
      ) : null}
    </section>
  );
}

export type {
  GeneratedAcademyCourse,
};