import type {
  AcademyCertificate,
} from "./certification";

export function getCertificateVerificationUrl(
  certificate: AcademyCertificate,
  origin: string,
): string {
  const url = new URL(
    "/academy/verify",
    origin,
  );

  url.searchParams.set(
    "id",
    certificate.id,
  );

  return url.toString();
}

export function getCertificateQrValue(
  certificate: AcademyCertificate,
  origin: string,
): string {
  return getCertificateVerificationUrl(
    certificate,
    origin,
  );
}
