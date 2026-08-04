"use client";

type ScriptViewerProps = {
  script: string;
};

export default function ScriptViewer({
  script,
}: ScriptViewerProps) {
  return (
    <div className="rounded-2xl border border-cyan-700 bg-slate-900 p-6">

      <h2 className="mb-6 text-2xl font-bold text-cyan-400">
        AI Script
      </h2>

      <div className="rounded-xl bg-slate-800 p-6">

        <pre className="whitespace-pre-wrap leading-7 text-gray-300">
          {script || "No script generated yet."}
        </pre>

      </div>

    </div>
  );
}