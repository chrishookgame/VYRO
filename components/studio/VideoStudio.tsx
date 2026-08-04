"use client";

import { Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import AIDirector from "@/components/dashboard/AIDirector";
import ThumbnailGenerator from "@/components/studio/ThumbnailGenerator";
import VideoAnalysis from "@/components/studio/VideoAnalysis";

import {
  analyzeVideo,
  type VideoAnalysis as VideoAnalysisType,
} from "@/services/ai/videoAI";

export default function VideoStudio() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [videoURL, setVideoURL] = useState("");
  const [analysis, setAnalysis] = useState<VideoAnalysisType | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (videoURL) {
        URL.revokeObjectURL(videoURL);
      }
    };
  }, [videoURL]);

  async function handleSelect(file: File) {
    setError("");
    setAnalysis(null);
    setIsAnalyzing(true);

    if (!file.type.startsWith("video/")) {
      setError("Selecciona un archivo de video válido.");
      setIsAnalyzing(false);
      return;
    }

    const url = URL.createObjectURL(file);

    setVideoURL((currentURL) => {
      if (currentURL) {
        URL.revokeObjectURL(currentURL);
      }

      return url;
    });

    try {
      const result = await analyzeVideo(file);
      setAnalysis(result);
    } catch (analysisError) {
      console.error("VYRO video analysis failed:", analysisError);

      setError(
        "VYRO no pudo analizar el video. Intenta nuevamente con otro archivo.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  function openFilePicker() {
    inputRef.current?.click();
  }

  return (
    <section className="space-y-8">
      <header className="overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#0B1220] to-[#111827] p-8">
        <p className="font-bold uppercase tracking-[0.35em] text-cyan-400">
          VYRO Creator Studio
        </p>

        <h1 className="mt-4 max-w-4xl text-4xl font-black text-white md:text-5xl">
          Convierte tu video en una experiencia inteligente
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-gray-400 md:text-lg">
          Sube tu video, analízalo con VYRO AI, genera una miniatura y
          prepáralo para publicar dentro del ecosistema VYRO.
        </p>
      </header>

      <input
        ref={inputRef}
        hidden
        type="file"
        accept="video/*"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            void handleSelect(file);
          }

          event.target.value = "";
        }}
      />

      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-200"
        >
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <button
          type="button"
          onClick={openFilePicker}
          className="min-h-[430px] rounded-3xl border-2 border-dashed border-cyan-500/30 bg-[#111827] p-6 text-left transition duration-300 hover:border-cyan-400 hover:bg-[#152033] focus:outline-none focus:ring-2 focus:ring-cyan-400 xl:col-span-2 md:p-10"
          aria-label={
            videoURL
              ? "Seleccionar otro video"
              : "Seleccionar un video para VYRO Creator Studio"
          }
        >
          {!videoURL ? (
            <div className="flex h-full min-h-[350px] flex-col items-center justify-center text-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-500/10 shadow-[0_0_60px_rgba(34,211,238,0.2)]">
                <Upload size={58} className="text-cyan-400" />
              </div>

              <h2 className="mt-8 text-3xl font-bold text-white">
                Sube tu video a VYRO
              </h2>

              <p className="mt-4 max-w-lg text-gray-400">
                Haz clic para elegir un video. VYRO AI lo analizará y
                preparará recomendaciones para mejorar su rendimiento.
              </p>

              <span className="mt-7 rounded-2xl bg-cyan-500 px-6 py-3 font-bold text-black">
                Seleccionar video
              </span>
            </div>
          ) : (
            <div className="space-y-5">
              <video
                src={videoURL}
                controls
                playsInline
                className="max-h-[620px] w-full rounded-2xl bg-black object-contain"
              />

              <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-white">
                    Video cargado correctamente
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    Puedes reproducirlo o seleccionar otro archivo.
                  </p>
                </div>

                <span className="rounded-xl border border-cyan-400/30 px-4 py-2 text-sm font-semibold text-cyan-300">
                  Cambiar video
                </span>
              </div>
            </div>
          )}
        </button>

        <aside className="space-y-6">
          <AIDirector />

          {isAnalyzing ? (
            <div
              aria-live="polite"
              className="rounded-3xl border border-cyan-500/20 bg-[#0B1220] p-6"
            >
              <p className="font-bold uppercase tracking-[0.25em] text-cyan-400">
                VYRO AI
              </p>

              <h2 className="mt-3 text-xl font-bold text-white">
                Analizando tu video
              </h2>

              <p className="mt-2 text-gray-400">
                Estamos revisando el contenido para preparar recomendaciones.
              </p>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-2/3 animate-pulse rounded-full bg-cyan-400" />
              </div>
            </div>
          ) : (
            <VideoAnalysis analysis={analysis} />
          )}

          <ThumbnailGenerator />
        </aside>
      </div>
    </section>
  );
}