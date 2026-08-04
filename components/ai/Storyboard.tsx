"use client";

type Scene = {
  id: number;
  title: string;
  camera: string;
};

type StoryboardProps = {
  scenes: Scene[];
};

export default function Storyboard({
  scenes,
}: StoryboardProps) {
  return (
    <div className="rounded-2xl border border-cyan-700 bg-slate-900 p-6">

      <h2 className="mb-6 text-2xl font-bold text-cyan-400">
        Storyboard
      </h2>

      {scenes.length === 0 ? (
        <div className="rounded-xl bg-slate-800 p-6 text-center text-gray-400">
          No storyboard generated.
        </div>
      ) : (
        <div className="space-y-4">
          {scenes.map((scene) => (
            <div
              key={scene.id}
              className="rounded-xl bg-slate-800 p-5"
            >
              <h3 className="font-bold text-white">
                Scene {scene.id}
              </h3>

              <p className="mt-2 text-gray-300">
                {scene.title}
              </p>

              <p className="mt-2 text-cyan-400">
                Camera: {scene.camera}
              </p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}