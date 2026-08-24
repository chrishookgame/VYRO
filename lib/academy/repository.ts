import { getErrorMessage } from "@/lib/core";

import type { AcademyCourse } from "./types";

const STORAGE_KEY = "vyro-academy-courses";

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

export function getSavedAcademyCourses(): AcademyCourse[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const storedCourses =
      window.localStorage.getItem(STORAGE_KEY);

    if (!storedCourses) {
      return [];
    }

    const parsedCourses =
      JSON.parse(storedCourses) as unknown;

    return Array.isArray(parsedCourses)
      ? (parsedCourses as AcademyCourse[])
      : [];
  } catch (error) {
    console.error(
      "VYRO Academy repository read error:",
      getErrorMessage(error),
    );

    return [];
  }
}

export function saveAcademyCourse(
  course: AcademyCourse,
): AcademyCourse[] {
  if (!canUseStorage()) {
    return [];
  }

  const currentCourses =
    getSavedAcademyCourses();

  const courseIndex =
    currentCourses.findIndex(
      (savedCourse) =>
        savedCourse.id === course.id,
    );

  const updatedCourses =
    courseIndex >= 0
      ? currentCourses.map(
          (savedCourse, index) =>
            index === courseIndex
              ? course
              : savedCourse,
        )
      : [course, ...currentCourses];

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedCourses),
  );

  return updatedCourses;
}

export function getSavedAcademyCourse(
  courseId: string,
): AcademyCourse | null {
  return (
    getSavedAcademyCourses().find(
      (course) => course.id === courseId,
    ) ?? null
  );
}

export function deleteSavedAcademyCourse(
  courseId: string,
): AcademyCourse[] {
  if (!canUseStorage()) {
    return [];
  }

  const updatedCourses =
    getSavedAcademyCourses().filter(
      (course) => course.id !== courseId,
    );

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedCourses),
  );

  return updatedCourses;
}

export function clearSavedAcademyCourses(): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(
    STORAGE_KEY,
  );
}
