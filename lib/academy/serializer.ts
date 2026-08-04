import type { AcademyCourse } from "./types";

export function serializeAcademyCourse(
  course: AcademyCourse,
): string {
  return JSON.stringify(course, null, 2);
}
