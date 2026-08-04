"use client";

import { toPng } from "html-to-image";
import { useRef } from "react";

type Props = {
  children: React.ReactNode;
  fileName?: string;
};

export default function MemberCardExporter({
  children,
  fileName = "vyro-member-card",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  async function downloadCard() {
    if (!ref.current) return;

    const dataUrl = await toPng(ref.current, {
      pixelRatio: 3,
      cacheBust: true,
    });

    const link = document.createElement("a");
    link.download = `${fileName}.png`;
    link.href = dataUrl;
    link.click();
  }

  return (
    <div className="space-y-6">
      <div ref={ref}>
        {children}
      </div>

      <button
        onClick={downloadCard}
        className="rounded-xl bg-cyan-500 px-6 py-3 font-bold text-black transition hover:bg-cyan-400"
      >
        📥 Descargar Credencial PNG
      </button>
    </div>
  );
}
