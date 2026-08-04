"use client";

import {
  useEffect,
  useState,
} from "react";

import { CertificateCard } from "@/components/academy/CertificateCard";
import {
  getAllAcademyCertificates,
  removeAcademyCertificate,
  type AcademyCertificate,
} from "@/lib/academy";

export function CertificateHistory() {
  const [
    certificates,
    setCertificates,
  ] = useState<AcademyCertificate[]>([]);

  useEffect(() => {
    setCertificates(
      getAllAcademyCertificates(),
    );
  }, []);

  function handleDelete(
    courseId: string,
  ) {
    const updatedCertificates =
      removeAcademyCertificate(
        courseId,
      );

    setCertificates(
      updatedCertificates,
    );
  }

  if (certificates.length === 0) {
    return (
      <section className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
          VYRO Academy
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          Certificados
        </h2>

        <p className="mt-4 text-gray-600">
          Todavía no hay certificados emitidos.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
            VYRO Academy
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Historial de certificados
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Consulta, imprime o elimina tus certificados.
          </p>
        </div>

        <span className="rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">
          {certificates.length} certificados
        </span>
      </div>

      <div className="space-y-6">
        {certificates.map(
          (certificate) => (
            <CertificateCard
              key={certificate.id}
              certificate={certificate}
              onDelete={handleDelete}
            />
          ),
        )}
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }

          .certificate-print-area,
          .certificate-print-area * {
            visibility: visible;
          }

          .certificate-print-area {
            position: absolute;
            inset: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
          }

          .certificate-actions {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
