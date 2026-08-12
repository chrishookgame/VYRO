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
import { supabase } from "@/lib/supabase";
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

  const [thumbnailImage, setThumbnailImage] =
    useState("");

  const [thumbnailError, setThumbnailError] =
    useState("");

  const [isGeneratingThumbnail, setIsGeneratingThumbnail] =
    useState(false);

  const [isSavingProject, setIsSavingProject] =
    useState(false);

  const [saveMessage, setSaveMessage] =
    useState("");

  const [saveError, setSaveError] =
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

  async function handleGenerateThumbnail() {
    if (
      !project.title.trim() ||
      isGeneratingThumbnail
    ) {
      return;
    }

    setIsGeneratingThumbnail(true);
    setThumbnailError("");

    try {
      const prompt = `
Create a premium cinematic thumbnail for this VYRO AI project.

Project title:
${project.title}

Visual direction:
- Futuristic cinematic composition
- Strong focal point
- Premium high-end visual identity
- Dramatic lighting
- High contrast
- Professional composition
- No watermark
- No UI elements
- No random text
- Designed as a video thumbnail
- 16:9 composition
      `.trim();

      const response = await fetch(
        "/api/ai/image",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
          }),
        },
      );

      const result = (await response.json()) as {
        success?: boolean;
        image?: string;
        error?: string;
      };

      if (
        !response.ok ||
        !result.success ||
        !result.image
      ) {
        throw new Error(
          result.error ||
            "VYRO Image AI no pudo generar la miniatura.",
        );
      }

      setThumbnailImage(result.image);
    } catch (thumbnailGenerationError) {
      console.error(
        "VYRO Thumbnail generation failed:",
        thumbnailGenerationError,
      );

      setThumbnailError(
        thumbnailGenerationError instanceof Error
          ? thumbnailGenerationError.message
          : "No fue posible generar la miniatura.",
      );
    } finally {
      setIsGeneratingThumbnail(false);
    }
  }

  async function handleSaveProject() {
    if (
      !project.title.trim() ||
      !project.script.trim() ||
      project.scenes.length === 0 ||
      isSavingProject
    ) {
      return;
    }

    setIsSavingProject(true);
    setSaveMessage("");
    setSaveError("");

    let createdProjectId = "";

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error(
          "Debes iniciar sesión para guardar el proyecto.",
        );
      }

      const currentSeo = generateSEO(
        project.title,
      );

      const hashtags = generateHashtags(
        "youtube",
        project.title,
      );

      const {
        data: createdProject,
        error: projectError,
      } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          title: project.title,
          description:
            "Proyecto generado con VYRO AI Director.",
          module: "creator",
          status: "active",
          progress: 0,
        })
        .select("id")
        .single();

      if (projectError || !createdProject) {
        console.error(
          "VYRO AI project creation failed:",
          projectError,
        );

        throw new Error(
          "No fue posible crear el proyecto en VYRO.",
        );
      }

      createdProjectId = createdProject.id;

      const {
        error: contentError,
      } = await supabase
        .from("ai_project_content")
        .insert({
          project_id: createdProjectId,
          user_id: user.id,
          source_prompt: project.title,
          script: project.script,
          scenes: project.scenes,
          seo: {
            title: currentSeo.title,
            description: currentSeo.description,
            keywords: currentSeo.keywords,
            hashtags,
          },
          thumbnail_data_url:
            thumbnailImage || null,
        });

      if (contentError) {
        console.error(
          "VYRO AI project content save failed:",
          contentError,
        );

        const { error: rollbackError } =
          await supabase
            .from("projects")
            .delete()
            .eq("id", createdProjectId)
            .eq("user_id", user.id);

        if (rollbackError) {
          console.error(
            "VYRO AI project rollback failed:",
            rollbackError,
          );
        }

        throw new Error(
          "No fue posible guardar el contenido del proyecto.",
        );
      }

      setSaveMessage(
        "Proyecto guardado correctamente en VYRO.",
      );
    } catch (saveProjectError) {
      console.error(
        "VYRO AI save project failed:",
        saveProjectError,
      );

      setSaveError(
        saveProjectError instanceof Error
          ? saveProjectError.message
          : "No fue posible guardar el proyecto.",
      );
    } finally {
      setIsSavingProject(false);
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
            image={thumbnailImage}
            isGenerating={isGeneratingThumbnail}
            error={thumbnailError}
            onGenerate={
              project.title
                ? () => {
                    void handleGenerateThumbnail();
                  }
                : undefined
            }
          />

          <ExportPanel
            onSaveProject={
              project.title &&
              project.script &&
              project.scenes.length > 0
                ? () => {
                    void handleSaveProject();
                  }
                : undefined
            }
            isSavingProject={isSavingProject}
            saveMessage={saveMessage}
            saveError={saveError}
          />
        </div>
      </div>
    </main>
  );
}