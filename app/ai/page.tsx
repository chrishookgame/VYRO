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

import { generateProject } from "@/services/ai/directorEngine";
import { generateSEO } from "@/services/ai/seo";
import { generateHashtags } from "@/services/ai/hashtags";

export default function AIPage() {
  const [project, setProject] = useState(generateProject(""));

  function handleGenerate(prompt: string) {
    setProject(generateProject(prompt));
  }

  const seo = generateSEO(project.title || "AI Video");

  return (
    <main className="min-h-screen bg-slate-950 p-8">
      <h1 className="mb-10 text-5xl font-bold text-cyan-400">
        VYRO AI DIRECTOR
      </h1>

      <div className="grid gap-8">
        <DirectorChat onGenerate={handleGenerate} />

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
            project.title || "AI"
          )}
        />

        <ThumbnailPreview
          image="https://placehold.co/1200x675"
        />

        <ExportPanel />
      </div>
    </main>
  );
}