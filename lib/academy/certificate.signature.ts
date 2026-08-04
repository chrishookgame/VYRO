import type {
  AcademyCertificate,
} from "./certification";

function hashString(
  value: string,
): string {
  let hash = 0;

  for (let i = 0; i < value.length; i++) {
    hash =
      (hash << 5) -
      hash +
      value.charCodeAt(i);

    hash |= 0;
  }

  return Math.abs(hash)
    .toString(36)
    .toUpperCase();
}

export function generateCertificateSignature(
  certificate: AcademyCertificate,
): string {
  return hashString(
    [
      certificate.id,
      certificate.studentName,
      certificate.courseId,
      certificate.percentage,
      certificate.issuedAt,
    ].join("|"),
  );
}
