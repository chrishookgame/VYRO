import type {
  AcademyCertificate,
} from "./certification";
import {
  getAllAcademyCertificates,
} from "./certification.repository";

export type CertificateVerificationResult = {
  valid: boolean;
  certificate: AcademyCertificate | null;
  message: string;
};

function normalizeCertificateId(
  certificateId: string,
): string {
  return certificateId.trim().toLowerCase();
}

export function findAcademyCertificateById(
  certificateId: string,
): AcademyCertificate | null {
  const normalizedId =
    normalizeCertificateId(
      certificateId,
    );

  if (!normalizedId) {
    return null;
  }

  return (
    getAllAcademyCertificates().find(
      (certificate) =>
        normalizeCertificateId(
          certificate.id,
        ) === normalizedId,
    ) ?? null
  );
}

export function verifyAcademyCertificate(
  certificateId: string,
): CertificateVerificationResult {
  const normalizedId =
    normalizeCertificateId(
      certificateId,
    );

  if (!normalizedId) {
    return {
      valid: false,
      certificate: null,
      message:
        "Escribe el identificador del certificado.",
    };
  }

  const certificate =
    findAcademyCertificateById(
      normalizedId,
    );

  if (!certificate) {
    return {
      valid: false,
      certificate: null,
      message:
        "No se encontró un certificado con ese identificador.",
    };
  }

  return {
    valid: true,
    certificate,
    message:
      "El certificado es válido y fue emitido por VYRO Academy.",
  };
}
