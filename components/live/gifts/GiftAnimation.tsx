"use client";

interface GiftAnimationProps {
  icon: string;
  title: string;
}

export default function GiftAnimation({
  icon,
  title,
}: GiftAnimationProps) {

  return (
    <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
      <div className="animate-bounce rounded-3xl border border-cyan-400/30 bg-black/80 px-10 py-8 shadow-2xl">
        <div className="text-center">
          <div className="text-7xl">{icon}</div>

          <h2 className="mt-4 text-2xl font-black text-white">
            {title}
          </h2>

          <p className="mt-2 text-cyan-400">
            Gift enviado en VYRO LIVE
          </p>
        </div>
      </div>
    </div>
  );

}
