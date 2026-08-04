import type { GeneratedAcademyCourse } from "@/components/academy/AcademyAIGenerator";

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function readRequiredString(
  value: unknown,
  fieldName: string,
): string {
  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    throw new Error(
      `El campo "${fieldName}" es obligatorio.`,
    );
  }

  return value.trim();
}

function readOptionalString(
  value: unknown,
): string {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function readDuration(
  value: unknown,
): number {
  const duration = Number(value);

  if (
    !Number.isFinite(duration) ||
    duration < 0
  ) {
    return 0;
  }

  return Math.round(duration);
}

function extractJson(content: string): string {
  const cleanContent = content.trim();

  if (!cleanContent) {
    throw new Error(
      "La respuesta de VYRO AI está vacía.",
    );
  }

  const withoutMarkdown = cleanContent
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const firstBrace = withoutMarkdown.indexOf("{");
  const lastBrace = withoutMarkdown.lastIndexOf("}");

  if (
    firstBrace === -1 ||
    lastBrace === -1 ||
    lastBrace <= firstBrace
  ) {
    throw new Error(
      "La respuesta de VYRO AI no contiene un JSON válido.",
    );
  }

  return withoutMarkdown.slice(
    firstBrace,
    lastBrace + 1,
  );
}

export function parseGeneratedAcademyCourse(
  content: string,
): GeneratedAcademyCourse {
  let parsedValue: unknown;

  try {
    parsedValue = JSON.parse(
      extractJson(content),
    ) as unknown;
  } catch (error) {
    console.error(
      "VYRO Academy JSON parsing failed:",
      error,
    );

    throw new Error(
      "No fue posible interpretar el curso generado por la IA.",
    );
  }

  if (!isRecord(parsedValue)) {
    throw new Error(
      "La respuesta generada no tiene una estructura de curso válida.",
    );
  }

  const title = readRequiredString(
    parsedValue.title,
    "title",
  );

  const description = readOptionalString(
    parsedValue.description,
  );

  if (!Array.isArray(parsedValue.modules)) {
    throw new Error(
      'El campo "modules" debe ser una lista.',
    );
  }

  const modules = parsedValue.modules.map(
    (moduleValue, moduleIndex) => {
      if (!isRecord(moduleValue)) {
        throw new Error(
          `El módulo ${moduleIndex + 1} no es válido.`,
        );
      }

      const moduleTitle = readRequiredString(
        moduleValue.title,
        `modules[${moduleIndex}].title`,
      );

      const moduleDescription =
        readOptionalString(
          moduleValue.description,
        );

      if (!Array.isArray(moduleValue.lessons)) {
        throw new Error(
          `El módulo "${moduleTitle}" no contiene una lista de lecciones válida.`,
        );
      }

      const lessons = moduleValue.lessons.map(
        (lessonValue, lessonIndex) => {
          if (!isRecord(lessonValue)) {
            throw new Error(
              `La lección ${lessonIndex + 1} del módulo "${moduleTitle}" no es válida.`,
            );
          }

          return {
            title: readRequiredString(
              lessonValue.title,
              `modules[${moduleIndex}].lessons[${lessonIndex}].title`,
            ),
            description: readOptionalString(
              lessonValue.description,
            ),
            content: readOptionalString(
              lessonValue.content,
            ),
            durationMinutes: readDuration(
              lessonValue.durationMinutes,
            ),
          };
        },
      );

      if (lessons.length === 0) {
        throw new Error(
          `El módulo "${moduleTitle}" debe contener al menos una lección.`,
        );
      }

      return {
        title: moduleTitle,
        description: moduleDescription,
        lessons,
      };
    },
  );

  if (modules.length === 0) {
    throw new Error(
      "El curso generado debe contener al menos un módulo.",
    );
  }

  return {
    title,
    description,
    modules,
  };
}
