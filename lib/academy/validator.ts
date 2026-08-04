import type { AcademyCourse } from "./types";

export type AcademyValidationResult = {
  valid: boolean;
  errors: string[];
};

export function inspectAcademyCourse(
  course: AcademyCourse,
): AcademyValidationResult {
  const errors: string[] = [];

  if (!course.title.trim()) {
    errors.push(
      "El curso debe tener un título.",
    );
  }

  if (!course.description.trim()) {
    errors.push(
      "El curso debe tener una descripción.",
    );
  }

  if (!course.objective.trim()) {
    errors.push(
      "El curso debe tener un objetivo.",
    );
  }

  if (course.estimatedHours <= 0) {
    errors.push(
      "La duración estimada debe ser mayor que cero.",
    );
  }

  if (course.modules.length === 0) {
    errors.push(
      "El curso debe contener al menos un módulo.",
    );
  }

  course.modules.forEach(
    (academyModule, moduleIndex) => {
      if (!academyModule.title.trim()) {
        errors.push(
          `El módulo ${moduleIndex + 1} debe tener un título.`,
        );
      }

      if (
        academyModule.lessons.length === 0
      ) {
        errors.push(
          `El módulo "${academyModule.title || moduleIndex + 1}" debe contener al menos una lección.`,
        );
      }

      academyModule.lessons.forEach(
        (lesson, lessonIndex) => {
          if (!lesson.title.trim()) {
            errors.push(
              `La lección ${lessonIndex + 1} del módulo ${moduleIndex + 1} debe tener un título.`,
            );
          }

          if (lesson.durationMinutes < 0) {
            errors.push(
              `La duración de la lección "${lesson.title}" no puede ser negativa.`,
            );
          }
        },
      );
    },
  );

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateAcademyCourse(
  course: AcademyCourse,
): boolean {
  return inspectAcademyCourse(course).valid;
}

export function assertAcademyCourse(
  course: AcademyCourse,
): void {
  const result = inspectAcademyCourse(
    course,
  );

  if (!result.valid) {
    throw new Error(
      result.errors.join(" "),
    );
  }
}
