import type {
  AcademyCourse,
  AcademyLesson,
  AcademyModule,
} from "./types";

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function readString(
  value: unknown,
  fallback = "",
): string {
  return typeof value === "string"
    ? value.trim()
    : fallback;
}

function readStringArray(
  value: unknown,
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is string =>
        typeof item === "string",
    )
    .map((item) => item.trim())
    .filter(Boolean);
}

function readNumber(
  value: unknown,
  fallback = 0,
): number {
  const result = Number(value);

  return Number.isFinite(result)
    ? result
    : fallback;
}

function extractJson(content: string): string {
  const cleanContent = content
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const firstBrace = cleanContent.indexOf("{");
  const lastBrace = cleanContent.lastIndexOf("}");

  if (
    firstBrace === -1 ||
    lastBrace === -1 ||
    lastBrace <= firstBrace
  ) {
    throw new Error(
      "La respuesta de la IA no contiene un JSON válido.",
    );
  }

  return cleanContent.slice(
    firstBrace,
    lastBrace + 1,
  );
}

function parseLesson(
  value: unknown,
): AcademyLesson {
  if (!isRecord(value)) {
    throw new Error(
      "Una de las lecciones generadas no es válida.",
    );
  }

  return {
    id: readString(value.id),
    title: readString(value.title),
    description: readString(value.description),
    content: readString(value.content),
    durationMinutes: Math.max(
      0,
      Math.round(
        readNumber(value.durationMinutes),
      ),
    ),
  };
}

function parseModule(
  value: unknown,
): AcademyModule {
  if (!isRecord(value)) {
    throw new Error(
      "Uno de los módulos generados no es válido.",
    );
  }

  const lessons = Array.isArray(value.lessons)
    ? value.lessons.map(parseLesson)
    : [];

  return {
    id: readString(value.id),
    title: readString(value.title),
    description: readString(value.description),
    lessons,
  };
}

export function parseAcademyCourse(
  content: string,
): AcademyCourse {
  let parsed: unknown;

  try {
    parsed = JSON.parse(
      extractJson(content),
    ) as unknown;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      "La respuesta de la IA no contiene un JSON válido.",
    );
  }

  if (!isRecord(parsed)) {
    throw new Error(
      "La respuesta generada no representa un curso válido.",
    );
  }

  const modules = Array.isArray(parsed.modules)
    ? parsed.modules.map(parseModule)
    : [];

  const totalMinutes = modules.reduce(
    (courseTotal, academyModule) =>
      courseTotal +
      academyModule.lessons.reduce(
        (moduleTotal, lesson) =>
          moduleTotal +
          lesson.durationMinutes,
        0,
      ),
    0,
  );

  const level =
    parsed.level === "intermediate" ||
    parsed.level === "advanced"
      ? parsed.level
      : "beginner";

  const description = readString(
    parsed.description,
  );

  return {
    id: readString(parsed.id),
    title: readString(parsed.title),
    description,
    objective: readString(
      parsed.objective,
      description,
    ),
    level,
    estimatedHours: Math.max(
      1,
      readNumber(
        parsed.estimatedHours,
        Math.ceil(totalMinutes / 60),
      ),
    ),
    skills: readStringArray(parsed.skills),
    prerequisites: readStringArray(
      parsed.prerequisites,
    ),
    modules,
    finalProject: readString(
      parsed.finalProject,
      "Completar un proyecto final aplicando los conocimientos adquiridos.",
    ),
    certificate:
      typeof parsed.certificate === "boolean"
        ? parsed.certificate
        : false,
  };
}
