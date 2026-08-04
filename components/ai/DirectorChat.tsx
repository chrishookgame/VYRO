"use client";

import { useState } from "react";

type DirectorChatProps = {
  onGenerate: (prompt: string) => void;
};

export default function DirectorChat({
  onGenerate,
}: DirectorChatProps) {
  const [prompt, setPrompt] = useState("");

  function handleGenerate() {
    if (!prompt.trim()) return;

    onGenerate(prompt);
  }

  return (
    <div className="rounded-2xl border border-cyan-700 bg-slate-900 p-6">
      <h2 className="mb-4 text-2xl font-bold text-cyan-400">
        AI Director
      </h2>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe tu video..."
        className="h-40 w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-white outline-none"
      />

      <button
        onClick={handleGenerate}
        className="mt-5 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400"
      >
        Generar Proyecto
      </button>
    </div>
  );
}