"use client";

import Image from "next/image";
import {
  ImageIcon,
  LoaderCircle,
  Wand2,
} from "lucide-react";

type ThumbnailPreviewProps = {
  image: string;
  isGenerating?: boolean;
  error?: string;
  onGenerate?: () => void;
};

export default function ThumbnailPreview({
  image,
  isGenerating = false,
  error = "",
  onGenerate,
}: ThumbnailPreviewProps) {
  return (
    <div className="rounded-2xl border border-cyan-700 bg-slate-900 p-6">
      <div className="mb-6 flex items-center gap-3">
        <ImageIcon className="text-cyan-400" />

        <h2 className="text-2xl font-bold text-cyan-400">
          VYRO AI Thumbnail
        </h2>
      </div>

      {image ? (
        <div className="relative aspect-video overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
          <Image
            src={image}
            alt="Vista previa de la miniatura generada por VYRO AI"
            fill
            unoptimized
            sizes="(max-width: 1600px) 100vw, 1600px"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex min-h-72 items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950/50">
          <div className="text-center">
            <ImageIcon
              size={42}
              className="mx-auto text-slate-600"
            />

            <p className="mt-4 text-sm text-slate-400">
              Genera una miniatura con VYRO Image AI.
            </p>
          </div>
        </div>
      )}

      {error ? (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200"
        >
          {error}
        </div>
      ) : null}

      <button
        type="button"
        onClick={onGenerate}
        disabled={!onGenerate || isGenerating}
        className="mt-6 flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isGenerating ? (
          <LoaderCircle
            size={18}
            className="animate-spin"
          />
        ) : (
          <Wand2 size={18} />
        )}

        {isGenerating
          ? "Generando miniatura..."
          : image
            ? "Regenerar miniatura"
            : "Generar miniatura"}
      </button>
    </div>
  );
}