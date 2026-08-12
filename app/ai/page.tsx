"use client";

import { useState } from "react";

import {
  DirectorChat,
  PromptResult,
  Storyboard,
  Timeline,
  ScriptViewer,
  SEOCard,
  ThumbnailPreview,
  ExportPanel,
} from "@/components/ai";

import { runAI } from "@/lib/ai/client";
import { generateSEO } from "@/services/ai/seo";
import { generateHashtags } from "@/services/ai/hashtags";

type DirectorScene = {
  id: number;
  title: string;
  camera: string;
  narration: string;
};

type DirectorProject = {
  title: string;
  script: string;
  scenes: DirectorScene[];
};

const emptyProject: DirectorProject = {
  title: "",
  script: "",
  scenes: [],
};

function parseDirectorProject(
  content: string,
): DirectorProject {
  const parsed = JSON.parse(content) as Partial<DirectorProject>;

  if (
    typeof parsed.title !== "string" ||
    typeof parsed.script !== "string" ||
    !Array.isArray(parsed.scenes)
  ) {
    throw new Error("Respuesta AI inválida.");
  }

  const scenes = parsed.scenes.map((scene, index) => {
    if (
      typeof scene !== "object" ||
      scene === null
    ) {
      throw new Error("Escena AI inválida.");
    }

    const raw = scene as Partial<DirectorScene>;

    return {
      id:
        typeof raw.id === "number"
          ? raw.id
          : index + 1,
      title:
        typeof raw.title === "string"
          ? raw.title
          : `Escena ${index + 1}`,
      camera:
        typeof raw.camera === "string"
          ? raw.camera
          : "Plano cinematográfico",
      narration:
        typeof raw.narration === "string"
          ? raw.narration
          : "",
    };
  });

  return {
    title: parsed.title,
    script: parsed.script,
    scenes,
  };
}

export default function AIPage() {
  const [project, setProject] =
    useState<DirectorProject>(emptyProject);

  const [isGenerating, setIsGenerating] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleGenerate(
    prompt: string,
  ) {
    if (!prompt.trim() || isGenerating) {
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const response = await runAI({
        module: "creator",
        provider: "openai",
        systemPrompt: `
Eres VYRO AI Director, un director creativo cinematográfico.

Tu tarea es convertir la idea del usuario en un proyecto audiovisual profesional.

Devuelve ÚNICAMENTE JSON válido.
No uses markdown.
No uses bloques de código.
No escribas texto antes ni después del JSON.

La estructura debe ser exactamente:

{
  "title": "Título profesional del proyecto",
  "script": "Guion narrativo completo",
  "scenes": [
    {
      "id": 1,
      "title": "Nombre de la escena",
      "camera": "Tipo de plano, movimiento y dirección de cámara",
      "narration": "Narración o diálogo de esta escena"
    }
  ]
}

Reglas:
- Genera entre 4 y 8 escenas.
- Mantén coherencia narrativa.
- Haz que cada escena sea visualmente distinta.
- Respeta la duración solicitada por el usuario.
- El script debe estar listo para producción.
- El contenido debe estar en el idioma del usuario.
        `.trim(),
        userPrompt: prompt,
        temperature: 0.7,
        maxTokens: 2200,
      });

      if (!response.success) {
        throw new Error(
          response.error ||
            "VYRO AI no pudo generar el proyecto.",
        );
      }

      const generatedProject =
        parseDirectorProject(response.content);

      setProject(generatedProject);
    } catch (generationError) {
      console.error(
        "VYRO AI Director generation failed:",
        generationError,
      );

      setError(
        generationError instanceof Error
          ? generationError.message
          : "No fue posible generar el proyecto.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  const seo = generateSEO(
    project.title || "AI Video",
  );

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white sm:p-8">
      <div className="mx-auto max-w-[1600px]">
        <h1 className="mb-10 text-4xl font-bold text-cyan-400 sm:text-5xl">
          VYRO AI DIRECTOR
        </h1>

        <div className="grid gap-8">
          <DirectorChat
            onGenerate={(prompt) => {
              void handleGenerate(prompt);
            }}
          />

          {isGenerating ? (
            <section className="rounded-2xl border border-cyan-700 bg-slate-900 p-6">
              <p className="font-bold text-cyan-400">
                VYRO AI está creando tu proyecto...
              </p>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-2/3 animate-pulse rounded-full bg-cyan-400" />
              </div>
            </section>
          ) : null}

          {error ? (
            <div
              role="alert"
              className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-200"
            >
              {error}
            </div>
          ) : null}

          <PromptResult prompt={project.title} />

          <Storyboard scenes={project.scenes} />

          <Timeline
            items={project.scenes.map((scene) => ({
              id: scene.id,
              title: scene.title,
              duration: 5,
            }))}
          />

          <ScriptViewer script={project.script} />

          <SEOCard
            title={seo.title}
            description={seo.description}
            keywords={seo.keywords}
            hashtags={generateHashtags(
              "youtube",
              project.title || "AI",
            )}
          />

          <ThumbnailPreview
            image="https://placehold.co/1200x675"
          />

          <ExportPanel />
        </div>
      </div>
    </main>
  );
}