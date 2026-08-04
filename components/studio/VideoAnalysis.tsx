"use client";

interface VideoAnalysisProps {
  analysis: {
    duration: string;
    resolution: string;
    language: string;
    viralScore: number;
  } | null;
}

export default function VideoAnalysis({
  analysis,
}: VideoAnalysisProps) {

  if (!analysis) return null;

  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-[#0B1220] p-6">

      <h2 className="text-xl font-bold text-white">
        Video Analysis
      </h2>

      <div className="mt-6 space-y-4">

        <div className="flex justify-between">
          <span className="text-gray-400">Duration</span>
          <span className="text-white">{analysis.duration}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Resolution</span>
          <span className="text-white">{analysis.resolution}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Language</span>
          <span className="text-white">{analysis.language}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Viral Score</span>
          <span className="text-cyan-400 font-bold">
            {analysis.viralScore}%
          </span>
        </div>

      </div>

    </div>
  );
}