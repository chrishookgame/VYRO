"use client";

import {
  Download,
  FileText,
  Video,
  ImageIcon,
} from "lucide-react";

type ExportPanelProps = {
  onExportScript?: () => void;
  onExportStoryboard?: () => void;
  onExportThumbnail?: () => void;
  onExportProject?: () => void;
};

export default function ExportPanel({
  onExportScript,
  onExportStoryboard,
  onExportThumbnail,
  onExportProject,
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
          onClick={onExportScript}
          className="flex items-center gap-3 rounded-xl bg-slate-800 p-4 transition hover:bg-slate-700"
        >
          <FileText />
          Export Script
        </button>

        <button
          onClick={onExportStoryboard}
          className="flex items-center gap-3 rounded-xl bg-slate-800 p-4 transition hover:bg-slate-700"
        >
          <Video />
          Export Storyboard
        </button>

        <button
          onClick={onExportThumbnail}
          className="flex items-center gap-3 rounded-xl bg-slate-800 p-4 transition hover:bg-slate-700"
        >
          <ImageIcon />
          Export Thumbnail
        </button>

        <button
          onClick={onExportProject}
          className="flex items-center gap-3 rounded-xl bg-cyan-600 p-4 font-semibold text-black transition hover:bg-cyan-500"
        >
          <Download />
          Export Full Project
        </button>

      </div>

    </div>
  );
}