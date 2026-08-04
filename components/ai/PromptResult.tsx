"use client";

type PromptResultProps = {
  prompt: string;
};

export default function PromptResult({
  prompt,
}: PromptResultProps) {
  return (
    <div className="rounded-2xl border border-cyan-700 bg-slate-900 p-6">

      <h2 className="mb-4 text-2xl font-bold text-cyan-400">
        AI Prompt
      </h2>

      <div className="rounded-xl bg-slate-800 p-5">

        <pre className="whitespace-pre-wrap break-words text-sm text-gray-300">
          {prompt || "No prompt generated yet."}
        </pre>

      </div>

    </div>
  );
}