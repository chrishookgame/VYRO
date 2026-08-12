"use client";

import {
  Download,
  FileText,
  ImageIcon,
  LoaderCircle,
  Save,
  Video,
} from "lucide-react";

type ExportPanelProps = {
  onExportScript?: () => void;
  onExportStoryboard?: () => void;
  onExportThumbnail?: () => void;
  onExportProject?: () => void;
  onSaveProject?: () => void;
  isSavingProject?: boolean;
  saveMessage?: string;
  saveError?: string;
};

export default function ExportPanel({
  onExportScript,
  onExportStoryboard,
  onExportThumbnail,
  onExportProject,
  onSaveProject,
  isSavingProject = false,
  saveMessage = "",
  saveError = "",
}: ExportPanelProps) {
  return (
    <div className="rounded-2xl border border-cyan-700 bg-slate-900 p-6">
      <div className="mb-6 flex items-center gap-3">
        <Download className="text-cyan-400" />

        <h2 className="text-2xl font-bold text-cyan-400">
          Export Project
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={onExportScript}
          className="flex items-center gap-3 rounded-xl bg-slate-800 p-4 transition hover:bg-slate-700"
        >
          <FileText />
          Export Script
        </button>

        <button
          type="button"
          onClick={onExportStoryboard}
          className="flex items-center gap-3 rounded-xl bg-slate-800 p-4 transition hover:bg-slate-700"
        >
          <Video />
          Export Storyboard
        </button>

        <button
          type="button"
          onClick={onExportThumbnail}
          className="flex items-center gap-3 rounded-xl bg-slate-800 p-4 transition hover:bg-slate-700"
        >
          <ImageIcon />
          Export Thumbnail
        </button>

        <button
          type="button"
          onClick={onExportProject}
          className="flex items-center gap-3 rounded-xl bg-cyan-600 p-4 font-semibold text-black transition hover:bg-cyan-500"
        >
          <Download />
          Export Full Project
        </button>
      </div>

      <div className="mt-6 border-t border-white/10 pt-6">
        <button
          type="button"
          onClick={onSaveProject}
          disabled={!onSaveProject || isSavingProject}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-500 p-4 font-black text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSavingProject ? (
            <>
              <LoaderCircle
                size={20}
                className="animate-spin"
              />
              Guardando proyecto...
            </>
          ) : (
            <>
              <Save size={20} />
              Guardar Proyecto en VYRO
            </>
          )}
        </button>

        {saveError ? (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          >
            {saveError}
          </p>
        ) : null}

        {saveMessage ? (
          <p
            aria-live="polite"
            className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
          >
            {saveMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
}