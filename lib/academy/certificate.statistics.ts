import {
  getAllAcademyCertificates,
} from "./certification.repository";

export type CertificateStatistics = {
  totalCertificates: number;
  totalStudents: number;
  averageScore: number;
  bestScore: number;
  latestCertificateDate: string | null;
};

export function getCertificateStatistics(): CertificateStatistics {
  const certificates =
    getAllAcademyCertificates();

  const totalCertificates =
    certificates.length;

  const totalStudents =
    new Set(
      certificates.map(
        (certificate) =>
          certificate.studentName,
      ),
    ).size;

  const bestScore =
    certificates.reduce(
      (best, certificate) =>
        Math.max(
          best,
          certificate.percentage,
        ),
      0,
    );

  const averageScore =
    totalCertificates === 0
      ? 0
      : Number(
          (
            certificates.reduce(
              (sum, certificate) =>
                sum +
                certificate.percentage,
              0,
            ) / totalCertificates
          ).toFixed(1),
        );

  const latestCertificateDate =
    certificates.length === 0
      ? null
      : certificates
          .slice()
          .sort(
            (a, b) =>
              new Date(
                b.issuedAt,
              ).getTime() -
              new Date(
                a.issuedAt,
              ).getTime(),
          )[0].issuedAt;

  return {
    totalCertificates,
    totalStudents,
    averageScore,
    bestScore,
    latestCertificateDate,
  };
}
