"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  generateCertificateSignature,
  verifyAcademyCertificate,
} from "@/lib/academy";

type VerificationResult =
  ReturnType<
    typeof verifyAcademyCertificate
  >;

export function CertificateVerifier() {
  const [
    certificateId,
    setCertificateId,
  ] = useState("");

  const [
    result,
    setResult,
  ] = useState<
    VerificationResult | null
  >(null);

  const [
    automaticVerification,
    setAutomaticVerification,
  ] = useState(false);

  useEffect(() => {
    const searchParams =
      new URLSearchParams(
        window.location.search,
      );

    const certificateIdFromUrl =
      searchParams.get("id")?.trim() ??
      "";

    if (!certificateIdFromUrl) {
      return;
    }

    setCertificateId(
      certificateIdFromUrl,
    );

    setResult(
      verifyAcademyCertificate(
        certificateIdFromUrl,
      ),
    );

    setAutomaticVerification(true);
  }, []);

  function handleVerify() {
    setAutomaticVerification(false);

    setResult(
      verifyAcademyCertificate(
        certificateId,
      ),
    );
  }

  function handleInputChange(
    value: string,
  ) {
    setCertificateId(value);
    setAutomaticVerification(false);
  }

  const certificateSignature =
    result?.certificate
      ? generateCertificateSignature(
          result.certificate,
        )
      : "";

  return (
    <section className="mt-10 rounded-2xl border bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">
        Verificación
      </p>

      <h2 className="mt-2 text-2xl font-bold">
        Verificar certificado
      </h2>

      <p className="mt-2 text-gray-600">
        Introduce el identificador del
        certificado o utiliza un enlace
        público para comprobar su
        autenticidad.
      </p>

      {automaticVerification ? (
        <div className="mt-5 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-medium text-violet-700">
          El certificado fue verificado
          automáticamente desde el enlace
          público.
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-4 md:flex-row">
        <input
          type="text"
          value={certificateId}
          onChange={(event) =>
            handleInputChange(
              event.target.value,
            )
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleVerify();
            }
          }}
          placeholder="ID del certificado"
          aria-label="Identificador del certificado"
          className="flex-1 rounded-xl border px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
        />

        <button
          type="button"
          onClick={handleVerify}
          className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700"
        >
          Verificar
        </button>
      </div>

      {result ? (
        <div
          role="status"
          className={[
            "mt-6 rounded-xl border p-5",
            result.valid
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50",
          ].join(" ")}
        >
          <p
            className={[
              "font-semibold",
              result.valid
                ? "text-green-800"
                : "text-red-800",
            ].join(" ")}
          >
            {result.message}
          </p>

          {result.certificate ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-white p-4">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Estudiante
                </p>

                <p className="mt-2 font-semibold text-gray-900">
                  {
                    result.certificate
                      .studentName
                  }
                </p>
              </div>

              <div className="rounded-xl bg-white p-4">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Curso
                </p>

                <p className="mt-2 break-all font-semibold text-gray-900">
                  {
                    result.certificate
                      .courseId
                  }
                </p>
              </div>

              <div className="rounded-xl bg-white p-4">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Resultado
                </p>

                <p className="mt-2 font-semibold text-violet-700">
                  {
                    result.certificate
                      .percentage
                  }
                  %
                </p>
              </div>

              <div className="rounded-xl bg-white p-4">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Fecha de emisión
                </p>

                <p className="mt-2 font-semibold text-gray-900">
                  {new Date(
                    result.certificate
                      .issuedAt,
                  ).toLocaleDateString(
                    "es-CL",
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-white p-4 sm:col-span-2">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Identificador verificado
                </p>

                <p className="mt-2 break-all font-mono text-sm text-gray-700">
                  {
                    result.certificate
                      .id
                  }
                </p>
              </div>

              <div className="rounded-xl border border-violet-100 bg-violet-50 p-4 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
                  Firma digital VYRO
                </p>

                <p className="mt-2 break-all font-mono text-base font-bold tracking-wider text-violet-950">
                  {certificateSignature}
                </p>

                <p className="mt-3 text-xs leading-5 text-violet-700">
                  Esta huella se calcula usando
                  los datos del certificado y
                  permite detectar modificaciones
                  en su información local.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
