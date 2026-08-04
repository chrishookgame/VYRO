"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";

type Props = {
  children: React.ReactNode;
  fileName?: string;
};

export default function MemberCardPdfExporter({
  children,
  fileName = "vyro-member-card",
}: Props) {

  const ref = useRef<HTMLDivElement>(null);

  async function exportPdf() {

    if (!ref.current) return;

    const canvas = await html2canvas(
      ref.current,
      {
        scale: 3,
        useCORS: true,
      },
    );

    const image =
      canvas.toDataURL(
        "image/png",
      );

    const pdf =
      new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

    const width = 180;

    const height =
      (canvas.height * width) /
      canvas.width;

    pdf.addImage(
      image,
      "PNG",
      15,
      20,
      width,
      height,
    );

    pdf.save(
      `${fileName}.pdf`,
    );

  }

  return (

    <div className="space-y-6">

      <div ref={ref}>

        {children}

      </div>

      <button
        onClick={exportPdf}
        className="rounded-xl bg-red-500 px-6 py-3 font-bold text-white transition hover:bg-red-400"
      >

        📄 Descargar PDF

      </button>

    </div>

  );

}
