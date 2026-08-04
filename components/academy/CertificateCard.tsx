"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import QRCode from "react-qr-code";

import {
  generateCertificateSignature,
  getCertificateQrValue,
  type AcademyCertificate,
} from "@/lib/academy";
import { exportAcademyCertificatePdf } from "@/lib/academy/certificate.pdf";

type CertificateCardProps = {
  certificate: AcademyCertificate;
  onDelete: (courseId: string) => void;
};

export function CertificateCard({
  certificate,
  onDelete,
}: CertificateCardProps) {
  const [copied, setCopied] =
    useState(false);

  const [verificationUrl, setVerificationUrl] =
    useState("");

  const certificateSignature =
    useMemo(
      () =>
        generateCertificateSignature(
          certificate,
        ),
      [certificate],
    );

  useEffect(() => {
    setVerificationUrl(
      getCertificateQrValue(
        certificate,
        window.location.origin,
      ),
    );
  }, [certificate]);

  function handlePrint() {
    window.print();
  }

  function handleExportPdf() {
    const exported =
      exportAcademyCertificatePdf(
        certificate,
      );

    if (!exported) {
      window.alert(
        "El navegador bloqueó la ventana de exportación. Permite las ventanas emergentes e inténtalo nuevamente.",
      );
    }
  }

  async function handleCopyLink() {
    const url =
      verificationUrl ||
      getCertificateQrValue(
        certificate,
        window.location.origin,
      );

    try {
      await navigator.clipboard.writeText(
        url,
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (error) {
      console.error(
        "VYRO certificate link copy error:",
        error,
      );

      window.alert(
        "No fue posible copiar el enlace. Inténtalo nuevamente.",
      );
    }
  }

  const issuedDate =
    new Date(
      certificate.issuedAt,
    ).toLocaleDateString(
      "es-CL",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      },
    );

  return (
    <article className="certificate-print-area overflow-hidden rounded-3xl border border-violet-200 bg-white shadow-sm">
      <div className="border-b border-violet-100 bg-violet-950 px-6 py-5 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-200">
          VYRO Academy
        </p>

        <h3 className="mt-2 text-2xl font-bold">
          Certificado de finalización
        </h3>
      </div>

      <div className="p-6 md:p-10">
        <div className="text-center">
          <p className="text-sm uppercase tracking-widest text-gray-500">
            Se certifica que
          </p>

          <h4 className="mt-4 text-3xl font-bold text-violet-950 md:text-4xl">
            {certificate.studentName}
          </h4>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-gray-600">
            Ha completado satisfactoriamente el curso identificado como
          </p>

          <p className="mt-3 break-all text-lg font-semibold text-violet-700">
            {certificate.courseId}
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-gray-50 p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Resultado
            </p>

            <p className="mt-2 text-2xl font-bold text-violet-700">
              {certificate.percentage}%
            </p>
          </div>

          <div className="rounded-2xl bg-gray-50 p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Fecha de emisión
            </p>

            <p className="mt-2 font-semibold text-gray-900">
              {issuedDate}
            </p>
          </div>

          <div className="rounded-2xl bg-gray-50 p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Estado
            </p>

            <p className="mt-2 font-semibold text-green-700">
              Verificado
            </p>
          </div>
        </div>

        <div className="mt-10 grid items-center gap-6 border-t border-gray-200 pt-8 md:grid-cols-[minmax(0,1fr)_180px]">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Identificador del certificado
            </p>

            <p className="mt-2 break-all font-mono text-sm text-gray-700">
              {certificate.id}
            </p>

            <div className="mt-6 rounded-2xl border border-violet-100 bg-violet-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
                Firma digital VYRO
              </p>

              <p className="mt-2 break-all font-mono text-base font-bold tracking-wider text-violet-950">
                {certificateSignature}
              </p>

              <p className="mt-3 text-xs leading-5 text-violet-700">
                Esta huella permite comprobar si la información local del certificado fue modificada.
              </p>
            </div>

            <p className="mt-5 text-sm leading-6 text-gray-600">
              Escanea el código QR para verificar públicamente la autenticidad del certificado.
            </p>

            {verificationUrl ? (
              <p className="mt-3 break-all text-xs text-violet-700">
                {verificationUrl}
              </p>
            ) : null}
          </div>

          <div className="mx-auto rounded-2xl border border-gray-200 bg-white p-4">
            {verificationUrl ? (
              <QRCode
                value={verificationUrl}
                size={148}
                aria-label="Código QR de verificación del certificado"
              />
            ) : (
              <div className="flex h-[148px] w-[148px] items-center justify-center rounded-xl bg-gray-50 text-center text-xs text-gray-500">
                Preparando código QR...
              </div>
            )}
          </div>
        </div>

        {copied ? (
          <div
            role="status"
            className="certificate-actions mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700"
          >
            Enlace copiado correctamente.
          </div>
        ) : null}

        <div className="certificate-actions mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCopyLink}
            className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            Copiar enlace
          </button>

          <button
            type="button"
            onClick={handleExportPdf}
            className="rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700"
          >
            Exportar a PDF
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="rounded-xl border border-violet-200 px-5 py-3 font-semibold text-violet-700 transition hover:bg-violet-50"
          >
            Imprimir certificado
          </button>

          <button
            type="button"
            onClick={() =>
              onDelete(
                certificate.courseId,
              )
            }
            className="rounded-xl border border-red-200 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-50"
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}
