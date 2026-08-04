import type {
  AcademyCourse,
  AcademyPlayerState,
} from "./index";

import {
  calculateAcademyProgress,
} from "./player";

export type AcademyCertificate = {
  id: string;
  courseId: string;
  studentName: string;
  issuedAt: string;
  percentage: number;
};

export function canIssueCertificate(
  course: AcademyCourse,
  playerState: AcademyPlayerState,
): boolean {
  const progress =
    calculateAcademyProgress(
      course,
      playerState,
    );

  return (
    progress.completedLessons ===
    progress.totalLessons
  );
}

export function createCertificate(
  course: AcademyCourse,
  studentName: string,
  percentage: number,
): AcademyCertificate {
  return {
    id: crypto.randomUUID(),
    courseId: course.id,
    studentName,
    issuedAt: new Date().toISOString(),
    percentage,
  };
}
