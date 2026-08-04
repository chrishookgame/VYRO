"use client";

import Image from "next/image";
import { ImageIcon, Wand2 } from "lucide-react";

type ThumbnailPreviewProps = {
  image: string;
};

export default function ThumbnailPreview({
  image,
}: ThumbnailPreviewProps) {
  return (
    <div className="rounded-2xl border border-cyan-700 bg-slate-900 p-6">
      <div className="mb-6 flex items-center gap-3">
        <ImageIcon className="text-cyan-400" />

        <h2 className="text-2xl font-bold text-cyan-400">
          VYRO AI Thumbnail
        </h2>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-700">
        <Image
          src={image}
          alt="Vista previa de la miniatura generada por VYRO AI"
          width={1280}
          height={720}
          className="h-72 w-full object-cover"
        />
      </div>

      <button
        type="button"
        className="mt-6 flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 font-semibold text-white transition hover:bg-cyan-500"
      >
        <Wand2 size={18} />
        Regenerar miniatura
      </button>
    </div>
  );
}