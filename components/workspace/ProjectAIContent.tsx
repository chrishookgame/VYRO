"use client";

import Image from "next/image";
import {
  FileText,
  Hash,
  ImageIcon,
  Search,
  Sparkles,
  Video,
} from "lucide-react";

export type AIProjectScene = {
  id: number;
  title: string;
  camera: string;
  narration: string;
};

export type AIProjectSeo = {
  title?: string;
  description?: string;
  keywords?: string[];
  hashtags?: string[];
};

export type AIProjectContentData = {
  project_id: string;
  source_prompt: string;
  script: string;
  scenes: AIProjectScene[];
  seo: AIProjectSeo;
  thumbnail_data_url: string | null;
  created_at: string;
  updated_at: string;
};

type ProjectAIContentProps = {
  content: AIProjectContentData | null;
};

export default function ProjectAIContent({
  content,
}: ProjectAIContentProps) {
  if (!content) {
    return (
      <section className="rounded-3xl border border-white/10 bg-[#0B1220] p-6">
        <div className="flex items-center gap-3">
          <Sparkles className="text-cyan-400" size={24} />

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
              VYRO AI Content
            </p>

            <h2 className="mt-1 text-2xl font-black text-white">
              Sin contenido AI guardado
            </h2>
          </div>
        </div>

        <p className="mt-5 leading-7 text-gray-400">
          Este proyecto todavía no tiene un proyecto audiovisual
          generado y guardado con VYRO AI Director.
        </p>
      </section>
    );
  }

  const scenes = Array.isArray(content.scenes)
    ? content.scenes
    : [];

  const keywords = Array.isArray(content.seo?.keywords)
    ? content.seo.keywords
    : [];

  const hashtags = Array.isArray(content.seo?.hashtags)
    ? content.seo.hashtags
    : [];

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#08111D] to-[#0B1220] p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10">
            <Sparkles className="text-cyan-400" size={24} />
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
              VYRO AI Director
            </p>

            <h2 className="mt-1 text-2xl font-black text-white">
              Contenido AI del proyecto
            </h2>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
            Proyecto generado
          </p>

          <p className="mt-2 text-lg font-bold text-white">
            {content.source_prompt}
          </p>
        </div>
      </div>

      {content.thumbnail_data_url ? (
        <div className="rounded-3xl border border-white/10 bg-[#0B1220] p-6">
          <div className="mb-5 flex items-center gap-3">
            <ImageIcon className="text-cyan-400" size={22} />

            <h3 className="text-xl font-black text-white">
              Thumbnail
            </h3>
          </div>

          <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black">
            <Image
              src={content.thumbnail_data_url}
              alt="Thumbnail generada por VYRO AI"
              fill
              unoptimized
              sizes="(max-width: 1500px) 100vw, 1500px"
              className="object-contain"
            />
          </div>
        </div>
      ) : null}

      <div className="rounded-3xl border border-white/10 bg-[#0B1220] p-6">
        <div className="mb-5 flex items-center gap-3">
          <Video className="text-cyan-400" size={22} />

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
              Storyboard
            </p>

            <h3 className="mt-1 text-xl font-black text-white">
              {scenes.length} escenas
            </h3>
          </div>
        </div>

        {scenes.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {scenes.map((scene, index) => (
              <article
                key={`${scene.id}-${index}`}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-black text-cyan-300">
                    Escena {index + 1}
                  </span>

                  <span className="text-xs text-gray-500">
                    #{scene.id}
                  </span>
                </div>

                <h4 className="mt-4 text-lg font-black text-white">
                  {scene.title}
                </h4>

                <p className="mt-3 text-sm leading-6 text-cyan-300">
                  Cámara: {scene.camera}
                </p>

                {scene.narration ? (
                  <p className="mt-3 text-sm leading-6 text-gray-400">
                    {scene.narration}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">
            No hay escenas guardadas para este proyecto.
          </p>
        )}
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#0B1220] p-6">
        <div className="mb-5 flex items-center gap-3">
          <FileText className="text-cyan-400" size={22} />

          <h3 className="text-xl font-black text-white">
            AI Script
          </h3>
        </div>

        <div className="whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/20 p-5 font-mono text-sm leading-7 text-gray-300">
          {content.script}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#0B1220] p-6">
        <div className="flex items-center gap-3">
          <Search className="text-cyan-400" size={22} />

          <h3 className="text-xl font-black text-white">
            SEO Optimization
          </h3>
        </div>

        {content.seo?.title ? (
          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
              Título SEO
            </p>

            <p className="mt-2 font-bold text-white">
              {content.seo.title}
            </p>
          </div>
        ) : null}

        {content.seo?.description ? (
          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
              Descripción
            </p>

            <p className="mt-2 leading-7 text-gray-300">
              {content.seo.description}
            </p>
          </div>
        ) : null}

        {keywords.length > 0 ? (
          <div className="mt-6">
            <div className="flex items-center gap-2">
              <Search className="text-cyan-400" size={17} />

              <p className="text-sm font-black text-white">
                Keywords
              </p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full bg-cyan-500/10 px-3 py-1.5 text-sm font-bold text-cyan-300"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {hashtags.length > 0 ? (
          <div className="mt-6">
            <div className="flex items-center gap-2">
              <Hash className="text-violet-400" size={17} />

              <p className="text-sm font-black text-white">
                Hashtags
              </p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {hashtags.map((hashtag) => (
                <span
                  key={hashtag}
                  className="rounded-full bg-violet-500/10 px-3 py-1.5 text-sm font-bold text-violet-300"
                >
                  {hashtag}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}