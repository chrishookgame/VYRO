"use client";

import { ImageIcon } from "lucide-react";

export default function ThumbnailGenerator() {
  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-[#0B1220] p-6">
      <div className="flex items-center gap-3">
        <ImageIcon
          className="text-cyan-400"
          size={30}
        />

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
            VYRO AI
          </p>

          <h2 className="text-2xl font-black text-white">
            Thumbnail Generator
          </h2>
        </div>
      </div>

      <div className="mt-6 flex h-52 items-center justify-center rounded-2xl border border-dashed border-cyan-500/20">
        <span className="text-gray-500">
          Vista previa de la miniatura
        </span>
      </div>

      <button
        type="button"
        className="mt-6 w-full rounded-2xl bg-cyan-500 py-4 font-bold text-black transition hover:bg-cyan-400"
      >
        Generar miniatura
      </button>
    </div>
  );
}