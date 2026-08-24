import { getErrorMessage } from "@/lib/core";

import type {
  AcademyCertificate,
} from "./certification";

const STORAGE_KEY =
  "vyro-academy-certificates";

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

function loadCertificates(): AcademyCertificate[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw =
      window.localStorage.getItem(
        STORAGE_KEY,
      );

    if (!raw) {
      return [];
    }

    const parsed =
      JSON.parse(raw) as unknown;

    return Array.isArray(parsed)
      ? (parsed as AcademyCertificate[])
      : [];
  } catch (error) {
    console.error(
      "VYRO certificate repository read error:",
      getErrorMessage(error),
    );

    return [];
  }
}

function saveCertificates(
  certificates: AcademyCertificate[],
): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(certificates),
  );
}

export function saveAcademyCertificate(
  certificate: AcademyCertificate,
): AcademyCertificate[] {
  const certificates =
    loadCertificates();

  const existingIndex =
    certificates.findIndex(
      (savedCertificate) =>
        savedCertificate.courseId ===
        certificate.courseId,
    );

  const updatedCertificates =
    existingIndex >= 0
      ? certificates.map(
          (
            savedCertificate,
            index,
          ) =>
            index === existingIndex
              ? certificate
              : savedCertificate,
        )
      : [
          certificate,
          ...certificates,
        ];

  saveCertificates(
    updatedCertificates,
  );

  return updatedCertificates;
}

export function getAcademyCertificate(
  courseId: string,
): AcademyCertificate | null {
  return (
    loadCertificates().find(
      (certificate) =>
        certificate.courseId === courseId,
    ) ?? null
  );
}

export function getAllAcademyCertificates(): AcademyCertificate[] {
  return loadCertificates();
}

export function removeAcademyCertificate(
  courseId: string,
): AcademyCertificate[] {
  const updatedCertificates =
    loadCertificates().filter(
      (certificate) =>
        certificate.courseId !== courseId,
    );

  saveCertificates(
    updatedCertificates,
  );

  return updatedCertificates;
}

export function clearAcademyCertificates(): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(
    STORAGE_KEY,
  );
}
