"use client";

type SceneCardProps = {
  id: number;
  title: string;
  camera: string;
  voice: string;
  effect: string;
};

export default function SceneCard({
  id,
  title,
  camera,
  voice,
  effect,
}: SceneCardProps) {
  return (
    <div className="rounded-2xl border border-cyan-700 bg-slate-900 p-6 transition hover:border-cyan-400">

      <div className="flex items-center justify-between">

        <h2 className="text-xl font-bold text-cyan-400">
          Scene {id}
        </h2>

        <span className="rounded-full bg-cyan-500 px-3 py-1 text-sm font-semibold text-black">
          READY
        </span>

      </div>

      <div className="mt-5 space-y-3">

        <div>
          <p className="text-sm text-gray-400">
            Title
          </p>

          <p className="text-white">
            {title}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-400">
            Camera
          </p>

          <p className="text-cyan-300">
            {camera}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-400">
            Voice
          </p>

          <p className="text-white">
            {voice}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-400">
            Effect
          </p>

          <p className="text-violet-300">
            {effect}
          </p>
        </div>

      </div>

    </div>
  );
}